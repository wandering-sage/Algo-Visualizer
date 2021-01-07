var container = document.querySelector(".arrayContainer");
var cntrW = 0.75 * window.innerWidth;
var cntrH = 0.75 * window.innerHeight;
var sortingSpeed = 3;
var sortDelay = 80;
var speedms = [500, 200, 100, 30, 0];
var arraySize = 100;
var maxArraySIze = 200;
var minArraySize = 10;
var array = [];
var sizeInput = document.querySelector(".sizeInput");
var speedInput = document.querySelector(".speedInput");
var genButton = document.querySelector(".genButton");
var sortBtnContr = document.querySelector(".sortBtnContr");
var sortBtn = document.querySelector(".sortBtn");
var infoBtn = document.querySelector(".infoBtn");
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

// To generate arrayBars on Load
generateArray();
genButton.addEventListener("click", generateArray);

// To opean guide Tour popup on Load
guidePopup();
infoBtn.addEventListener("click", guidePopup);

algoBtns.forEach((e) => e.addEventListener("click", toggleOpen));

sortBtn.addEventListener("mousemove", hoverButton);
sortBtn.addEventListener("mouseout", hoverInitialPosition);
sortBtn.addEventListener("click", sortArray);

function generateArray() {
	// removes the old items and generates new one everyTime
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
	// i.e. no algorithm is selected
	if (!activeBtn) {
		sortBtn.innerText = "Select Algo";
		return;
	}

	// so that you cant click anywhere till the algo is running
	sortBtn.style.backgroundColor = red;
	sizeInput.disabled = true;
	genButton.disabled = true;
	sortBtn.disabled = true;
	switch (activeBtn.id) {
		case "bs":
			await bubbleSort();
			break;
		case "hs":
			await heapSort();
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
	sortDelay = speedms[sortingSpeed];
	await sleep(sortDelay);
}
async function dragSwap(i, j) {
	for (let k = j; k > i; k--) {
		var temp = array[k];
		array[k] = array[k - 1];
		array[k - 1] = temp;
		getContainerElement(k).style.height = `${array[k]}px`;
		getContainerElement(k - 1).style.height = `${array[k - 1]}px`;
	}
	sortDelay = speedms[sortingSpeed];
	await sleep(sortDelay);
}

async function colorChange(color, ...elms) {
	elms.forEach((e) => {
		getContainerElement(e).style.backgroundColor = color;
	});
	sortDelay = speedms[sortingSpeed];
	if (color != blue) await sleep(sortDelay);
}
async function colorChangeAll(ms, color) {
	await sleep(ms);
	for (let i = 0; i < arraySize; i++) {
		getContainerElement(i).style.backgroundColor = color;
	}
}

// *************************Algorithms*********************************
// *********************************************************************

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

async function heapSort() {
	let n = arraySize;
	for (let i = n / 2 - 1; i >= 0; i--) await heapify(n, i);

	for (let i = n - 1; i > 0; i--) {
		await colorChange(red, i, 0);
		await swapContainerElement(0, i);
		await colorChange(green, 0, i);
		await colorChange(sortedColor, i);
		await heapify(i, 0);
	}

	await colorChangeAll(100, green);
	await colorChangeAll(500, sortedColor);

	async function heapify(n, i) {
		let largest = i;
		let l = 2 * i + 1;
		let r = 2 * i + 2;
		await colorChange(green, i);

		if (l < n && array[l] > array[largest]) {
			largest = l;
			await colorChange(green, l);
		}

		if (r < n && array[r] > array[largest]) {
			await colorChange(blue, l);
			largest = r;
			await colorChange(green, r);
		}

		if (largest != i) {
			await colorChange(red, i, largest);
			await swapContainerElement(i, largest);
			await colorChange(green, i, largest);
			await colorChange(blue, i, largest);
			await heapify(n, largest);
		}
		await colorChange(blue, i);
	}
}

async function quickSort() {
	let a = array.slice().sort((a, b) => a - b);
	// checks if array is not sorted
	if (JSON.stringify(array) != JSON.stringify(a)) {
		await qs(0, arraySize - 1);
	}
	await colorChangeAll(100, green);
	await colorChangeAll(500, sortedColor);

	async function qs(lo, hi) {
		if (lo < hi) {
			let p = await partition(lo, hi);
			await qs(lo, p);
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
				await colorChange(sortedColor, j);
				return j;
			}
			await colorChange(red, i, j);
			await swapContainerElement(i, j);
			await colorChange(green, i, j);
		}
	}
}

async function mergeSort() {
	await msSplit(0, arraySize - 1);
	await colorChangeAll(100, green);
	await colorChangeAll(500, sortedColor);

	async function msSplit(l, r) {
		if (l < r) {
			let m = Math.floor((l + r) / 2);
			await msSplit(l, m);
			await msSplit(m + 1, r);
			await msMerge(l, m, r);
		}
	}

	async function msMerge(l, m, r) {
		let i = l;
		let j = m + 1;
		if (array[m] <= array[j]) {
			return;
		}
		while (i <= m && j <= r) {
			await colorChange(green, i, j);
			if (array[i] <= array[j]) {
				await colorChange(blue, i);
				if (l == 0 && r == arraySize - 1) {
					colorChange(sortedColor, i);
				}
				i++;
				await colorChange(green, i);
			} else {
				await colorChange(red, i, j);
				await Promise.all([
					dragSwap(i, j),
					colorChange(blue, j),
					colorChange(red, i + 1),
				]);
				await colorChange(green, i, i + 1);

				m++;

				if (l == 0 && r == arraySize - 1) {
					colorChange(sortedColor, i);
					colorChange(blue, j);
				} else colorChange(blue, i, j);
				i++;
				j++;
			}
		}
		colorChange(blue, i);
	}
}

