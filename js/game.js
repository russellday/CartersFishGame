// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 481;
document.body.appendChild(canvas);

var TotalHits = 0;

var w = canvas.width;
var h = canvas.height;
var frameOffset = 5;
var curX = w / 2;
var curY = h / 2;
var xFac = 10;
var yFac = 10;

var velX = 5;
var velY = 2;
var ballPosX = 100;
var ballPosY = 50;
var radius = 10;

// Jelly Spawn code begin
	// newly spawned objects start at Y=25
	var spawnLineY = 25;

	// spawn a new object every 1500ms
	var spawnRate = 1500;

	// set how fast the objects will fall
	var spawnRateOfDescent = 0.50;

	// when was the last object spawned
	var lastSpawn = -1;

	// this array holds all spawned object
	var jellies = [];

	// save the starting time (used to calc elapsed time)
	var startTime = Date.now();

	var img1 = new Image();
	img1.src = "images/jellyfish.png";

	// Our images array
	var images = [img1];
// Jelly Spawn code end

// Shark Spawn code begin
	var shark_spawnLineY = 0;

	// spawn a new object every 1500ms
	var shark_spawnRate = 5000;

	// set how fast the objects will fall
	//var shark_spawnRateAttack= 5.00;
	var shark_spawnRateAttack= 5.00;

	// when was the last object spawned
	var shark_lastSpawn = -1;

	// this array holds all spawned object
	var sharks = [];

	// save the starting time (used to calc elapsed time)
	var shark_startTime = Date.now();

	var shark_img1 = new Image();
	shark_img1.src = "images/shark1.png";

	var shark_img2 = new Image();
	shark_img2.src = "images/shark2.png";

	// Our images array
	var shark_images = [shark_img1];
// Shark Spawn code end

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/ocean.png";

// fish image
var fishImage = new Image();
fishImage.src = "images/smallfish.png";

var hits = 0;

// Game objects
var fish = {
	speed: 256 // movement in pixels per second
};

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	fish.x = canvas.width / 2;
	fish.y = canvas.height / 2;
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		fish.y -= fish.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		fish.y += fish.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		fish.x -= fish.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		fish.x += fish.speed * modifier;
	}

	jellies.forEach(function(entry) {
		// Are they touching?
		if (
			fish.x <= (entry.x + 32)
			&& entry.x <= (fish.x + 32)
			&& fish.y <= (entry.y + 32)
			&& entry.y <= (fish.y + 32)
		)
		{
			++hits;
			entry.y += 5;
			if(hits >= 1){
				var adjusted = Math.round(hits/10);
				TotalHits = adjusted;
			}
		}
	});

	sharks.forEach(function(shark) {

		//x = left and right
		//y = up and down

		// Are they touching?
		//console.log("shark-x", shark.x );
		//console.log("shark-y", shark.y );
		//console.log("fish-x", fish.x );
		//console.log("fish-y", fish.y );

		if (
			fish.x <= (shark.x + 300)
			&& shark.x <= (fish.x + 300)
			&& fish.y <= (shark.y + 30) //up and down
			&& shark.y <= (fish.y + 30) //up and down
		)
		{

			console.log("shark-x", shark.x );
			console.log("shark-y", shark.y );
			console.log("fish-x", fish.x );
			console.log("fish-y", fish.y );

			if(fish.x <= (shark.x + 30)){
				console.log("fish.x <= shark.x + 30", "yes");
			}
			if(shark.x <= (fish.x + 30)){
				console.log("shark.x <= fish.x + 30", "yes");
			}
			if(fish.y <= (shark.y + 30)){
			  console.log("fish.y <= shark.y + 30", "yes");
			}
			if(shark.y <= (fish.y + 30)){
				console.log("shark.y <= fish.y + 30", "yes");
			}


			TotalHits = 1000;
		}
	});

};

function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
}

function spawnJellyFish() {
    // create new jellyfish
    var jelly = {
        // set x randomly but at least 15px off the canvas edges
        x: Math.random() * (canvas.width - 30) + 15,
        // set y to start on the line where objects are spawned
        y: spawnLineY,
        // give random image
        image: images[Math.floor(Math.random()*images.length)]
    }
    // add the new object to the objects[] array
    jellies.push(jelly);
}

function spawnShark() {
    var shark_object = {
        y: Math.random() * (canvas.height + 5), //random
        x: shark_spawnLineY, //far left
        image: shark_images[Math.floor(Math.random()*shark_images.length)]
    }
    sharks.push(shark_object);
}


// Draw everything
var render = function () {

	  //its easy to get canvas to go full screen..
		//need to figure out the background image
		//ctx.canvas.width  = window.innerWidth;
    //ctx.canvas.height = window.innerHeight;

		ctx.drawImage(bgImage, 0, 0);
		ctx.drawImage(fishImage, fish.x, fish.y);

		// move each jellyfish down the canvas
    for (var i = 0; i < jellies.length; i++) {
        var j = jellies[i];
        j.y += spawnRateOfDescent;
        ctx.drawImage(j.image, j.x, j.y, 35, 35);
    }

		//sharks
		for (var i = 0; i < sharks.length; i++) {
				var s = sharks[i];
				s.x += shark_spawnRateAttack;
				ctx.drawImage(s.image, s.x, s.y);
		}

		// Score
		if(TotalHits >= 5){
			ctx.fillStyle = "rgb(250, 250, 250)";
			ctx.font = "14px Helvetica";
			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			ctx.fillText("YOU LOST", 32, 32);
			throw "Game Over";
		}
		else{
			ctx.fillStyle = "rgb(250, 250, 250)";
			ctx.font = "14px Helvetica";
			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			ctx.fillText("Hits: " + Math.round(hits/10), 32, 32);
		}
};

// The main game loop
var main = function () {
  var now = Date.now();
	var delta = now - then;

	// see if its time to spawn a new object
	if (now > (lastSpawn + spawnRate)) {
			lastSpawn = now;
			spawnJellyFish();
	}

	if (now > (shark_lastSpawn + shark_spawnRate)) {
		  var shark_spanrandom = Math.floor(Math.random() * 10) + 1;
			//console.log("shark_spanrandom:", shark_spanrandom);
			if(shark_spanrandom === 3){
				shark_lastSpawn = now;
				spawnShark();
			}
			else{
				//console.log("skipping shark:", shark_spanrandom);
			}
	}

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
