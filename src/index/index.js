import $ from "jquery";
import { saveAs } from "file-saver";
import domtoimage from "dom-to-image";
import Cookies from "js-cookie";
import introJs from "intro.js";
import iconMap from "../../static/iconMap";
import introSteps from "../../static/introSteps";

/* stylePrefix is the value of the checked radio box.
   this value will be used as class name of the keys to
   apply a particular style to the keys */
var stylePrefix = $('#keyStyles').val();

// Pre Defining some global variables
var userText = "";
var keysArray = ""
var htmlCode = "";
var fsSupported = false;

const customFonts = JSON.parse(localStorage.getItem("customFonts")) || [
	"Poppins", "Custom", "Roboto", "Open+Sans",
	"Lato", "Montserrat", "Roboto+Condensed",
	"Source+Sans+Pro", "Oswald", "Roboto+Mono",
	"Raleway", "Ubuntu", "Nunito", "Roboto+Slab",
	"PT+Sans", "Merriweather", "Inter", "Rubik",
	"Nunito+Sans", "Work+Sans", "Nanum+Gothic",
	"Fira+Sans", "Quicksand", "Titillium+Web",
	"Barlow", "Inconsolata", "Bebas+Neue",
	"Josefin+Sans", "Oxygen", "Source+Code+Pro",
	"Mulish", "Yanone+Kaffeesatz", "Cabin",
	"DM+Sans", "Abel", "Padauk", "Varela+Round",
	"Comfortaa", "Exo+2", "Kanit", "Overpass",
	"Ubuntu+Mono", "Staatliches", "Acme"
];

// Asynchronously Add All the fonts in #fontStyles
(async() => {
	for (let i = 0; i < customFonts.length; i++) {
		let newOption = document.createElement("option")
		let fontCode = customFonts[i]
		newOption.innerText = fontCode.replace(/\+/g, ' ')
		newOption.value = fontCode
		$('#fontStyles').append(newOption).val("Poppins")
	}
	
	$("#fontStyles option")[0].innerText = "Default"
})($, customFonts, document)

try { new Blob; fsSupported = true; }
catch (e) { fsSupported = false; }

// Convert base64 data to Blob
function dataURItoBlob(dataURI) {
	var byteString = atob(dataURI.split(',')[1]);
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
	var ab = new ArrayBuffer(byteString.length);
	var ia = new Uint8Array(ab);
	for (var i = 0; i < byteString.length; i++) { ia[i] = byteString.charCodeAt(i); }
	var blob = new Blob([ab], {type: mimeString});
	return blob;
}

async function hideLoader(hide) { // Will be used To Hide/Unhide The Loader while generating the Image.
	if (hide == true) $("#loader").css("display", "none");
	if (hide == false) $("#loader").css("display", "block");
}

function appendImg(url) { // appendImg function to append generated image to the output div
	let img = new Image(); // Making new Image HTML Element
	img.src = url; // Changing new image's url
	$("#img-preview").html(""); // Emptying the output
	$("#img-preview").append(img); // Appending the new created image element to our output
	$("#preview-div").css("display", "block"); // And changing the output element's parent display to block
}

async function saveAsPng() { // Function to generate HTML to PNG
	hideLoader(false)
	let element = $('#htmlCode'), scale = prompt("Enter the Scale: ", 2);

	if (scale == null) return; // If user clicked cancel in the prompt then return nothing to stop the function
	if (isNaN(scale) === false) scale = parseInt(scale); // If the scale is a number either it's in string format or integer format convert it to integer format
	else scale = 2; // If the given input is not a integer in string format or integer format than set the scale to 2

	// If scale is greater than 10 then confirm if the user wants to continue because I tested and any scale greater than 10 can cause performance issue
	if (scale > 10 && !confirm("Are You Sure? Scale More than 10 Can Make your Device Lag")) {
		return;
	}

	/* So here I am getting the height/width of the element times the scale
		and rounding it to the nearest integer and getting the final number
		which would be divisible by 10 */
	let Width = Math.round(element.width() * scale/10)*10;
	let Height = Math.round(element.height() * scale/10)*10;

	domtoimage.toPng(element[0], {
			width: Width, // Setting The width of the output Image
			height: Height, // Setting the height of the output image
			style: { // Setting the scale and the transform origin
				transform: 'scale('+scale+')',
				transformOrigin: 'top left'
			}
		})
		.then(function (dataUrl) {
			if (fsSupported === true) {
				saveAs(dataURItoBlob(dataUrl), "key2Img-"+Width+"x"+Height+".png");
			} else {
				appendImg(dataUrl);
				$("#output-demension").text("Height: "+Height+"px, Width: "+Width);
			}
			hideLoader(true)
		}) // calling the appendImg function and passing the generated image data as parameter and then changing the output div's text with the respective height and width
		.catch(function (err) {
			console.error(err)
			new Toast({ message: `oops, something went wrong!,\n${err}`, type: 'danger' });
			hideLoader(true)
		}); // If something goes wrong calling the alert function with showing the error
}

