isIntersecting = function(r1, r2) {
        return !(r2.x-4 > (r1.x-4 + r1.width-4)  || 
           (r2.x-4 + r2.width-4 ) < r1.x-4 || 
           r2.y-4 > (r1.y-4 + r1.height-4) ||
           (r2.y-4 + r2.height-4) < r1.y-4);
}

var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(600, 600, {backgroundColor: 0x808080});
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
	miner_container.addChild(walking);
	walking.scale.x = standing.scale.x;
	walking.scale.y = standing.scale.y;
	walking.position.x = standing.position.x;
	walking.position.y = standing.position.y;
	walking.animationSpeed = 0.3;

	var direction = "Right";
	function keydownEventHandler(e) {

		miner_container.removeChild(standing);
		if (e.keyCode == 65) { //A key
			stage.position.x += 10;
			miner_container.position.x -= 2;
			if (direction == "Right"){
				walking.scale.x = -0.90;
				walking.position.x = walking.position.x + 25;
				direction = "Left"
			}
			walking.play();
			miner_container.addChild(walking);
				
		}

		if (e.keyCode == 68) { //D key
			stage.position.x -= 10;
			miner_container.position.x += 2;
			if (direction == "Left"){
				walking.scale.x = 0.90;
				walking.position.x = walking.position.x - 25;
				direction = "Right";
			}
			walking.play();
			miner_container.addChild(walking);
		}
	}

	function keyupEventHandler(e) {
		if (e.keyCode == 65) {
			walking.stop();
			standing.position.x = walking.position.x;
			standing.position.y = walking.position.y;
			standing.scale.x = walking.scale.x;
			miner_container.addChild(standing);
			miner_container.removeChild(walking);
		}
		if (e.keyCode == 68) {
			walking.stop();
			standing.position.x = walking.position.x;
			standing.position.y = walking.position.y;
			standing.scale.x = walking.scale.x;
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

var exit_container = new PIXI.Container();
exit_container.position.x = 8 + 600;
exit_container.position.y = 8 + 600;
exit_container.width = 25;
exit_container.height = 25;
stage.addChild(exit_container);
var exit_texture = PIXI.Texture.fromImage("exit.png");
var exit = new PIXI.Sprite(exit_texture);
exit_container.addChild(exit);

var falling = 1;
var obstructed = 0;

var text = new PIXI.Text('Nice Job!',{font : '24px Arial', fill : 0xff1010, align : 'center'});
text.position.x = 8 + 550;
text.position.y = 8 + 575;
stage.addChild(text);

var text = new PIXI.Text('This Way! ->',{font : '24px Arial', fill : 0xff1010, align : 'center'});
text.position.x = 8 + 25;
text.position.y = 8 + 100;
stage.addChild(text);

stage.scale.x = 5;
stage.scale.y = 5;
stage.position.x = 29;
stage.position.y = 35;

function animate() {
	requestAnimationFrame(animate);
	renderer.render(stage);
	for (var j in dirt_blocks){
		var block = dirt_blocks[j];
		if (isIntersecting(block, miner_container)){
			falling = 0;
		}
	}
	if (falling == 1){
		miner_container.position.y += 1;
		stage.position.y -= 5;
	}
	else{
		miner_container.position.y += 0;
		falling = 1;
	}
	
}
animate();