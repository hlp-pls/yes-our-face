class Faces{

	constructor(){
		this.landmarks = [];
		this.ordered_landmarks = [];
		this.order_length = 42;
		this.curves = [];
		this.curve_num = 68;
		this.curve_detail = (isMobile.any())? 8 : 20;

		this.dx;
		this.dy;
		this.ex;
		this.ey;
		this.stage = 0;
		this.ease_speed = 0.2;
		this.impact = 0.1;

		this.amp = 0;
		this.freq = 0;
		this.pan = 0;

		this.drawing = true;
		this.reset_count = 0;

		this.distance_to_target = 0;

		this.is_face = false;

		this.osc = new p5.Oscillator('triangle');
		this.osc.start(0.1);

		for(let i=0; i<this.curve_num; i++){
			this.curves.push(new Curves(0.3, this.curve_detail));
		}

		for(let i=0; i<this.order_length; i++){
			this.ordered_landmarks.push(new Points());
		}
	}

	update(_landmarks){
		this.landmarks = _landmarks;
		/*
		this.ordered_landmarks[0].set(this.landmarks[8-4]._x,this.landmarks[8-4]._y);
		this.ordered_landmarks[1].set(this.landmarks[36]._x,this.landmarks[36]._y);
		this.ordered_landmarks[2].set(this.landmarks[21]._x,this.landmarks[21]._y);
		this.ordered_landmarks[3].set(this.landmarks[22]._x,this.landmarks[22]._y);
		this.ordered_landmarks[4].set(this.landmarks[45]._x,this.landmarks[45]._y);

		let mx = (this.landmarks[2]._x+this.landmarks[14]._x)*0.5;
		let my = (this.landmarks[2]._y+this.landmarks[14]._y)*0.5;

		let x_82 = -1*(this.landmarks[8+2]._x-mx)+mx;
		let y_82 = -1*(this.landmarks[8+2]._y-my)+my;

		let x_8 = -1*(this.landmarks[8]._x-mx)+mx;
		let y_8 = -1*(this.landmarks[8]._y-my)+my;

		let x_8_2 = -1*(this.landmarks[8-2]._x-mx)+mx;
		let y_8_2 = -1*(this.landmarks[8-2]._y-my)+my;

		this.ordered_landmarks[5].set(x_8_2,y_8_2);
		this.ordered_landmarks[6].set(x_8,y_8);
		this.ordered_landmarks[7].set(x_82,y_82);
		
		this.ordered_landmarks[8].set(this.landmarks[36]._x,this.landmarks[36]._y);
		this.ordered_landmarks[9].set(this.landmarks[40]._x,this.landmarks[28]._y);
		this.ordered_landmarks[10].set(this.landmarks[21]._x,this.landmarks[21]._y);
		this.ordered_landmarks[11].set(this.landmarks[27]._x,this.landmarks[27]._y);
		this.ordered_landmarks[12].set(this.landmarks[22]._x,this.landmarks[22]._y);
		this.ordered_landmarks[13].set(this.landmarks[47]._x,this.landmarks[28]._y);
		this.ordered_landmarks[14].set(this.landmarks[45]._x,this.landmarks[45]._y);

		this.ordered_landmarks[15].set(this.landmarks[8+4]._x,this.landmarks[8+4]._y);
		this.ordered_landmarks[16].set(this.landmarks[35]._x,this.landmarks[35]._y);
		this.ordered_landmarks[17].set(this.landmarks[47]._x,this.landmarks[28]._y);
		this.ordered_landmarks[18].set(this.landmarks[27]._x,this.landmarks[27]._y);
		this.ordered_landmarks[19].set(this.landmarks[35]._x,this.landmarks[35]._y);
		this.ordered_landmarks[20].set(this.landmarks[31]._x,this.landmarks[31]._y);
		this.ordered_landmarks[21].set(this.landmarks[27]._x,this.landmarks[27]._y);
		this.ordered_landmarks[22].set(this.landmarks[40]._x,this.landmarks[28]._y);
		this.ordered_landmarks[23].set(this.landmarks[31]._x,this.landmarks[31]._y);

		this.ordered_landmarks[24].set(this.landmarks[8-4]._x,this.landmarks[8-4]._y);
		this.ordered_landmarks[25].set(this.landmarks[48]._x,this.landmarks[48]._y);
		this.ordered_landmarks[26].set(this.landmarks[31]._x,this.landmarks[31]._y);

		this.ordered_landmarks[27].set(this.landmarks[51]._x,this.landmarks[51]._y);
		this.ordered_landmarks[28].set(this.landmarks[35]._x,this.landmarks[35]._y);
		this.ordered_landmarks[29].set(this.landmarks[54]._x,this.landmarks[54]._y);
		this.ordered_landmarks[30].set(this.landmarks[8+4]._x,this.landmarks[8+4]._y);
		this.ordered_landmarks[31].set(this.landmarks[9]._x,this.landmarks[9]._y);
		this.ordered_landmarks[32].set(this.landmarks[57]._x,this.landmarks[57]._y);
		this.ordered_landmarks[33].set(this.landmarks[54]._x,this.landmarks[54]._y);
		this.ordered_landmarks[34].set(this.landmarks[51]._x,this.landmarks[51]._y);
		this.ordered_landmarks[35].set(this.landmarks[48]._x,this.landmarks[48]._y);
		this.ordered_landmarks[36].set(this.landmarks[57]._x,this.landmarks[57]._y);
		this.ordered_landmarks[37].set(this.landmarks[7]._x,this.landmarks[7]._y);
		this.ordered_landmarks[38].set(this.landmarks[9]._x,this.landmarks[9]._y);
		this.ordered_landmarks[39].set(this.landmarks[8]._x,this.landmarks[8]._y);
		this.ordered_landmarks[40].set(this.landmarks[7]._x,this.landmarks[7]._y);
		this.ordered_landmarks[41].set(this.landmarks[8-4]._x,this.landmarks[8-4]._y);
		*/
		
	}

	display(){

		if(this.is_face){

			this.drawseq();
			
		}else{
			/*
			console.log("lost!");
			for(let i=0; i<this.curves.length; i++){
				this.curves[i].reset();
			}
			this.stage = 0;
			*/
		}
	}

	sound(_is_playing){
		if(_is_playing && this.landmarks.length > 0){

			this.mouth_size = 0;
			this.face_size = 0;
			/*
			let mouth_width = dist(
				landmark_points[48]._x,landmark_points[48]._y,
				landmark_points[54]._x,landmark_points[54]._y
				);
			let mouth_height = dist(
				landmark_points[51]._x,landmark_points[51]._y,
				landmark_points[57]._x,landmark_points[57]._y
				);
			*/
			this.face_x_pos = (this.landmarks[48]._x + this.landmarks[54]._x) * 0.5;

			{
				//입주변을 한바퀴 돌고 시작점과 한개의 점을 사이에 둔 점까지 그려짐. --> tx2,ty2는 바로 직전 점까지 값을 얻는다.
				//첫번째 점(시작점)은 이후의 모든 삼각형들의 꼭지점이 된다.
				let px = -cam_width/2+this.landmarks[48]._x;
				let py = -cam_height/2+this.landmarks[48]._y;
				//vertex(px,py);
				for(let i=49; i<59; i++){
					//let x = -cam_width/2+landmark_points[i]._x;
					//let y = -cam_height/2+landmark_points[i]._y;
					//vertex(x,y);

					//시작점의 위치 바로 전전까지 (60-2) 다음 점을 참조하여 삼각형의 선분으로 이용한다.
					let tx1 = -cam_width/2+this.landmarks[i]._x;
					let ty1 = -cam_height/2+this.landmarks[i]._y;

					let tx2 = -cam_width/2+this.landmarks[i+1]._x;
					let ty2 = -cam_height/2+this.landmarks[i+1]._y;

					//(tx1,ty1),(tx2,ty2)를 지나는 선분의 길이를 구한다.
					let tl = dist(tx1,ty1,tx2,ty2);

					//(tx1,ty1),(tx2,ty2)를 지나는 직선과 (px,py)의 거리를 구한다.
					let nv = createVector(ty2-ty1,tx1-tx2);
					let t1_p = createVector(tx1-px,ty1-py);
					let th = p5.Vector.dot(t1_p, nv) / nv.mag();
				
					//삼각형의 면적
					let tsz = tl * th * 0.5;

					this.mouth_size += tsz;
				}
			}

			{//얼굴 면적 계산
				let px = -cam_width/2+this.landmarks[0]._x;
				let py = -cam_height/2+this.landmarks[0]._y;
				
				for(let i=1; i<16; i++){
					//시작점의 위치 바로 전전까지 (60-2) 다음 점을 참조하여 삼각형의 선분으로 이용한다.
					let tx1 = -cam_width/2+this.landmarks[i]._x;
					let ty1 = -cam_height/2+this.landmarks[i]._y;

					let tx2 = -cam_width/2+this.landmarks[i+1]._x;
					let ty2 = -cam_height/2+this.landmarks[i+1]._y;

					//(tx1,ty1),(tx2,ty2)를 지나는 선분의 길이를 구한다.
					let tl = dist(tx1,ty1,tx2,ty2);

					//(tx1,ty1),(tx2,ty2)를 지나는 직선과 (px,py)의 거리를 구한다.
					let nv = createVector(ty2-ty1,tx1-tx2);
					let t1_p = createVector(tx1-px,ty1-py);
					let th = p5.Vector.dot(t1_p, nv) / nv.mag();
				
					//삼각형의 면적
					let tsz = tl * th * 0.5;

					this.face_size += tsz;
				}
			}

			//console.log(mouth_size);	
			this.freq = ( 600 * this.mouth_size / (width * height * 0.02) + 100 ) * 5.0 / stroke_selection;
			this.amp = 0.9 * (-1. * this.face_size) / (width * height * 0.2) + 0.1;
			//console.log(this.face_size);
			this.amp *= this.distance_to_target;
			this.pan = (this.face_x_pos / width) * (-2.0) + 1.0;
			this.pan = constrain(this.pan,-1,1);

			this.osc.freq(this.freq, 0.1);
			this.osc.amp(this.amp, 0.1);
			this.osc.pan(this.pan, 0.1);

			this.impact = (this.mouth_size * 0.5) / (width * height * 0.02);

		}else{
			this.osc.amp(0.0);
		}

	}

	get_amp(){
		return this.amp;
	}

	get_pan(){
		return this.pan;
	}

	get_freq(){
		return this.freq;
	}

	drawseq(){
		//console.log(this.stage,this.landmarks.length);
		if(this.landmarks.length > 0){
			if(this.stage < this.landmarks.length){
				if(this.stage==0){
					this.dx = this.landmarks[0]._x;
					this.dy = this.landmarks[0]._y;
				}else{
					this.distance_to_target = (dist(
						this.dx,this.dy,
						this.landmarks[this.stage]._x,
						this.landmarks[this.stage]._y
						))/
					(dist(
						this.landmarks[this.stage-1]._x,
						this.landmarks[this.stage-1]._y,
						this.landmarks[this.stage]._x,
						this.landmarks[this.stage]._y
						));
				}

				this.dx += (this.landmarks[this.stage]._x - this.dx) * this.ease_speed;
				this.dy += (this.landmarks[this.stage]._y - this.dy) * this.ease_speed;

				if(dist(this.dx,this.dy,
					this.landmarks[this.stage]._x,
					this.landmarks[this.stage]._y)<2.0){
					this.stage++;
				}
				this.drawing = true;
			}else{
				this.dx = this.landmarks[this.stage-1]._x;
				this.dy = this.landmarks[this.stage-1]._y;
				this.reset_count++;
				this.drawing = false;
				if(this.reset_count/getFrameRate() > 60){
					for(let i=0; i<this.stage; i++){
						this.curves[i].reset();
					}
					this.stage = 0;
					this.reset_count = 0;
					
				}
			}

			this.ex = -cam_width/2+this.dx;
			this.ey = -cam_height/2+this.dy;
			if(this.drawing){
				fill(0);
				noStroke();
				for(let i=0; i<this.stage; i++){
					let x = -cam_width/2+this.landmarks[i]._x;
					let y = -cam_height/2+this.landmarks[i]._y;
					push();
					translate(x,y);
					scale(-1,1);
					text(i,0,0);
					scale(-1,1);
					pop();
				}
			}

			noFill();
			stroke(0);
			strokeWeight(stroke_selection);
			for(let i=0; i<this.stage; i++){
				let tx = -cam_width/2+this.landmarks[i]._x;
				let ty = -cam_height/2+this.landmarks[i]._y;
				let tv = createVector(tx,ty);
				if(!this.curves[i].has_init()){ 
					this.curves[i].init(tv); 
				}else{
					this.curves[i].update(tv,this.impact);
					this.curves[i].display();
				}
			}
			
			beginShape();
			for(let i=0; i<this.stage; i++){
				let x = -cam_width/2+this.landmarks[i]._x;
				let y = -cam_height/2+this.landmarks[i]._y;
				vertex(x,y);
				ellipse(x,y,5,5);
			}
			vertex(this.ex,this.ey);
			endShape();
			ellipse(this.ex,this.ey,5,5);

		}
	}

	isFace(_is_it){
		this.is_face = _is_it;
	}

}