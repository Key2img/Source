var stylePrefix = $('input[name=style]:checked').val(); // stylePrefix is the value of the checked radio box. this value will be used as class name of the keys to apply a particular style to the keys
var userText, keysArray, htmlCode = ""; // Pre Defining some variables

function appendImg(imageData) {
	let img = new Image();
	img.src = imageData;
	$("#img-preview").html("");
	$("#img-preview").append(img);
	$("#preview-div").css("display", "block");
}

function saveAsPng() {
	let element = $('#html-output'), scale = prompt("Enter the Scale: ", 2);

	if (scale == null) return;
	if (isNaN(scale) === false) scale = parseInt(scale);
	else scale = 2;

	if (scale > 10) {
		if (!confirm("Are You Sure? Scale More than 10 Can Make your Device Lag")) return;
	}

	domtoimage.toPng(element[0], {
			width: element.width() * scale,
			height: element.height() * scale,
			style: { transform: 'scale('+scale+')', transformOrigin: 'top left'}
		})
		.then(function (dataUrl) { appendImg(dataUrl) })
		.catch(function (error) { console.error('oops, something went wrong!', error); });
}

function saveAsSvg() {
	const filter = (node) => { return (node.tagName !== 'i'); }

	domtoimage.toSvg(document.getElementById('html-output'), {filter: filter})
		.then(function (dataUrl) { appendImg(dataUrl) })
		.catch(function (error) { console.error('oops, something went wrong!', error); });
}

function renderKeys() {
	var userText = $('#text-input').val(); // User's Input Text
	var keysArray = userText.split("+").filter(e =>  e); // Split user's input with + and remove any empty string "" using filter
	var htmlCode = ""; // Empty variable which will store all the output code

	for (let i = 0; i < keysArray.length; i++) {
		// Replace Text With Respective Fontawesome-free-5.15.4-web HTML Code
		keysArray[i] = keysArray[i].replace("ico.Win10", '<i class="fab fa-windows"></i>')
		keysArray[i] = keysArray[i].replace("ico.Mac", '<i class="fab fa-apple"></i>')
		keysArray[i] = keysArray[i].replace("ico.Android", '<i class="fab fa-android"></i>')
		keysArray[i] = keysArray[i].replace("ico.Robot", '<i class="fas fa-robot"></i>')
		keysArray[i] = keysArray[i].replace("ico.Linux", '<i class="fab fa-linux"></i>')
		keysArray[i] = keysArray[i].replace("ico.Ubuntu", '<i class="fab fa-ubuntu"></i>')
		keysArray[i] = keysArray[i].replace("ico.Suse", '<i class="fab fa-suse"></i>')
		keysArray[i] = keysArray[i].replace("ico.Redhat", '<i class="fab fa-redhat"></i>')
		keysArray[i] = keysArray[i].replace("ico.Fedora", '<i class="fab fa-fedora"></i>')
		keysArray[i] = keysArray[i].replace("ico.Centos", '<i class="fab fa-centos"></i>')
		keysArray[i] = keysArray[i].replace("ico.Unity", '<i class="fab fa-unity"></i>')
		keysArray[i] = keysArray[i].replace("ico.Detective", '<i class="fas fa-user-secret"></i>')
		keysArray[i] = keysArray[i].replace("ico.Snapchat", '<i class="fab fa-snapchat"></i>')
		keysArray[i] = keysArray[i].replace("ico.Whatsapp", '<i class="fab fa-whatsapp"></i>')
		keysArray[i] = keysArray[i].replace("ico.Instagram", '<i class="fab fa-instagram"></i>')
		keysArray[i] = keysArray[i].replace("ico.Google", '<i class="fab fa-google"></i>')
		keysArray[i] = keysArray[i].replace("ico.Microsoft", '<i class="fab fa-microsoft"></i>')
		keysArray[i] = keysArray[i].replace("ico.Twitter", '<i class="fab fa-twitter"></i>')
		keysArray[i] = keysArray[i].replace("ico.Facebook", '<i class="fab fa-facebook"></i>')
		keysArray[i] = keysArray[i].replace("ico.Server", '<i class="fas fa-server"></i>')
		keysArray[i] = keysArray[i].replace("ico.IE", '<i class="fab fa-internet-explorer"></i>')
		keysArray[i] = keysArray[i].replace("ico.HDD", '<i class="fas fa-hdd"></i>')
		keysArray[i] = keysArray[i].replace("ico.Search", '<i class="fas fa-search"></i>')
		keysArray[i] = keysArray[i].replace("ico.Question", '<i class="far fa-question-circle"></i>')
		keysArray[i] = keysArray[i].replace("ico.Music", '<i class="fas fa-music"></i>')
		keysArray[i] = keysArray[i].replace("ico.AudioMute", '<i class="fas fa-volume-mute"></i>')
		keysArray[i] = keysArray[i].replace("ico.AudioDown", '<i class="fas fa-volume-down"></i>')
		keysArray[i] = keysArray[i].replace("ico.AudioUp", '<i class="fas fa-volume-up"></i>')
		keysArray[i] = keysArray[i].replace("ico.AudioOff", '<i class="fas fa-volume-off"></i>')
		keysArray[i] = keysArray[i].replace("ico.Forward", '<i class="fas fa-forward"></i>')
		keysArray[i] = keysArray[i].replace("ico.Backward", '<i class="fas fa-backward"></i>')
		keysArray[i] = keysArray[i].replace("ico.Home", '<i class="fas fa-home"></i>')
		keysArray[i] = keysArray[i].replace("ico.Chimp", '<i class="fab fa-mailchimp"></i>')
		keysArray[i] = keysArray[i].replace("ico.Mail", '<i class="far fa-envelope"></i>')
		keysArray[i] = keysArray[i].replace("ico.Laptop", '<i class="fas fa-laptop"></i>')
		keysArray[i] = keysArray[i].replace("ico.Star", '<i class="fas fa-star"></i>')
		keysArray[i] = keysArray[i].replace("ico.Terminal", '<i class="fas fa-terminal"></i>')
		keysArray[i] = keysArray[i].replace("ico.Link", '<i class="fas fa-external-link-alt"></i>')
		keysArray[i] = keysArray[i].replace("ico.Command", '⌘')
		keysArray[i] = keysArray[i].replace("ico.Enter", '⏎')
	}

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

	$('#output-location').html(htmlCode); // Finally Change the Output div's html with new one
	return 0;
}

$("#save-svg").on("click", saveAsSvg); // Run saveAsSvg if SVG Button is Clicked
$("#save-png").on("click", saveAsPng); // Run saveAsPng if PNG Button is Clicked
$('#text-input').keyup(renderKeys); // Render the user's Input when he releases any key
$('input[name=style]').on("click", function (e) { // Run a Function when ever any radio box for style is clicked
	stylePrefix = $('input[name=style]:checked').val(); // Get the clicked/checked radio box's value and assign it to the stylePrefix so that the key styles can be applied while rendering
	renderKeys(); // And Then Render Once Again to Update New Styles
})

window.onload = e => { renderKeys(); }