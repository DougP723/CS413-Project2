
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

isIntersecting = function(r1, r2) {
        return !(r2.x > (r1.x + r1.width)  || 
           (r2.x + r2.width ) < r1.x || 
           r2.y > (r1.y + r1.height) ||
           (r2.y + r2.height) < r1.y);
}

inTheWay = function(r1, r2){
	return !(r2.x > (r1.x)  || 
           (r2.x) < r1.x);
}

var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(400, 400, {backgroundColor: 0x808080});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

PIXI.loader
	.add("minerWalk.json")
	.load(ready);

function ready(){

	//Initialize miner sprites
	var standing_texture = PIXI.Texture.fromImage("miner8.png");
	standing = new PIXI.Sprite(standing_texture);

	//stage.addChild(standing);
	miner_container.addChild(standing);
	standing.scale.x = 0.90;
	standing.scale.y = 0.90;
	standing.position.x = 0;
	standing.position.y = 0;
	standing.width = 25; //Adjusted to the scale

	//Add the walking animation to the container
	var frames = [];
	for (var i=1; i<=8; i++) {
		frames.push(PIXI.Texture.fromFrame('miner' + i + '.png'));
	}

	walking = new PIXI.extras.MovieClip(frames);
	//walking.play();
	//stage.addChild(walking);
	miner_container.addChild(walking);
	walking.scale.x = standing.scale.x;
	walking.scale.y = standing.scale.y;
	walking.position.x = standing.position.x;
	walking.position.y = standing.position.y;
	walking.animationSpeed = 0.3;

	function keydownEventHandler(e) {

		//stage.removeChild(standing);
		miner_container.removeChild(standing);
		if (e.keyCode == 65) { //A key
			stage.position.x -= 2;
			
			if (walking.scale.x == 0.90 ){
				//walking.scale.x = -0.90;
				//miner_container.position.x += 25;
			}
			walking.play();
			//stage.addChild(walking);
			miner_container.addChild(walking);
				
		}

		if (e.keyCode == 68) { //D key
			miner_container.position.x += 2;
			if (walking.scale.x == -0.90 ){
				walking.scale.x = 0.90;
				//miner_container.position.x -= 25;
			}
			walking.play();
			//stage.addChild(walking);
			miner_container.addChild(walking);
		}
	}

	function keyupEventHandler(e) {
		if (e.keyCode == 65) {
			walking.stop();
			standing.position.x = walking.position.x;
			standing.position.y = walking.position.y;
			standing.scale.x = walking.scale.x;
			//stage.addChild(standing);
			//stage.removeChild(walking);
			miner_container.addChild(standing);
			miner_container.removeChild(walking);
		}
		if (e.keyCode == 68) {
			walking.stop();
			standing.position.x = walking.position.x;
			standing.position.y = walking.position.y;
			standing.scale.x = walking.scale.x;
			//stage.addChild(standing);
			//stage.removeChild(walking);
			miner_container.addChild(standing);
			miner_container.removeChild(walking);
		}

	}
	document.addEventListener('keydown', keydownEventHandler);
	document.addEventListener('keyup', keyupEventHandler);

	//This section of code will build the level
	//The dirt texture is 25x25 and will be spread
	//In a grid system of size 31x31 dirt bricks
	var x = 1;
	var dirt_texture = PIXI.Texture.fromImage("dirt_brick.png");

	function assignData(data){
        //do something with the data
        var test = data.split(",");
        //alert("data is: " + test[0]);

        var x_count = 0;
		var y_count = 0;
		var template_count = 0;
        while (y_count < 31){

			var dirt_sprite = new PIXI.Sprite(dirt_texture);
			dirt_sprite.radius = 12;
 			dirt_sprite.width = 25;
 			dirt_sprite.height = 25;
 			dirt_sprite.interactive = true;
 		
 			if (test[template_count] == "1"){
 				dirt_sprite.position.x = 4 + (x_count*25);
 				dirt_sprite.position.y = 4 + (y_count*25);
 				
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
}

var dirt = new PIXI.Container();
dirt.position.x = 4;
dirt.position.y = 4;
stage.addChild(dirt);
var dirt_blocks = [];

var miner_container = new PIXI.Container();
miner_container.position.x = 29;
miner_container.position.y = 35;
miner_container.radius = 12;
miner_container.width = 5;
miner_container.height = 20;
stage.addChild(miner_container);


var exit_texture = PIXI.Texture.fromImage("exit.png");
var exit = new PIXI.Sprite(exit_texture);
exit.position.x = 8 + 600;
exit.position.y = 8 + 600;
stage.addChild(exit);

var falling = 1;
var obstructed = 0;

var text = new PIXI.Text('Over here!',{font : '24px Arial', fill : 0xff1010, align : 'center'});
text.position.x = 8 + 650;
text.position.y = 8 + 600;
stage.addChild(text);


function animate() {
	requestAnimationFrame(animate);
	renderer.render(stage);
	for (var j in dirt_blocks){
		var block = dirt_blocks[j];
		if (isIntersecting(block, miner_container)){
			//miner_container.position.y = 0;
			falling = 0;
		}
		else{
			//miner_container.position.y = 0;
			//falling = 1;
		}
	}
	if (falling == 1){
		miner_container.position.y += 1;
	}
	else{
		miner_container.position.y += 0;
		falling = 1;
	}

	if (isIntersecting(exit, miner_container)){
			//win game	
		}
	
}
animate();