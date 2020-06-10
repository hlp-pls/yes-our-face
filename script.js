var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

let is_model_loaded = false;
let webcam;

var landmark_points;
var offset;

let cam_width;
let cam_height;
let scr_scale;

let instruction_DOM = document.getElementById("instructions");
let count_DOM = document.getElementById("countdown");
let record_DOM = document.getElementById("record");
let sound_DOM = document.getElementById("sound");

let predictRate = (isMobile.any())? 3 : 2;
let predict_count = 0;

let is_playing = false;

let face_landmarks = [];
let max_face_num = (isMobile.any())? 1 : 5;

function setup(){
	createCanvas(windowWidth,windowHeight);
	noFill();
	strokeWeight(1);
	if(isMobile.any()) strokeWeight(0.8);
	strokeJoin(ROUND);
	strokeCap(ROUND);
	Promise.all([
	faceapi.nets.tinyFaceDetector.loadFromUri('models/'),
	faceapi.nets.faceLandmark68TinyNet.loadFromUri('models/'),
	]).then(modelLoaded);
	webcam = createCapture(VIDEO);
	webcam.hide();

	for(let i=0; i<max_face_num; i++){
		face_landmarks.push(new Faces());
	}
}

sound_DOM.addEventListener("click",initSound,false);
sound_DOM.addEventListener("touchstart",initSound,false);

function initSound(){
	if(!is_playing){
		userStartAudio();
		is_playing = true;
		sound_DOM.innerText = "Sound OFF."
	}else{
		is_playing = false;
		sound_DOM.innerText = "Sound ON."
	}
}

function windowResized(){
	resizeCanvas(windowWidth,windowHeight);
}

function modelLoaded(){
	console.log("model loaded");
	is_model_loaded = true;
	instruction_DOM.innerText = "Model loaded!";
}

function draw(){
	/background(255,1);
		
	translate(width/2,height/2);
	scale(-1,1);
	
	//카메라와 윈도우 화면비율에 따라 크기 조정하기 위한 코드. 여기서부터 <--
	if(width>height){
		cam_width = height * webcam.width/webcam.height;
		cam_height = height;

	}else{
		cam_width = width;
		cam_height = width * webcam.height/webcam.width;

	}

	if(width>cam_width){
		scr_scale = width/cam_width;
		cam_width *= scr_scale;
		cam_height *= scr_scale;
	}else if(height>cam_height){
		scr_scale = height/cam_height;
		cam_width *= scr_scale;
		cam_height *= scr_scale;
	}
	// --> 여기까지.

	if(is_model_loaded){

		//카메라 피드와 기하형태 위치 확인
		/*image(	webcam,
			-cam_width/2,
			-cam_height/2,
			cam_width,cam_height);*/

		predict_count++;

		if(predict_count>predictRate){
			predict();
			predict_count = 0;
		}
		

		if(face_landmarks){
			for(let i=0; i<face_landmarks.length; i++){
				face_landmarks[i].display();
				face_landmarks[i].sound(is_playing);
			}
		}

	}
	//console.log(landmark_points);
}



function drawFace(){
	//face outline
	stroke(0);
	noFill();
	beginShape();
	for(let i=0; i<17; i++){
		let x = -cam_width/2+landmark_points[i]._x;
		let y = -cam_height/2+landmark_points[i]._y;
		vertex(x,y);
	}
	endShape();

	//right eyebrow
	beginShape();
	for(let i=17; i<22; i++){
		let x = -cam_width/2+landmark_points[i]._x;
		let y = -cam_height/2+landmark_points[i]._y;
		vertex(x,y);
	}
	endShape();

	//left eyebrow
	beginShape();
	for(let i=22; i<27; i++){
		let x = -cam_width/2+landmark_points[i]._x;
		let y = -cam_height/2+landmark_points[i]._y;
		vertex(x,y);
	}
	endShape();

	//nose
	beginShape();
	for(let i=27; i<36; i++){
		let x = -cam_width/2+landmark_points[i]._x;
		let y = -cam_height/2+landmark_points[i]._y;
		vertex(x,y);
	}
	endShape();

	//eye1
	beginShape();
	for(let i=36; i<42; i++){
		let x = -cam_width/2+landmark_points[i]._x;
		let y = -cam_height/2+landmark_points[i]._y;
		vertex(x,y);
	}
	endShape(CLOSE);

	//eye2
	beginShape();
	for(let i=42; i<48; i++){
		let x = -cam_width/2+landmark_points[i]._x;
		let y = -cam_height/2+landmark_points[i]._y;
		vertex(x,y);
	}
	endShape(CLOSE);

	//fill(255,0,0);
	//mouth upperlip
	beginShape();
	for(let i=48; i<55; i++){
		let x = -cam_width/2+landmark_points[i]._x;
		let y = -cam_height/2+landmark_points[i]._y;
		vertex(x,y);
	}

	for(let i=64; i>=60; i--){
		let x = -cam_width/2+landmark_points[i]._x;
		let y = -cam_height/2+landmark_points[i]._y;
		vertex(x,y);
	}
	endShape(CLOSE);

	//mouth lowerlip
	beginShape();
	{
		let x = -cam_width/2+landmark_points[64]._x;
		let y = -cam_height/2+landmark_points[64]._y;
		vertex(x,y);
	}

	for(let i=54; i<60; i++){
		let x = -cam_width/2+landmark_points[i]._x;
		let y = -cam_height/2+landmark_points[i]._y;
		vertex(x,y);
	}

	{
		let x = -cam_width/2+landmark_points[48]._x;
		let y = -cam_height/2+landmark_points[48]._y;
		vertex(x,y);
	}

	{
		let x = -cam_width/2+landmark_points[60]._x;
		let y = -cam_height/2+landmark_points[60]._y;
		vertex(x,y);
	}

	for(let i=landmark_points.length-1; i>=64; i--){
		let x = -cam_width/2+landmark_points[i]._x;
		let y = -cam_height/2+landmark_points[i]._y;
		vertex(x,y);
	}
	endShape(CLOSE);
}

async function predict(){
	let input_size = 256;
	if(isMobile.any()) input_size = 96;
	const options = new faceapi.TinyFaceDetectorOptions({ inputSize: input_size })
	const video = document.getElementsByTagName('video')[0];
	const displaySize = { width: cam_width, height: cam_height };
	const detections = await faceapi.detectAllFaces(
			video,
			new faceapi.TinyFaceDetectorOptions(options)
		).withFaceLandmarks(true)
		//console.log(detections)
		//console.log(detections[0].landmarks)
		const resizedDetections = faceapi.resizeResults(detections,displaySize);
	if(resizedDetections[0]){
		for(let i=0; i<max_face_num; i++){
			if(resizedDetections[i]){ 
				face_landmarks[i].update(resizedDetections[i].landmarks._positions);
				face_landmarks[i].isFace(true);
			}else{
				face_landmarks[i].isFace(false);
			}
		}
	}
} 
