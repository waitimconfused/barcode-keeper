/** @type {HTMLTextAreaElement} */
const BARCODE_DATA = document.getElementById("barcode-data");
const BARCODE_FORMAT = document.getElementById("barcode-format");
const BARCODES = document.getElementById("barcodes");

/**
 * @typedef {object} Barcode
 * @prop {HTMLImageElement} image
 * @prop {string} code
 */


/**
 * @type {Array<Barcode>}
 */
var barcode_lookup = new Array();


/**
 * @param {string} code 
 * @returns {?Barcode}
 */
function createBarcode(code) {

	if (!code) return;
	
	let image = document.createElement("canvas");
	image.classList.add("barcode");
	BARCODES.appendChild(image);

	try {
		let { _options: option }  = JsBarcode(image, code, { format: "EAN13", background: "transparent" });
		image.setAttribute("code", code);
		image.setAttribute("format", option.format);
		focus(image);
		return { code, image};
	} catch (e) {
		image.remove();
		console.error(e);
	}
}

function barcodeDataListener() {
	for (let i = 0; i < barcode_lookup.length; i++) {
		barcode_lookup[i].image.remove();
		delete barcode_lookup[i];
	}
	
	barcode_lookup = new Array();
	
	let lines = BARCODE_DATA.value.split("\n");
	
	for (let i = 0; i < lines.length; i ++) {
		let line = lines[i];
	
		let data = createBarcode(line);
		if (data) {
			barcode_lookup[i] = data;
			console.log("SAVED", data.code);
		}
	
	}
}

function updateSelectedBarcode() {
	let cursorPosition = BARCODE_DATA.selectionStart;
	let textBeforeCursor = BARCODE_DATA.value.substring(0, cursorPosition);

	let position = textBeforeCursor.split('\n').length - 1;

	console.log(barcode_lookup, barcode_lookup[position]);

	if (!barcode_lookup[position]) return;

	let focused = document.querySelectorAll(".barcode.focus");

	for (let element of focused) {
		element.classList.remove("focus");
	}

	let element = barcode_lookup[position];
	if (!element) return;

	element.image.classList.add("focus");
	element.image.scrollIntoView({ behavior: "instant", block: "start" });
}

BARCODE_DATA.addEventListener("input", barcodeDataListener);

BARCODE_DATA.addEventListener("keyup", updateSelectedBarcode);
BARCODE_DATA.addEventListener("keydown", () => {
	let focused = document.querySelectorAll(".barcode.focus");

	for (let element of focused) {
		element.classList.remove("focus");
	}
});

let data = localStorage.getItem("barcode-data")
if (data) BARCODE_DATA.value = data;

barcodeDataListener();