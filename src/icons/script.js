import $ from "jquery";
import ClipboardJS from "clipboard";
import { SvelteToast, toast } from '@zerodevx/svelte-toast'
new SvelteToast({ target: document.body })

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
		toast.push('Icon code successfully copied to clipboard!', {theme: {'--toastBackground': '#48BB78', '--toastBarBackground': '#2F855A'}})
	});

	clipboard.on('error', function(e) {
		toast.push('Due to unknown error, unable to copy the icon code', { theme: {'--toastBackground': '#F56565', '--toastBarBackground': '#C53030'}})
	});

	toast.push('Click on the icon, and icon code will be copied');
}