// ********************Button Hover****************************
// ***********************************************************

async function hoverButton(e) {
	let x = e.offsetX;
	let y = e.offsetY;
	let walk = 80;
	let xWalk = Math.round((x / sortBtn.clientWidth) * walk - walk / 2);
	let yWalk = Math.round((y / sortBtn.clientHeight) * walk - walk / 2);
	moveButton(xWalk, yWalk);

	function moveButton(x, y) {
		sortBtn.style.transform = `translate(${x}px,${y}px)`;
		sortBtn.style.boxShadow = `${-x / 2}px ${
			-y / 2
		}px 25px -10px rgba(0,0,0,0.7)`;
	}
}

function hoverInitialPosition(e) {
	sortBtn.style.transform = `translate(0px,0px)`;
	sortBtn.style.boxShadow = "0 0 30px -30px";
}

// *************************** Guide Popup *********************
// *************************************************************

function guidePopup() {
	var guideTites = [
		"Welcome",
		"Algorithms",
		"Visualize",
		"Controls",
		"Thank You",
	];
	var guideExplainations = [
		"Hello, this is a Sorting Algorithm Visualizer",
		"Firstly, select an Algorithm from here to Visualize. They are listed in slowest to fastest order",
		"After selecting Algorithm, hit this Sort button to see that algorithm in action.",
		"Here are the user controls, you can change the array size, sorting speed. (Drag the sorting speed to maximum it will be fun XD)",
		"Okay... Enjoy",
	];

	var guidePosLeft = ["35%", "12.5%", "14%", "33%", "40%"];
	var guidePosTop = ["25%", "21.5%", "58%", "40%", "30%"];
	var curGuideStep = 1;
	var maxGuideStep = 5;
	var image = document.createElement("img", HTMLImageElement);
	image.classList.add("img");

	let blurScr = document.createElement("div");
	blurScr.classList.add("blur-bg");
	document.body.appendChild(blurScr);

	let popup = document.createElement("div");
	popup.classList.add("popup");
	document.body.appendChild(popup);

	let header = document.createElement("div");
	header.classList.add("header");
	popup.appendChild(header);

	let headerCnt = document.createElement("div");
	headerCnt.classList.add("headerCnt");
	header.appendChild(headerCnt);

	let closeBtn = document.createElement("button", HTMLButtonElement);
	closeBtn.innerText = "X";
	closeBtn.className = "closeBtn";
	closeBtn.onclick = closePopup;
	header.appendChild(closeBtn);

	let headerTitle = createEl("h2", guideTites[curGuideStep - 1]);
	headerCnt.appendChild(headerTitle);
	let headerP = createEl("p", guideExplainations[curGuideStep - 1]);
	headerCnt.appendChild(headerP);
	let triangle = createEl("span", "");
	triangle.classList.add("triangle");

	let footer = document.createElement("div");
	footer.classList.add("footer");
	popup.appendChild(footer);

	let stepNo = document.createElement("div");
	stepNo.classList.add("stepNo");
	footer.appendChild(stepNo);
	stepNo.innerText = `# ${curGuideStep}`;

	let stepIndicator = document.createElement("ul", HTMLUListElement);
	stepIndicator.classList.add("stepIndicator");
	footer.appendChild(stepIndicator);

	for (let i = 0; i < maxGuideStep; i++) {
		let li = document.createElement("li", HTMLLIElement);
		li.classList.add("step");
		stepIndicator.appendChild(li);
	}

	let steps = document.querySelectorAll(".step");
	steps[curGuideStep - 1].classList.add("stepActive");

	let nextBtn = document.createElement("button", HTMLButtonElement);
	nextBtn.innerText = "Next";
	nextBtn.className = "nextBtn";
	nextBtn.onclick = nextStep;
	footer.appendChild(nextBtn);

	function closePopup() {
		blurScr.remove();
		popup.remove();
		image.remove();
	}

	function nextStep() {
		image.remove();
		if (curGuideStep == maxGuideStep) {
			closePopup();
		}
		curGuideStep++;
		steps[curGuideStep - 1].classList.add("stepActive");
		stepNo.innerText = `# ${curGuideStep}`;
		headerTitle.innerText = guideTites[curGuideStep - 1];
		headerP.innerText = guideExplainations[curGuideStep - 1];
		headerCnt.appendChild(triangle);
		popup.style.left = guidePosLeft[curGuideStep - 1];
		popup.style.top = guidePosTop[curGuideStep - 1];

		if (curGuideStep == 2 || curGuideStep == 4) {
			image.src = `./Images/${guideTites[curGuideStep - 1]}.png`;
			document.body.appendChild(image);
		}

		if (curGuideStep == maxGuideStep) {
			nextBtn.innerText = "Close";
			triangle.remove();
		}
	}

	function createEl(tagName, text) {
		let el = document.createElement(tagName);
		el.innerText = text;
		return el;
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
	sortBtn.innerText = "Sort!";
}
