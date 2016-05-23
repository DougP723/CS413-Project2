var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(800, 800, {backgroundColor: 0x3344ee});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();

PIXI.loader
	.add("minerWalk.json")
	.load(ready);

function ready(){

	var dirt = new PIXI.Container();
	dirt.position.x = 4;
	dirt.position.y = 4;
	stage.addChild(dirt);

	var x = 1;
	var dirt_texture = PIXI.Texture.fromImage("dirt_brick.png");
	var dirt_sprite = new PIXI.Sprite(dirt_texture);

	var x_count = 0;
	var y_count = 0;
	while (y_count < 31){
		var s = new PIXI.Sprite(dirt_texture);
 
 		s.position.x = 4 + (y_count*25);
 		s.position.y = 4 + (x_count*25);
 		dirt.addChild(s);
 		x_count++;
 		if (x_count == 31){
 			x_count = 0;
 			y_count++;
 		}

	}
	for(var i=0; i<31; i++) {
 	 	var s = new PIXI.Sprite(dirt_texture);
 
 		s.position.x = 4 + (i*25);
 		s.position.y = 4 + (x_count*25);
 		dirt.addChild(s);

  	}
  	/*
	dirt.addChild(dirt_sprite1);
	dirt_sprite.anchor.x = 0;
	dirt_sprite.anchor.y = 0;
	dirt_sprite.position.x = 4;
	dirt_sprite.position.y = 4;

	dirt.addChild(dirt_sprite);
	dirt_sprite.anchor.x = 0;
	dirt_sprite.anchor.y = 0;
	dirt_sprite.position.x = 29;
	dirt_sprite.position.y = 29;
	*/

	//Initialize miner sprites
	var standing = new PIXI.Sprite(PIXI.Texture.fromFrame("miner8.png"));
	standing.scale.x = 1;
	standing.scale.y = 1;
	standing.position.x = 50;
	standing.position.y = 200;
	stage.addChild(standing);

	var frames = [];
	for (var i=1; i<=8; i++) {
		frames.push(PIXI.Texture.fromFrame('miner' + i + '.png'));
	}

	var walking = new PIXI.extras.MovieClip(frames);
	walking.scale.x = 1;
	walking.scale.y = 1;
	walking.position.x = standing.position.x;
	walking.position.y = standing.position.y;
	walking.animationSpeed = 0.4;
	//walking.play();
	//stage.addChild(walking);



	//Keyboard controls
	function keydownEventHandler(e) {

		//if (e.keyCode == 87) { //W key
			//walking.position.y -= 5;
		//}

		//if (e.keyCode == 83) { //S key
			//walking.position.y +=5;
		//}

		stage.removeChild(standing);
		if (e.keyCode == 65) { //A key
			walking.position.x -= 5;
			
			if (walking.scale.x == 1 ){
				walking.scale.x = -1;
				walking.position.x += 25;
			}
			walking.play();
			stage.addChild(walking);
				
		}

		else if (e.keyCode == 68) { //D key
			walking.position.x += 5;
			if (walking.scale.x == -1 ){
				walking.scale.x = 1;
				walking.position.x -= 25;
			}
			walking.play();
			stage.addChild(walking);
		}
		
		else {

			walking.stop();
			stage.addChild(walking);
		}
	}
	
	function keyupEventHandler(e) {
		walking.stop();
		standing.position.x = walking.position.x;
		standing.position.y = walking.position.y;
		standing.scale.x = walking.scale.x;
		stage.addChild(standing);
		stage.removeChild(walking);
	}

	document.addEventListener('keydown', keydownEventHandler);
	document.addEventListener('keyup', keyupEventHandler);
}


function animate() {
	requestAnimationFrame(animate);
	renderer.render(stage);
}
animate();