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

let select_container;
let select_p5dom;
let instruction_p5dom, capture_p5dom, record_p5dom, sound_p5dom;
let amp_p5dom, pan_p5dom, freq_p5dom;

let predictRate = (isMobile.any())? 4 : 2;
let predict_count = 0;

let is_playing = false;

let face_landmarks = [];
let face_count = 0;
let max_face_num = (isMobile.any())? 1 : 5;

let cam_count = 0;

let recorder, soundFile;
let is_recording = false;
let record_count = 0;

let stroke_selection = 1.5;

let _year, _month, _day, _hour, _minute, _second;

function setup(){
	createCanvas(windowWidth,windowHeight);
	noFill();
	strokeWeight(1.5);
	strokeJoin(ROUND);
	strokeCap(SQUARE);
	Promise.all([
	faceapi.nets.tinyFaceDetector.loadFromUri('models/'),
	faceapi.nets.faceLandmark68TinyNet.loadFromUri('models/'),
	]).then(modelLoaded);
	webcam = createCapture(VIDEO);
	webcam.hide();

	for(let i=0; i<max_face_num; i++){
		face_landmarks.push(new Faces());
	}

	amp_p5dom = select('#amp');
	freq_p5dom = select('#freq');
	pan_p5dom = select('#pan');

	sound_p5dom = select('#sound');
	instruction_p5dom = select('#instructions');
	capture_p5dom = select('#capture');
	record_p5dom = select('#record');

	select_p5dom = createSelect();
	select_p5dom.option('1');
	select_p5dom.option('2');
	select_p5dom.option('3');
	select_p5dom.option('4');
	select_p5dom.changed(selectionChanged);

	select_container = select('#select');
	select_container.child(select_p5dom);

	if(isMobile.any()){
		sound_p5dom.touchEnded(initSound);
		capture_p5dom.touchEnded(captureScreen);
		record_p5dom.touchEnded(recordSound);
	}else{
		sound_p5dom.mouseClicked(initSound);
		capture_p5dom.mouseClicked(captureScreen);
		record_p5dom.mouseClicked(recordSound);
	}

	recorder = new p5.SoundRecorder();
	recorder.setInput();

	soundFile = new p5.SoundFile();
}

function selectionChanged(){
	console.log("selection changed!");
	if(select_p5dom.value()=='1'){
		stroke_selection = 1.5;
	}else if(select_p5dom.value()=='2'){
		stroke_selection = 3;
	}else if(select_p5dom.value()=='3'){
		stroke_selection = 6;
	}else if(select_p5dom.value()=='4'){
		stroke_selection = 10;
	}
}

function captureScreen(){
	console.log("capture!");
	_year = year(); 
	_month = month(); 
	_day = day(); 
	_hour = hour(); 
	_minute = minute();
	_second = second();
	/*
	saveFrames('YesOurFace'+ '_' +
		_year + '_' +
		_month + '_' +
		_day + '_' +
		_hour + '_' +
		_minute
		, 'png', 3.0 / getFrameRate() , getFrameRate());
	*/
	save('YesOurFace'+ '_' +
		_year + '_' +
		_month + '_' +
		_day + '_' +
		_hour + '_' +
		_minute +
		'.png');
}

function recordSound(){
	if(is_playing){
		record_count++;
		if(!is_recording){
			record_p5dom.html("<span class='highlight'>" + "Press again to save" + "</span>");
			is_recording = true;
		}else{
			record_p5dom.html("<span class='highlight'>" + "Record sound" + "</span>");
			is_recording = false;
		}
	}
}

function initSound(){
	if(!is_playing){
		userStartAudio();
		is_playing = true;
		sound_p5dom.html("<span class='highlight'>" + "Sound OFF" + "</span>");
	}else{
		is_playing = false;
		sound_p5dom.html("<span class='highlight'>" + "Sound ON" + "</span>");
	}
}

function windowResized(){
	resizeCanvas(windowWidth,windowHeight);
}

function modelLoaded(){
	console.log("model loaded");
	is_model_loaded = true;
	instruction_p5dom.html( "Model loaded!" );
	instruction_p5dom.remove();
}

function draw(){
	background(255);

	translate(width/2,height/2);
	scale(-1,1);

	let amp = 0;
	let freq = 0;
	let pan = 0;
	
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
		
		image(webcam,
		-cam_width/2,
		-cam_height/2,
		cam_width,cam_height);
		
		background(255);
		
		predict_count++;
		//console.log(predict_count, predictRate);
		
		if(predict_count>predictRate){
			predict();
			predict_count = 0;
		}
		

		if(face_landmarks){
			for(let i=0; i<face_landmarks.length; i++){
				face_landmarks[i].display();
				face_landmarks[i].sound(is_playing);
				amp += face_landmarks[i].get_amp();
				freq += face_landmarks[i].get_freq();
				pan += face_landmarks[i].get_pan();
			}
			
			if(face_count!=0){
				amp /= face_count;
				freq /= face_count;
				pan /= face_count;
			}

			pan = pan * 0.5 + 0.5;
			pan = floor(pan * 100);
			amp = floor(amp * 100);
			freq = floor(freq);
		}

	}
	//console.log(landmark_points);
	if(is_playing){
		if(is_recording){
			recorder.record(soundFile);
		}else if(record_count>0){
			record_count = -1;
			recorder.stop();
		}else if(record_count==-1){
			record_count = 0;

			_year = year(); 
			_month = month(); 
			_day = day(); 
			_hour = hour(); 
			_minute = minute();
			_second = second();

			save(soundFile, 'YesOurFace'+ '_' +
				_year + '_' +
				_month + '_' +
				_hour + '_' +
				_day + '_' +
				_minute +
				'.wav');
		}

		amp_p5dom.html('Amplitude : ' + amp);
		pan_p5dom.html('Stereo Pan : ' + 'L' + (100-pan) + ' R' + (pan));
		freq_p5dom.html('Frequency : ' + freq);
	}
}

async function predict(){
	let input_size = 160;
	if(isMobile.any()) input_size = 96;
	const options = new faceapi.TinyFaceDetectorOptions({ inputSize: input_size })
	const video = document.getElementsByTagName('video')[0];
	const displaySize = { width: cam_width, height: cam_height };
	const detections = await faceapi.detectAllFaces(
			video,
			new faceapi.TinyFaceDetectorOptions(options)
		).withFaceLandmarks(true)
		//console.log(detections)
		console.log("detection");
		//console.log(detections[0].landmarks)
		const resizedDetections = faceapi.resizeResults(detections,displaySize);
	if(resizedDetections[0]){
		face_count = 0;
		for(let i=0; i<max_face_num; i++){
			if(resizedDetections[i]){ 
				face_landmarks[i].update(resizedDetections[i].landmarks._positions);
				face_landmarks[i].isFace(true);
				face_count ++;
			}else{
				face_landmarks[i].isFace(false);
			}
		}
		//console.log(face_count);
	}
}
