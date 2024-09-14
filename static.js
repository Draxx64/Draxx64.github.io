//let colorlist = [argebe(255, 0, 255), argebe(0, 255, 255), argebe(33, 33, 33), argebe(33, 33, 33)];
let colorlist = ["#ff00ff", "#00ffff", "#212121", "#212121"];

// scale of the pixels
var scale = 16;
// grid width and height
var width = 32;
var height = 32;

const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

const canvas2 = document.getElementById("grid2");
const ctx2 = canvas2.getContext("2d");

function fullUpdate(){
	setColorGrid();
	updatePixelGrid();
}

let colorgrid = [];
function setColorGrid(){
	colorgrid = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
	for(let y = 0; y < 4; y++){
		colorgrid[y][0] = Number("0x" + colorlist[y].substring(1, 3));
		colorgrid[y][1] = Number("0x" + colorlist[y].substring(3, 5));
		colorgrid[y][2] = Number("0x" + colorlist[y].substring(5, 7));
	}
}
setColorGrid();

for(let i = 0; i < 4; i++){
	changeColor(colorlist[i], i);
}

function argebe(x, y, z){
	return "rgb(" + x%256 + "," + y%256 + "," + z%256 + ")";
}

function fargebe(x, y, z){
	return "rgb(" + x + "," + y + "," + z + ")";
}

// makes the function wait before recognizing a change in color
let WAITid = null;
let timewait = 500;

function handleChangeColor(event, id){
	clearTimeout(WAITid);
	WAITid = setTimeout(function(){changeColor(event.target.value, id)}, timewait);
}

function changeColor(value, id){
	let _value = value;
	let good = true;
	if(_value === "#ffffff"){
		_value = argebe(33, 33, 33);
		good = false;
	}
	ctx.fillStyle = _value;
	ctx.fillRect(512, 128*id, 128, 128);
	colorlist[id] = _value;
	fullUpdate();
}

function checkcolor(colorid){
	console.log("checking color: " + colorid);
	console.log("red of: " + getRed(colorid));
	console.log("back in checker...");
	if(
		getRed(colorid) == 33
		&&
		getGreen(colorid) == 33
		&&
		getBlue(colorid) == 33
	){
		console.log("returned false");
		return false;
	}
		console.log("returned true");
	return true;
}

function getRed(id){
	//console.log("getting red of: " + id);
	return colorgrid[id][0];
}
function getGreen(id){
	return colorgrid[id][1];
}
function getBlue(id){
	return colorgrid[id][2];
}

var linearlerp = true;
var relativelerp = true;

function lerpcolor(id1, id2){
	let retcolor = [0, 0, 0];
	let r1 = getRed(id1);
	let g1 = getGreen(id1);
	let b1 = getBlue(id1);
	let r2 = getRed(id2);
	let g2 = getGreen(id2);
	let b2 = getBlue(id2);
	let minr = Math.min(r1, r2);
	let ming = Math.min(g1, g2);
	let minb = Math.min(b1, b2);
	let maxr = Math.max(r1, r2);
	let maxg = Math.max(g1, g2);
	let maxb = Math.max(b1, b2);
	if(linearlerp && relativelerp){
		let m = Math.random();
		retcolor[0] = r1 + m*(r2 - r1);
		retcolor[1] = g1 + m*(g2 - g1);
		retcolor[2] = b1 + m*(b2 - b1);
	}
	if(linearlerp && !relativelerp){
		let m = Math.random();
		retcolor[0] = minr + m*(maxr - minr);
		retcolor[1] = ming + m*(maxg - ming);
		retcolor[2] = minb + m*(maxb - minb);
	}
	if(!linearlerp && relativelerp){
		retcolor[0] = r1 + Math.random()*(r2 - r1);
		retcolor[1] = g1 + Math.random()*(g2 - g1);
		retcolor[2] = b1 + Math.random()*(b2 - b1);
	}
	if(!linearlerp && !relativelerp){
		retcolor[0] = minr + Math.random()*(maxr - minr);
		retcolor[1] = ming + Math.random()*(maxg - ming);
		retcolor[2] = minb + Math.random()*(maxb - minb);
	}
	return retcolor;
}

function lerpcolors(){
	
	let colorids = [];
	let colormax = 0;
	for(let i = 0; i < 4; i++){
		if(checkcolor(i)){
			console.log("and if true i get pushed");
			colorids.push(i);
			colormax++;
		}
	}
	if(colormax < 2){
		throw new Error("color max FUCKED");
	}
	let colorid1 = getRandomElement(colorids);
	let colorid2 = getRandomElement(colorids);
	while(colorid1 == colorid2){
		colorid2 = getRandomElement(colorids);
	}
	
	return lerpcolor(colorid1, colorid2);
}

function getRandomInt(max){
	return Math.floor(Math.random()*(max+1));
}

function getRandomElement(arr){
	return Math.floor(Math.random()*(arr.length+1));
}

function arrayToColor(arr){
	return argebe(arr[0], arr[1], arr[2]);
}

function updatePixelGrid(){
	for(x = 0; x < width; x++){
		for(y = 0; y < height; y++){
			
			ctx.fillStyle = arrayToColor(lerpcolor(0, 1));
			ctx2.fillStyle = ctx.fillStyle;
			
			ctx.fillRect(x*scale, y*scale, scale, scale);
			ctx2.fillRect(x, y, 1, 1);
		}
	}
}

function handleChangeCheckLinear(event){
	linearlerp = event.target.checked;
	fullUpdate();
}

function handleChangeCheckRelative(event){
	relativelerp = event.target.checked;
	fullUpdate();
}

var animateIntervalId = null;
var animateWaitTime = document.getElementById("waittime");
var doAnimate = false;

function handleChangeCheckAnimate(event){
	doAnimate = event.target.checked;
	if(doAnimate){
		clearInterval(animateIntervalId);
		animateIntervalId = setInterval(updatePixelGrid, animateWaitTime.value);
	}
	else{
		clearInterval(animateIntervalId);
	}
}

function handleChangeWaitTime(event){
	clearInterval(animateIntervalId);
	if(doAnimate){
		animateIntervalId = setInterval(updatePixelGrid, event.target.value);
	}
}