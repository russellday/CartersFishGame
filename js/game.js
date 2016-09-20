// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 481;
document.body.appendChild(canvas);

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

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/hero.png";


// Game objects
var fish = {
	speed: 256 // movement in pixels per second
};
var monster = {
  	speed: 156 // movement in pixels per second
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

  // Throw the monster somewhere on the screen randomly
  monster.x = 32 + (Math.random() * (canvas.width - 64));
  monster.y = 32 + (Math.random() * (canvas.height - 64));

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
  //monster = monster.speed * modifier;
};

function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
}

// Draw everything
var render = function () {
    ctx.drawImage(bgImage, 0, 0);
		ctx.drawImage(fishImage, fish.x, fish.y);

    curX += Math.random() * xFac * 2 - xFac;
    curY += Math.random() * yFac * 2 - yFac;

    // don't go beyond bounds
    curX = clamp(curX, 0, 800);
    curY = clamp(curY, 0, 500);

    ballPosX += velX;
    ballPosY += velY;

    // do boundary detection for bounce
    if (ballPosX + radius > ctx.width || ballPosX - radius < 0) {
        // change velX to negative to bounce the ball the oposite X direction
        velX *= -1;
    }


    monster.x = ballPosX;
    monster.y = ballPosY;

		//ctx.drawImage(monsterImage, monster.x, monster.y);
    ctx.drawImage(monsterImage, monster.x, monster.y);
};

// The main game loop
var main = function () {
  var now = Date.now();
	var delta = now - then;

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