async function saveAsJpeg() { // Function To Generate HTML To JPG
	hideLoader(false) // Unhide The Loader
	let element = $('#htmlCode');
	let scale = prompt("Enter the Scale: ", 2);
	let quality = prompt("Quality (0.1 - 1): ", 0.5);

	if (scale == null || quality == null) return;
	if (isNaN(scale) === false || isNaN(quality) === false) {
		scale = parseInt(scale);
		quality = parseFloat(quality)
	}

	if (scale === 0 || quality === 0) {
		scale = 1;
	}

	if (quality > 1) quality = 0.5;

	if (scale > 10 && !confirm("Are You Sure? Scale More than 10 Can Make your Device Lag")) {
		return;
	}

	// So Here's some dope Einstein level calculation done here, you better don't try to understand it
	let Width = Math.round(element.width() * scale/10)*10;
	let Height = Math.round(element.height() * scale/10)*10;

	domtoimage.toJpeg(element[0], {
			quality: quality,
			width: Width, // Setting The width of the output Image
			height: Height, // Setting the height of the output image
			style: { // Setting the scale and the transform origin
				transform: 'scale('+scale+')',
				transformOrigin: 'top left',
				background: "#fff"
			}
		})
		.then(function (dataUrl) {
			// Check if fileSaver is Supported
			if (fsSupported === true) {
				// If File Saver is Supported Save The File.
				saveAs(dataURItoBlob(dataUrl), "key2Img-"+Width+"x"+Height+".jpeg");
			} else {
				// If File Saver is not supported then Append the image to html so that user can manually download the image.
				appendImg(dataUrl); // Append The Image To HTML
				$("#output-demension").text(`Height: ${Height}px, Width: ${Width}px`); // Add the Image properties (height width) To HTML
			}
			hideLoader(true) // Hide the Loader
		})
		.catch((err) => {
			console.error(err)
			new Toast({ message: `oops, something went wrong!,\n${err}`, type: 'danger' });
			hideLoader(true)
		});
}

const replaceIco = (str) => {
	return str.split(' ').map((s) => iconMap[s] ?? s).join(' ');
};

async function renderKeys() {
	var userText = $('#text-input').val(); // User's Input Text
	var keysArray = userText.split("+").map(replaceIco); // Split user's input with + and replace any icon code in the array items with the corresponding HTML code given in iconMap.js
	keysArray = $.map(keysArray, $.trim); // Trim any extra space in start or end of any item in the Array
	keysArray = keysArray.filter(item => item); // Remove empty strings from the array
	var htmlCode = ""; // Empty variable which will store all the output code

	// If Input is Empty Then Put Default Ctrl + Alt + C in HTML Preview
	if (userText == "") {
		htmlCode = "<kbd class="+stylePrefix+">Ctrl</kbd>+<kbd class="+stylePrefix+">Alt</kbd>+<kbd class="+stylePrefix+">C</kbd>";
	}
	else {
		for (let i = 0; i < keysArray.length; i++) { // Run a For Loop
			if (i == keysArray.length - 1) htmlCode += "<kbd class="+stylePrefix+">"+ keysArray[i] + "</kbd>"; // If the current element is the last element then don't use + in the end
			else htmlCode += "<kbd class="+stylePrefix+">"+ keysArray[i] + "</kbd>+"; // Else Put code with +
		}
	}

	$('#kbdCode').html(htmlCode); // Finally Change the Output div's html with new one
	return 0; // IDK Why i did it here LMAO
}

$("#saveJpg").on("click", saveAsJpeg); // Run saveAsJpeg if Jpeg Button is Clicked
$("#savePng").on("click", saveAsPng); // Run saveAsPng if PNG Button is Clicked
$('#text-input').keyup(renderKeys); // Render the user's Input when he releases any key
$("#keyStyles").on("change", () => { // Run a function when someone selects a new Option
	stylePrefix = $('#keyStyles').val(); // set the stylePrefix to the currently selected value
	renderKeys(); // Render the keys with new selected options
})

window.onload = async (e) => {
	// Cookies.remove("firstTime");
	if (Cookies.get("firstTime") == undefined) {
		Cookies.set('firstTime', 'no', { expires: 3652.5 }); // 3652.5 is 10 years
		introJs().setOptions({ steps: introSteps }).start();
	}

	var fontLink = $('#font-link')
	var fontSelector = $('#fontStyles')
	var htmlPreview = $('#htmlCode')

	htmlPreview.css('font-family', "'Poppins', sans-serif")

	fontSelector.on('change', async () => {
		if (fontSelector.val() == "Custom") {
			let fontName = prompt("Enter a font name from 'fonts.google.com'")

			if (fontName == null || fontName == "") {
				fontSelector.val("Poppins")
				return;
			} else if (customFonts.includes(fontName.replace(/ /g, '+').trim())) {
				fontSelector.val(fontName.replace(/ /g, '+').trim())
				new Toast({ message: 'The font is already in the dropdown menu.', type: 'danger' });
				return;
			}

			fontName.trim()
			let fontCode = fontName.replace(/ /g, '+')

			try {
				await fetch(`https://fonts.googleapis.com/css?family=${fontCode}&display=swap`)					
			} catch (error) {
				fontSelector.val("Poppins");
				new Toast({ message: "Font doesn't exist.", type: 'danger' });
				return;
			}

			let newOption = document.createElement("option")
			newOption.innerText = fontCode
			newOption.value = fontCode.replace(/ /g, '+')
			$('#fontStyles').append(newOption).val(fontCode)
			$('#font-link').attr('href', `https://fonts.googleapis.com/css?family=${fontCode}&display=swap`)
			$('#htmlCode').css('font-family', `'${fontName}', 'Poppins', sans-serif`)
			customFonts.push(fontCode)
			localStorage.setItem("customFonts", JSON.stringify(customFonts))
		} else {
			fontLink.attr('href', `https://fonts.googleapis.com/css?family=${fontSelector.val()}&display=swap`)
			htmlPreview.css('font-family', `'${$("#fontStyles option:selected" ).text()}', 'Poppins', sans-serif`)
		}
	});

	$("#web-usage").on("click", () => introJs().setOptions({ steps: introSteps }).start())

	renderKeys(); // Calling renderKeys Function when the window loads
}