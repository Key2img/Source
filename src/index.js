import $ from "jquery";
import { saveAs } from "file-saver";
import domtoimage from "dom-to-image";
import Cookies from "js-cookie";
import introJs from "intro.js";
import iconMap from "../static/iconMap";
import introSteps from "../static/introSteps"

var stylePrefix = $('#keyStyles').val(); // stylePrefix is the value of the checked radio box. this value will be used as class name of the keys to apply a particular style to the keys
var userText = "", keysArray = "", htmlCode = "", fileSaverSupported; // Pre Defining some variables

try { let isFileSaverSupported = !!new Blob; fileSaverSupported = true; }
catch (e) { fileSaverSupported = false; }

function dataURItoBlob(dataURI) {
	var byteString = atob(dataURI.split(',')[1]);
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
	var ab = new ArrayBuffer(byteString.length);
	var ia = new Uint8Array(ab);
	for (var i = 0; i < byteString.length; i++) { ia[i] = byteString.charCodeAt(i); }
	var blob = new Blob([ab], {type: mimeString});
	return blob;
}

function hideLoader(hide) {
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

function saveAsPng() { // Function to generate HTML to PNG
	hideLoader(false)
	let element = $('#htmlCode'), scale = prompt("Enter the Scale: ", 2);

	if (scale == null) return; // If user clicked cancel in the prompt then return nothing to stop the function
	if (isNaN(scale) === false) scale = parseInt(scale); // If the scale is a number either it's in string format or integer format convert it to integer format
	else scale = 2; // If the given input is not a integer in string format or integer format than set the scale to 2

	if (scale > 10) if (!confirm("Are You Sure? Scale More than 10 Can Make your Device Lag")) return; // If scale is greater than 10 then confirm if the user wants to continue because I tested and any scale greater than 10 can cause performance issue

	/*  So here I am getting the height/width of the element times the scale
		and rounding it to the nearest integer and getting the final number
		which would be divisible by 10 */
	let Width = Math.round(element.width() * scale/10)*10;
	let Height = Math.round(element.height() * scale/10)*10;

	domtoimage.toPng(element[0], {
			width: Width, // Setting The width of the output Image
			height: Height, // Setting the height of the output image
			style: { transform: 'scale('+scale+')', transformOrigin: 'top left'} // Setting the scale and the transform origin
		})
		.then(function (dataUrl) {
			if (fileSaverSupported === true) saveAs(dataURItoBlob(dataUrl), "key2Img-"+Width+"x"+Height+".png");
			else {
				appendImg(dataUrl);
				$("#output-demension").text("Height: "+Height+"px, Width: "+Width);
			}
			hideLoader(true)
		}) // calling the appendImg function and passing the generated image data as parameter and then changing the output div's text with the respective height and width
		.catch(function (error) { alert('oops, something went wrong!\n' + error); hideLoader(true) }); // If something goes wrong calling the alert function with showing the error
}

function saveAsJpeg() { // Function To Generate HTML To JPG
	hideLoader(false)
	let element = $('#htmlCode'), scale = prompt("Enter the Scale: ", 2), quality = prompt("Quality (0.1 - 1): ", 0.5);

	if (scale == null || quality == null) return;
	if (isNaN(scale) === false || isNaN(quality) === false) { scale = parseInt(scale); quality = parseFloat(quality) }
	if (scale === 0 || quality === 0) { scale = 1; parseFloat(0.5); }
	if (quality > 1) quality = 0.5;

	if (scale > 10) if (!confirm("Are You Sure? Scale More than 10 Can Make your Device Lag")) return;

	//  So Here's some dope Einstein level calculation done here, you better don't try to understand it
	let Width = Math.round(element.width() * scale/10)*10;
	let Height = Math.round(element.height() * scale/10)*10;

	domtoimage.toJpeg(element[0], {
			quality: quality,
			width: Width, // Setting The width of the output Image
			height: Height, // Setting the height of the output image
			style: { transform: 'scale('+scale+')', transformOrigin: 'top left', background: "#fff"} // Setting the scale and the transform origin
		})
		.then(function (dataUrl) {
			if (fileSaverSupported === true) saveAs(dataURItoBlob(dataUrl), "key2Img-"+Width+"x"+Height+".jpeg");
			else {
				appendImg(dataUrl);
				$("#output-demension").text("Height: "+Height+"px, Width: "+Width);
			}
			hideLoader(true)
		})
		.catch(function (error) { alert('oops, something went wrong!\n' + error); hideLoader(true) });
}

const replaceIco = (str) => {
	return str.split(' ').map((s) => iconMap[s] ?? s).join(' ');
};

function renderKeys() {
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

window.onload = e => {
	// Cookies.remove("firstTime");
	if (Cookies.get("firstTime") == undefined) {
		Cookies.set('firstTime', 'no', { expires: 3652.5 }); // 3652.5 is 10 years
		introJs().setOptions({ steps: introSteps }).start();
	}

	$("#web-usage").on("click", () => introJs().setOptions({ steps: introSteps }).start())

	renderKeys(); // Calling renderKeys Function when the window loads
}