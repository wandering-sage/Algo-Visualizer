var container = document.querySelector(".arrayContainer");
var cntrW = 0.7 * window.innerWidth;
var cntrH = 0.75 * window.innerHeight;
var sortingSpeed = 50;
var sortDelay = 80;
var arraySize = 50;
var array = [];
var sizeInput = document.querySelector(".sizeInput");
var speedInput = document.querySelector(".speedInput");
var genButton = document.querySelector(".genButton");
var sortBtn = document.querySelector(".sortBtn");
var algoBtns = Array.from(document.querySelectorAll(".algoBtn"));
var green = "rgb(66,244,134)";
var red = "rgb(244, 134, 66)";
var blue = "rgb(66, 134, 244)";
var black = "rgb(64,64,64)";

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
		array.push(
			Math.floor(i * Math.random() + (cntrH / 1.27) * Math.random() + 30)
		);
	}
	array = shuffle(array);
	drawArray(array);
}

function drawArray(arr) {
	arr.forEach((el, i) => {
		var w = Math.floor(cntrW / (1.5 * arraySize));
		var m = w / 1.5;
		if (arraySize > 60) {
		}
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
	sortBtn.style.backgroundColor = red;
	var activeBtn = algoBtns.find((e) => e.className.includes("btnActive"));
	if (!activeBtn) {
		sortBtn.style.backgroundColor = green;
		return;
	}

	switch (activeBtn.id) {
		case "bs":
			await bubbleSort(array, swapContainerElement);
			break;
		case "qs":
			console.log("Working on Quick Sort");
			break;
		case "ms":
			console.log("Working on Merge Sort");
			break;
	}
	sortBtn.style.backgroundColor = green;
}

function getContainerElement(index) {
	return document.querySelector(`[data-index="${index}"]`);
}

async function swapContainerElement(ms, i, j) {
	let temp = array[i - 1];
	array[i - 1] = array[i];
	array[i] = temp;
	getContainerElement(i).style.height = `${array[i]}px`;
	getContainerElement(j).style.height = `${array[j]}px`;
	await sleep(ms);
}

async function colorChange(ms, color, ...elms) {
	elms.forEach((e) => {
		getContainerElement(e).style.backgroundColor = color;
	});
	await sleep(ms);
}

async function bubbleSort() {
	let n = arraySize;
	while (n >= 1) {
		let newn = 0;
		for (var i = 1; i < n; i++) {
			sortDelay = mapValue(sortingSpeed, 0, 100, 200, 0);
			let j = i - 1;
			await colorChange(sortDelay, green, i, j);
			if (array[j] > array[i]) {
				await colorChange(sortDelay, red, i, j);
				await swapContainerElement(sortDelay, i, j);
				await colorChange(sortDelay, green, i, j);
				newn = i;
			}
			await colorChange(0, blue, j);
		}
		await colorChange(0, black, i - 1);
		n = newn;
	}
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
