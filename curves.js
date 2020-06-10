class Curves{

	constructor(_speed, _curve_length){
		this.position = [];
		this.target = createVector();
		this.speed = _speed;
		this.curve_length = _curve_length;
		this.is_init = false;
	}

	init(_target){
		for(let i=0; i<this.curve_length; i++){
			let r = height * 0.12;
			let x = _target.x + random(-r,r);
			let y = _target.y + random(-r,r);
			this.position[i] = createVector(x,y);
		}
		this.is_init = true;
	}

	reset(){
		this.is_init = false;
		this.position = [];
	}

	has_init(){
		return this.is_init;
	}

	update(_target, _impact){
		this.target = _target;
		
		for(let i=1; i<this.curve_length; i++){
			let imp_r = _impact * 0.1;
			let imp_x = (this.position[i].x - 0) * imp_r;
			let imp_y = (this.position[i].y - 0) * imp_r;

			this.position[i].x += (this.position[i-1].x-this.position[i].x) * this.speed + imp_x;
			this.position[i].y += (this.position[i-1].y-this.position[i].y) * this.speed + imp_y;
		}

		this.position[0].x += (this.target.x-this.position[0].x) * this.speed;
		this.position[0].y += (this.target.y-this.position[0].y) * this.speed;
	}

	display(){
		noFill();
		beginShape();
		vertex(this.target.x,this.target.y);
		for(let i=0; i<this.curve_length; i++){
			vertex(this.position[i].x,this.position[i].y);
		}
		endShape();
	}

}