const introSteps = [
	{
		element: document.getElementsByClassName("controls")[0],
		title: "Tutorial", intro: "These are your controls, using them you can modify your shortcuts"
	},
	{
		element: document.getElementById("text-input"),
		title: "Input Box", intro: "Using this Textbox you can make keyboard shortcuts.<br><br> Just enter some text seprated by '+' and you can add custom icons too! <a style='display: inline-block' href='https://key2img.ml/icons' target='_blank'>See How</a>"
	},
	{
		element: document.getElementById("keyStyles"),
		title: "Key Styles", intro: "Using these Checkboxes you can use different available Themes for keys"
	},
	{
		element: document.getElementsByClassName("btnHolder")[0],
		title: "Saving Image", intro: "These are save buttons, which will convert your shortcuts to image format like JPEG or PNG"
	},
	{
		element: document.getElementById("web-usage"),
		intro: "If you want to see this tutorial once again click this button"
	},
];

export default introSteps;