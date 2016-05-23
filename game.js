var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(800, 800, {backgroundColor: 0x3344ee});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();

PIXI.loader
	.add("minerWalk.json")
	.load(ready);

function ready(){
	var standing = new PIXI.Sprite(PIXI.Texture.fromFrame("miner8.png"));
	standing.scale.x = 4;
	standing.scale.y = 4;
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
	walking.position.x = 200;
	walking.position.y = 200;
	walking.animationSpeed = 0.4;
	walking.play();
	stage.addChild(walking);

	//Keyboard controls
	function keydownEventHandler(e) {

		//if (e.keyCode == 87) { //W key
			//walking.position.y -= 5;
		//}

		//if (e.keyCode == 83) { //S key
			//walking.position.y +=5;
		//}

		if (e.keyCode == 65) { //A key
			walking.position.x -= 5;
			
			if (walking.scale.x == 1 ){
				walking.scale.x = -1;
				walking.position.x += 25;
			}
				
		}

		if (e.keyCode == 68) { //D key
			walking.position.x += 5;
			if (walking.scale.x == -1 ){
				walking.scale.x = 1;
				walking.position.x -= 25;
			}
		}
		
	}

	document.addEventListener('keydown', keydownEventHandler);

}


function animate() {
	requestAnimationFrame(animate);
	renderer.render(stage);
}
animate();