import $ from "jquery";
import ClipboardJS from "clipboard";


function filterIcons() {
	var input, filter, li, i, txtValue;
	input = $("#searchBox")[0];
	filter = input.value.toUpperCase();
	li = $("ul")[0].getElementsByTagName("li");
	for (i = 0; i < li.length; i++) {
		txtValue = li[i].textContent || li[i].innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) li[i].style.display = "";
		else li[i].style.display = "none";
	}
}

window.onload = e => {
	var clipboard = new ClipboardJS('li');
	clipboard.on('success', function(e) {
		new Toast({ message: 'Icon code successfully copied to clipboard!', type: 'success' });
		// console.info('Text:', e.text);
	});

	clipboard.on('error', function(e) {
		new Toast({ message: 'Due to unknown error, unable to copy the icon code', type: 'danger' });
	});

	new Toast({ message: 'Click on the icon, and icon code will be copied', type: 'info' });
}