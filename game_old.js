
function normalize(obj){
	var len = Math.sqrt((obj.vx * obj.vx) + (obj.vy * obj.vy));
	obj.vx /= len;
	obj.vy /= len;
}

function circle_intersection(c0, c1){
	var c0x = c0.position.x + c0.radius;
	var c0y = c0.position.y + c0.radius;
	var c1x = c1.position.x + c1.radius;
	var c1y = c1.position.y + c1.radius;

	var cdx = c1x - c0x;
	var cdy = c1y - c0y;
	var d = c0.radius + c1.radius;
	var nd = (cdx * cdx) + (cdy * cdy);
	if (nd < d*d){
		return true;
	}
	return false;
}
var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(800, 800, {backgroundColor: 0x3344ee});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();

var dirt = new PIXI.Container();
dirt.position.x = 4;
dirt.position.y = 4;
stage.addChild(dirt);

PIXI.loader
	.add("minerWalk.json")
	.load(ready);

var standing_texture = PIXI.Texture.fromImage("miner8.png");
var standing = new PIXI.Sprite(standing_texture);

function ready(){

	//Initialize miner sprites
	standing.scale.x = 0.90;
	standing.scale.y = 0.90;
	standing.position.x = 4+25;
	standing.position.y = 10+25;
	standing.radius = 12 * 0.90; //Adjusted to the scale
	standing.vx = Math.floor(Math.random()) * 300 + 50;
	standing.vy = Math.floor(Math.random()) * 300 + 50;
	normalize(standing);
	stage.addChild(standing);

	var frames = [];
	for (var i=1; i<=8; i++) {
		frames.push(PIXI.Texture.fromFrame('miner' + i + '.png'));
	}

	var walking = new PIXI.extras.MovieClip(frames);
	walking.scale.x = standing.scale.x;
	walking.scale.y = standing.scale.y;
	walking.position.x = standing.position.x;
	walking.position.y = standing.position.y;
	walking.animationSpeed = 0.3;
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
			walking.position.x -= 2;
			
			if (walking.scale.x == 0.90 ){
				walking.scale.x = -0.90;
				walking.position.x += 25;
			}
			walking.play();
			stage.addChild(walking);
				
		}

		if (e.keyCode == 68) { //D key
			walking.position.x += 2;
			if (walking.scale.x == -0.90 ){
				walking.scale.x = 0.90;
				walking.position.x -= 25;
			}
			walking.play();
			stage.addChild(walking);
		}
	}
	
	function keyupEventHandler(e) {
		if (e.keyCode == 65) {
			walking.stop();
			standing.position.x = walking.position.x;
			standing.position.y = walking.position.y;
			standing.scale.x = walking.scale.x;
			stage.addChild(standing);
			stage.removeChild(walking);
		}
		if (e.keyCode == 68) {
			walking.stop();
			standing.position.x = walking.position.x;
			standing.position.y = walking.position.y;
			standing.scale.x = walking.scale.x;
			stage.addChild(standing);
			stage.removeChild(walking);
		}

	}

	document.addEventListener('keydown', keydownEventHandler);
	document.addEventListener('keyup', keyupEventHandler);
}
	
	//This section of code will build the level
	//The dirt texture is 25x25 and will be spread
	//In a grid system of size 31x31 dirt bricks
	var x = 1;
	var dirt_texture = PIXI.Texture.fromImage("dirt_brick.png");
	var dirt_blocks = [];
	function assignData(data){
        //do something with the data
        var test = data.split(",");
        //alert("data is: " + test[0]);

        var x_count = 0;
		var y_count = 0;
		var template_count = 0;
        while (y_count < 31){

			var dirt_sprite = new PIXI.Sprite(dirt_texture);

 		
 			if (test[template_count] == "1"){
 				dirt_sprite.position.x = 4 + (x_count*25);
 				dirt_sprite.position.y = 4 + (y_count*25);
 				dirt_sprite.radius = 12;
 				dirt.addChild(dirt_sprite);
 				dirt_blocks.push(dirt_sprite);
 			}
 				
 			x_count++;

 			if (x_count == 31){
 				x_count = 0;
 				y_count++;
 			}
 			template_count++;

		}
		return true;
    }
$.get("level1.txt",assignData);

	var exit_container = new PIXI.Container();
	exit_container.position.x = 50;
	exit_container.position.y = 200;
	stage.addChild(exit_container);

	var exit_texture = PIXI.Texture.fromImage("exit.png");
	var exit = new PIXI.Sprite(exit_texture);

	exit_container.addChild(exit);
	exit.anchor.x = 0;
	exit.anchor.y = 0;
	exit.position.x = 0;
	exit.position.y = 0;

function animate() {
	requestAnimationFrame(animate);
	renderer.render(stage);
	var block = dirt_blocks[j];
	for (var j in dirt_blocks){

		if (circle_intersection(block, standing)){

			
		}
	}
	dirt.position.y += 3;
}
animate();