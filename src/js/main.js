var container = document.querySelector(".arrayContainer");
var cntrW = 0.7 * window.innerWidth;
var cntrH = 0.75 * window.innerHeight;
var sortingSpeed = 80;
var sortDelay = 80;
var arraySize = 100;
var maxArraySIze = 200;
var minArraySize = 10;
var array = [];
var sizeInput = document.querySelector(".sizeInput");
var speedInput = document.querySelector(".speedInput");
var genButton = document.querySelector(".genButton");
var sortBtn = document.querySelector(".sortBtn");
var algoBtns = Array.from(document.querySelectorAll(".algoBtn"));
var green = "rgb(66,244,134)";
var red = "rgb(244, 134, 66)";
var blue = "rgb(66, 134, 244)";
var sortedColor = "rgb(181,119,231)";
var yellow = "rgb(235,233,93)";

speedInput.oninput = () => {
	sortingSpeed = speedInput.value;
};

sizeInput.oninput = () => {
	arraySize = sizeInput.value;
	generateArray();
};

generateArray();

genButton.addEventListener("click", generateArray);

algoBtns.forEach((e) => e.addEventListener("click", toggleOpen));

sortBtn.addEventListener("click", sortArray);

function generateArray() {
	array = [];
	container.remove();
	container = document.createElement("div");
	container.className = "arrayContainer";
	document.body.appendChild(container);
	for (let i = 1; i <= arraySize; i++) {
		array.push(Math.floor(50 + (i * cntrH * 0.9) / arraySize));
	}
	array = shuffle(array);
	drawArray(array);
}

function drawArray(arr) {
	arr.forEach((el, i) => {
		var m = mapValue(arraySize, minArraySize, maxArraySIze, 10, 2.5);
		var w = cntrW / arraySize - m;
		var x = createArrayElement(el, w, m, i);
		container.appendChild(x);
	});
}

function createArrayElement(h, w, m, i) {
	var div = document.createElement("div");
	div.className = "arrayElement";
	div.setAttribute("data-index", i);

	div.style.height = `${h}px`;
	div.style.width = `${w}px`;
	div.style.marginLeft = `${m}px`;
	div.style.backgroundColor = "rgb(66, 134, 244)";
	return div;
}

async function sortArray() {
	var activeBtn = algoBtns.find((e) => e.className.includes("btnActive"));
	if (!activeBtn) return;

	sortBtn.style.backgroundColor = red;
	sizeInput.disabled = true;
	genButton.disabled = true;
	sortBtn.disabled = true;
	switch (activeBtn.id) {
		case "bs":
			await bubbleSort();
			break;
		case "qs":
			await quickSort();
			break;
		case "ms":
			await mergeSort();
			break;
	}
	sizeInput.disabled = false;
	genButton.disabled = false;
	sortBtn.disabled = false;
	sortBtn.style.backgroundColor = green;
}

function getContainerElement(index) {
	return document.querySelector(`[data-index="${index}"]`);
}

async function swapContainerElement(i, j) {
	var temp = array[i];
	array[i] = array[j];
	array[j] = temp;
	getContainerElement(i).style.height = `${array[i]}px`;
	getContainerElement(j).style.height = `${array[j]}px`;
	sortDelay = mapValue(sortingSpeed, 0, 100, 200, 0);
	await sleep(sortDelay);
}

async function colorChange(color, ...elms) {
	elms.forEach((e) => {
		getContainerElement(e).style.backgroundColor = color;
	});
	sortDelay = mapValue(sortingSpeed, 0, 100, 200, 0);
	if (color != blue) await sleep(sortDelay);
}
async function colorChangeAll(ms, color) {
	await sleep(ms);
	for (let i = 0; i < arraySize; i++) {
		getContainerElement(i).style.backgroundColor = color;
	}
}

async function bubbleSort() {
	let n = arraySize;
	while (n >= 1) {
		let newn = 0;
		for (var i = 1; i < n; i++) {
			let j = i - 1;
			await colorChange(green, i, j);
			if (array[j] > array[i]) {
				await colorChange(red, i, j);
				await swapContainerElement(i, j);
				await colorChange(green, i, j);
				newn = i;
			}
			colorChange(blue, j);
		}
		await colorChange(sortedColor, i - 1);
		n = newn;
	}
	await colorChangeAll(100, green);
	await colorChangeAll(500, sortedColor);
}

async function quickSort() {
	await qs(0, arraySize - 1);
	await colorChangeAll(100, green);
	await colorChangeAll(500, sortedColor);

	async function qs(lo, hi) {
		if (lo < hi) {
			let p = await partition(lo, hi);
			await qs(lo, p);
			// for()
			await qs(p + 1, hi);
		}
	}
	async function partition(lo, hi) {
		let pivot = array[lo];
		let i = lo;
		let j = hi;
		await colorChange(green, i);
		await colorChange(green, j);
		while (true) {
			while (array[i] < pivot) {
				await colorChange(blue, i);
				i++;
				await colorChange(green, i);
			}
			while (array[j] > pivot) {
				await colorChange(blue, j);
				j--;
				await colorChange(green, j);
			}
			if (i >= j) {
				await colorChange(sortedColor, lo);
				return j;
			}
			await colorChange(red, i, j);
			await swapContainerElement(i, j);
			await colorChange(green, i, j);
		}
	}
}

async function mergeSort() {
	//
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function shuffle(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

function mapValue(val, minFrom, maxFrom, minTo, maxTo) {
	return ((val - minFrom) / (maxFrom - minFrom)) * (maxTo - minTo) + minTo;
}

function toggleOpen() {
	algoBtns.forEach((e) => {
		if (e.classList.contains("btnActive") && e != this)
			e.classList.remove("btnActive");
	});
	this.classList.toggle("btnActive");
}
