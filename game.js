$("body").css("overflow", "hidden");

var x_len = Math.floor(Math.random()*19)+2;
var y_len = Math.floor(Math.random()*13)+2;

var map;
var known_map;
var specimenCount = 0;
var score = 0;


var x = Math.floor(Math.random()*x_len);
var y = Math.floor(Math.random()*y_len);

var moveLock = false;

var init = function() {	
	x_len = Math.floor(Math.random()*19)+2;
	y_len = Math.floor(Math.random()*13)+2;
	x = Math.floor(Math.random()*x_len);
	y = Math.floor(Math.random()*y_len);
	
	map = new Array(x_len);
	known_map = new Array(x_len);
	for (var i = 0; i < x_len; i++) {
		map[i] = new Array(y_len);
	}
	for (var i = 0; i < x_len; i++) {
		known_map[i] = new Array(y_len);
	}
	
	for (var i = 0; i < x_len; i++) {
		for (var j = 0; j < y_len; j++) {
			if (Math.random()*7>6)
			{
				map[i][j]=Math.floor(Math.random()*3)+1;
			}
			else
			{
				map[i][j]=0;
			}
		}
	}
	map[x][y]=0;
	update();
	console.log(map);
	
}

var update = function() {
	var text;
	
	if (map[x][y] == 0) {
		text = "...";
		var button = "";
	}
	else if (map[x][y] == 1) {
		text = "You have sighted a planet.";
		// run planet code
		
		if (known_map[x][y] == undefined)
		{
			var button = createContinue("planetExplore");
		}
		else
		{
			var button = "";
		}
	}
	else if (map[x][y] == 2) {
		text = "You found an enemy spaceship.";
		// run spaceship code
		if (known_map[x][y] == undefined)
		{
			var button = createContinue("spaceFight"); // IMPLEMENT THIS!!!!
		}
		else
		{
			var button = "";
		}
	}
	else if (map[x][y] == 3) {
		text = "You are in an asteroid belt.";
		if (known_map[x][y] == undefined)
		{
			var button = createContinue("asteroidGame"); // IMPLEMENT THIS!!!!
		}
		else
		{
			var button = "";
		}
	}
	else {
		text = "Something has gone wrong"; // THIS LINE SHOULD NEVER BE RUN
	}
	
	known_map[x][y] = map[x][y]
	
	//if (x <= 0) { text+= "<br>There is an impassable barrier to your left."; x = 0; }
	//if (x >= x_len - 1 ) { text+= "<br>There is an impassable barrier to your right."; x = x_len - 1; }
	//if (y <= 0) { text+= "<br>There is an impassable barrier to your front."; y = 0; }
	//if (y >= y_len - 1 ) { text+= "<br>There is an impassable barrier to your back."; y = y_len - 1; }
	
	console.log(x + ", " + y);
	
	var images = "";
	
	// display map
	for (var j = 0; j < y_len; j++) {
		for (var i = 0; i < x_len; i++) {
			if (i == x && j == y) // current position
			{
				images += "<img src=cursor.png x=" + i + " y=" + j + " class=noselect draggable=false>" 
			}
			else {
				images += "<img src=" + getImage(known_map[i][j]) + " x=" + i + " y=" + j + " onclick=warp(" + i + "," + j + ") class=noselect draggable=false>"; // onclick is for instantly going places
			}
		}
		images += "<br>";	
	}
	
	document.getElementById("game").innerHTML = text + "<br><div id='map'>" + images + "</div>";
	document.getElementById("game").innerHTML += button;
}

var up = function () {
	if (!moveLock)
	{
		if (y > 0) { // check for bounds
			y--;
			update();
		}
		else {
			//alert("You can't move there!");
		}
	}
}

var down = function () {
	if (!moveLock)
	{
		if (y < y_len - 1) { // check for bounds
			y++;
			update();
		}
		else {
			//alert("You can't move there!");
		}
	}
}

var left = function () {
	if (!moveLock)
	{
		if (x > 0) { // check for bounds
			x--;
			update();
		}
		else {
			//alert("You can't move there!");
		}
	}
}

var right = function () {
	if (!moveLock)
	{
		if (x < x_len - 1) { // check for bounds
			x++;
			update();
		}
		else {
			//alert("You can't move there!");
		}
	}
}

var warp = function (x, y) { // instantly go to these coordinates
	if (!moveLock)
	{
		this.x=x;
		this.y=y;
		update();
	}
}

var getImage = function(num) {
	var image;
	switch(num)
	{
		case 0:
			image = "blank.png";
			break;
		case 1:
			image = "planet.png";
			break;
		case 2:
			image = "ship.png";
			break;
		case 3:
			image = "asteroid.png";
			break;
		default:
			image = "unknown.png";
	}
	return image;
}

var createContinue = function(funcName) {
	moveLock = true;
	return "<input type=button value=Continue class=continue-button onclick=" + funcName + "()>";
}
var delContinue = function() {
	$('.continue-button').remove();
}	

var planetExplore = function() {
	delContinue();
	moveLock = true;
	var count = Math.floor(Math.random() * 4);
	alert("You brought back " + count + " specimens.");
	specimenCount += count;
	score += count;
	moveLock = false;
	updateScore();
}

var spaceFight = function() {
	delContinue();
	hideMap();
	
	moveLock = true;
	var quit = false;
	// Create the canvas
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = 640;
	canvas.height = 480;
	$('#game').append(canvas);
	
	var asteroidCount = 1;
	var cooldown = 0;
	var enemyCooldown = 1;
	
	// Background image
	var bgReady = false;
	var bgImage = new Image();
	bgImage.onload = function () {
		bgReady = true;
	};
	bgImage.src = "asteroids/asteroid-bg.png";
	
	// Ship image
	var shipReady = false;
	var shipImage = new Image();
	shipImage.onload = function () {
		shipReady = true;
	};
	shipImage.src = "asteroids/ship.png";
	
	// Ship image thrust
	var shipTReady = false;
	var shipTImage = new Image();
	shipTImage.onload = function () {
		shipTReady = true;
	};
	shipTImage.src = "asteroids/shipT.png";

	// Asteroid image
	var asteroidReady = false;
	var asteroidImage = new Image();
	asteroidImage.onload = function () {
		asteroidReady = true;
	};
	asteroidImage.src = "spacefight/ship.png";
	
	// Bullet image
	var bulletReady = false;
	var bulletImage = new Image();
	bulletImage.onload = function () {
		bulletReady = true;
	};
	bulletImage.src = "asteroids/bullet.png";
	
	// Game objects
	var ship = {
		accel: 2, // acceleration in pixels per second per second
		xvel: 0, // speed in pps
		yvel: 0,
		rotSpeed: 90, // speed in dps
		dir: 0, // up (so 180 is down, 90 is right, etc) 
		        // it's directly controlled but the ship's ACTUAL DIRECTION
			    // is not directly controlled -- this dir value helps affect 
			    // x-vel and y-vel but does not directly affect them
		thrust: false
	};
	
	var asteroids = [];
	for (var i = 0; i < asteroidCount; i++)	{
		asteroids.push({
			speed: Math.floor(Math.random()*100), // speed: 0 to 99
			scale: Math.random() * 1.5 + .5, // image scaling: .5 to 2
			trueDir: Math.random() * 360 - 180 // the directional movement -- other dir is for rotation
		});
	}
	
	var bullets = [];
	
	// Handle keyboard controls
	var keysDown = {};

	addEventListener("keydown", function (e) {
		keysDown[e.keyCode] = true;
	}, false);

	addEventListener("keyup", function (e) {
		delete keysDown[e.keyCode];
	}, false);
	
	// reset game
	var reset = function () {
		ship.x = canvas.width / 2;
		ship.y = canvas.height / 2;

		// Throw the asteroids on the screen randomly
		for (var ast in asteroids) {
			asteroids[ast].x = 40 + (Math.random() * (canvas.width - 80));
			asteroids[ast].y = 40 + (Math.random() * (canvas.height - 80));
		}
	};
	
	var update = function (modifier) {
		// removing colliding stuff...
		//var removeBIndex = []; // bullet indexes to be removed
		//var removeAIndex = []; // ast indexes to be removed
		//for (var b in bullets) { // really dumb collision detection.....
		//	for (var ast in asteroids) {
		//		if (distance( (bullets[b].x + 3), (asteroids[ast].x + 14 * asteroids[ast].scale), (bullets[b].y + 10), (asteroids[ast].y + 14 * asteroids[ast].scale)) <= 30)
		//		{
		//			removeBIndex.push(b);
		//			removeAIndex.push(ast);
		//		}
		//		console.log (distance( (ship.x + 12), (asteroids[ast].x + 14 * asteroids[ast].scale), (ship.x + 15), (asteroids[ast].y + 14 * asteroids[ast].scale)))
		//		if (distance( (ship.x + 12), (asteroids[ast].x + 14 * asteroids[ast].scale), (ship.x + 15), (asteroids[ast].y + 14 * asteroids[ast].scale)) <= 50)
		//		{
		//			alert("GAME OVER");
		//		}
		//	}
		//}
		//for (var i in removeBIndex) {
		//	bullets.splice(removeBIndex[i], 1);
		//}
		//for (var i in removeAIndex) {
		//	asteroids.splice(removeAIndex[ast], 1);
		//}
		
		if (38 in keysDown) { // Player holding up
			ship.xvel -= move(ship.accel * modifier, ship.dir)[0];
			ship.yvel -= move(ship.accel * modifier, ship.dir)[1];
			ship.thrust = true;
		}
		else {
			ship.thrust = false;
		}
		if (40 in keysDown) { // Player holding down
			//ship.speed += ship.accel * modifier;
		}
		if (37 in keysDown) { // Player holding left
			ship.dir -= ship.rotSpeed * modifier;
		}
		if (39 in keysDown) { // Player holding right
			ship.dir += ship.rotSpeed * modifier;
		}
		if (32 in keysDown) { // Player holding space
			if (cooldown <= 0)
			{
				//var audio = new Audio('audio/laser.wav');
				//audio.play();
				bullets.push({
					speed: 400,
					x: ship.x,
					y: ship.y,
					dir: ship.dir,
					travelDist: 0,
					MTD: 500 // max travel distance
				});
				cooldown = .1;
			}
		}
		enemyCooldown-=modifier;
		console.log(enemyCooldown);
		cooldown -=	modifier;

		ship.x += ship.xvel;
		ship.y += ship.yvel;
		
		ship.x = wrap(ship.x, ship.y, 24, 50, 640, 480)[0];
		ship.y = wrap(ship.x, ship.y, 24, 50, 640, 480)[1];
		
		for (var b in bullets) {
			bullets[b].x -= move(bullets[b].speed * modifier, bullets[b].dir)[0];
			bullets[b].y -= move(bullets[b].speed * modifier, bullets[b].dir)[1];
			bullets[b].travelDist += bullets[b].speed * modifier;
			bullets[b].x = wrap(bullets[b].x, bullets[b].y, 6, 19, 640, 480)[0];
			bullets[b].y = wrap(bullets[b].x, bullets[b].y, 6, 19, 640, 480)[1];
			if (bullets[b].travelDist >= bullets[b].MTD) {
				bullets.splice(b, 1); // remove element at index b
			}
			
		}
		
		for (var ast in asteroids)	{
			asteroids[ast].x -= move(asteroids[ast].speed * modifier, asteroids[ast].trueDir)[0];
			asteroids[ast].y -= move(asteroids[ast].speed * modifier, asteroids[ast].trueDir)[1];
			asteroids[ast].x = wrap(asteroids[ast].x, asteroids[ast].y, 96, 112, 640, 480)[0];
			asteroids[ast].y = wrap(asteroids[ast].x, asteroids[ast].y, 96, 112, 640, 480)[1];
			if (Math.random() > 0.9)
			{
				asteroids[ast].trueDir += Math.floor(Math.random() * 21)-10;
			}
			if (enemyCooldown <= 0)
			{
				//var audio = new Audio('audio/laser.wav');
				//audio.play();
				bullets.push({
					speed: 400,
					x: asteroids[ast].x,
					y: asteroids[ast].y,
					dir: asteroids[ast].trueDir,
					travelDist: 0,
					MTD: 500 // max travel distance
				});
				enemyCooldown = .5;
			}
		}
	};
	
	// Draw everything
	var render = function () {
		if (bgReady) {
			ctx.drawImage(bgImage, 0, 0);
		}
				
		if (bulletReady) {
			for (var b in bullets) {
				drawRotatedImage(bulletImage, bullets[b].x, bullets[b].y, bullets[b].dir, ctx);
			}
		}

		if (shipReady) {
			drawRotatedImage(ship.thrust ? shipTImage : shipImage, ship.x, ship.y, ship.dir, ctx);
		}

		if (asteroidReady) {
			for (var ast in asteroids) {
				drawRotatedImageScaled(asteroidImage, asteroids[ast].x, asteroids[ast].y, asteroids[ast].trueDir, ctx, 96 * asteroids[ast].scale, 112 * asteroids[ast].scale);
			}
		}
		
		

		// Score
		//ctx.fillStyle = "rgb(250, 250, 250)";
		//ctx.font = "24px Helvetica";
		//ctx.textAlign = "left";
		//ctx.textBaseline = "top";
		//ctx.fillText("Score: " , 32, 32); // TO DO
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
	console.log("2");
	// Start :D
	var then = Date.now();
	reset();
	main();
	
	$('#game').append("<br><input type=button value=Back class=back-button onclick='quit()'>");
}

var asteroidGame = function() {
	delContinue();
	hideMap();
	
	moveLock = true;
	var quit = false;
	// Create the canvas
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = 640;
	canvas.height = 480;
	$('#game').append(canvas);
	
	var asteroidCount = Math.floor(Math.random()*8) + 3;
	var cooldown = 0;
	
	// Background image
	var bgReady = false;
	var bgImage = new Image();
	bgImage.onload = function () {
		bgReady = true;
	};
	bgImage.src = "asteroids/asteroid-bg.png";
	
	// Ship image
	var shipReady = false;
	var shipImage = new Image();
	shipImage.onload = function () {
		shipReady = true;
	};
	shipImage.src = "asteroids/ship.png";
	
	// Ship image thrust
	var shipTReady = false;
	var shipTImage = new Image();
	shipTImage.onload = function () {
		shipTReady = true;
	};
	shipTImage.src = "asteroids/shipT.png";

	// Asteroid image
	var asteroidReady = false;
	var asteroidImage = new Image();
	asteroidImage.onload = function () {
		asteroidReady = true;
	};
	asteroidImage.src = "asteroids/asteroid.png";
	
	// Bullet image
	var bulletReady = false;
	var bulletImage = new Image();
	bulletImage.onload = function () {
		bulletReady = true;
	};
	bulletImage.src = "asteroids/bullet.png";
	
	// Game objects
	var ship = {
		accel: 2, // acceleration in pixels per second per second
		xvel: 0, // speed in pps
		yvel: 0,
		rotSpeed: 90, // speed in dps
		dir: 0, // up (so 180 is down, 90 is right, etc) 
		        // it's directly controlled but the ship's ACTUAL DIRECTION
			    // is not directly controlled -- this dir value helps affect 
			    // x-vel and y-vel but does not directly affect them
		thrust: false
	};
	
	var asteroids = [];
	for (var i = 0; i < asteroidCount; i++)	{
		asteroids.push({
			speed: Math.floor(Math.random()*100), // speed: 0 to 99
			scale: Math.random() * 1.5 + .5, // image scaling: .5 to 2
			dir: Math.random() * 360 - 180,
			trueDir: Math.random() * 360 - 180 // the directional movement -- other dir is for rotation
		});
	}
	
	var bullets = [];
	
	// Handle keyboard controls
	var keysDown = {};

	addEventListener("keydown", function (e) {
		keysDown[e.keyCode] = true;
	}, false);

	addEventListener("keyup", function (e) {
		delete keysDown[e.keyCode];
	}, false);
	
	// reset game
	var reset = function () {
		ship.x = canvas.width / 2;
		ship.y = canvas.height / 2;

		// Throw the asteroids on the screen randomly
		for (var ast in asteroids) {
			asteroids[ast].x = 40 + (Math.random() * (canvas.width - 80));
			asteroids[ast].y = 40 + (Math.random() * (canvas.height - 80));
		}
	};
	
	var update = function (modifier) {
		// removing colliding stuff...
		//var removeBIndex = []; // bullet indexes to be removed
		//var removeAIndex = []; // ast indexes to be removed
		//for (var b in bullets) { // really dumb collision detection.....
		//	for (var ast in asteroids) {
		//		if (distance( (bullets[b].x + 3), (asteroids[ast].x + 14 * asteroids[ast].scale), (bullets[b].y + 10), (asteroids[ast].y + 14 * asteroids[ast].scale)) <= 30)
		//		{
		//			removeBIndex.push(b);
		//			removeAIndex.push(ast);
		//		}
		//		console.log (distance( (ship.x + 12), (asteroids[ast].x + 14 * asteroids[ast].scale), (ship.x + 15), (asteroids[ast].y + 14 * asteroids[ast].scale)))
		//		if (distance( (ship.x + 12), (asteroids[ast].x + 14 * asteroids[ast].scale), (ship.x + 15), (asteroids[ast].y + 14 * asteroids[ast].scale)) <= 50)
		//		{
		//			alert("GAME OVER");
		//		}
		//	}
		//}
		//for (var i in removeBIndex) {
		//	bullets.splice(removeBIndex[i], 1);
		//}
		//for (var i in removeAIndex) {
		//	asteroids.splice(removeAIndex[ast], 1);
		//}
		
		if (38 in keysDown) { // Player holding up
			ship.xvel -= move(ship.accel * modifier, ship.dir)[0];
			ship.yvel -= move(ship.accel * modifier, ship.dir)[1];
			ship.thrust = true;
		}
		else {
			ship.thrust = false;
		}
		if (40 in keysDown) { // Player holding down
			//ship.speed += ship.accel * modifier;
		}
		if (37 in keysDown) { // Player holding left
			ship.dir -= ship.rotSpeed * modifier;
		}
		if (39 in keysDown) { // Player holding right
			ship.dir += ship.rotSpeed * modifier;
		}
		if (32 in keysDown) { // Player holding space
			if (cooldown <= 0)
			{
				//var audio = new Audio('audio/laser.wav');
				//audio.play();
				bullets.push({
					speed: 400,
					x: ship.x,
					y: ship.y,
					dir: ship.dir,
					travelDist: 0,
					MTD: 500 // max travel distance
				});
				cooldown = .1;
			}
		}
		
		cooldown -=	modifier;

		ship.x += ship.xvel;
		ship.y += ship.yvel;
		
		ship.x = wrap(ship.x, ship.y, 24, 50, 640, 480)[0];
		ship.y = wrap(ship.x, ship.y, 24, 50, 640, 480)[1];
		
		for (var b in bullets) {
			bullets[b].x -= move(bullets[b].speed * modifier, bullets[b].dir)[0];
			bullets[b].y -= move(bullets[b].speed * modifier, bullets[b].dir)[1];
			bullets[b].travelDist += bullets[b].speed * modifier;
			bullets[b].x = wrap(bullets[b].x, bullets[b].y, 6, 19, 640, 480)[0];
			bullets[b].y = wrap(bullets[b].x, bullets[b].y, 6, 19, 640, 480)[1];
			if (bullets[b].travelDist >= bullets[b].MTD) {
				bullets.splice(b, 1); // remove element at index b
			}
			
		}
		
		for (var ast in asteroids)	{
			asteroids[ast].x -= move(asteroids[ast].speed * modifier, asteroids[ast].trueDir)[0];
			asteroids[ast].y -= move(asteroids[ast].speed * modifier, asteroids[ast].trueDir)[1];
			asteroids[ast].x = wrap(asteroids[ast].x, asteroids[ast].y, 28, 28, 640, 480)[0];
			asteroids[ast].y = wrap(asteroids[ast].x, asteroids[ast].y, 28, 28, 640, 480)[1];
			asteroids[ast].dir += 10 * modifier;
		}
	};
	
	// Draw everything
	var render = function () {
		if (bgReady) {
			ctx.drawImage(bgImage, 0, 0);
		}
				
		if (bulletReady) {
			for (var b in bullets) {
				drawRotatedImage(bulletImage, bullets[b].x, bullets[b].y, bullets[b].dir, ctx);
			}
		}

		if (shipReady) {
			drawRotatedImage(ship.thrust ? shipTImage : shipImage, ship.x, ship.y, ship.dir, ctx);
		}

		if (asteroidReady) {
			for (var ast in asteroids) {
				drawRotatedImageScaled(asteroidImage, asteroids[ast].x, asteroids[ast].y, asteroids[ast].dir, ctx, 28 * asteroids[ast].scale, 28 * asteroids[ast].scale);
			}
		}
		
		

		// Score
		//ctx.fillStyle = "rgb(250, 250, 250)";
		//ctx.font = "24px Helvetica";
		//ctx.textAlign = "left";
		//ctx.textBaseline = "top";
		//ctx.fillText("Score: " , 32, 32); // TO DO
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
	console.log("2");
	// Start :D
	var then = Date.now();
	reset();
	main();
	
	$('#game').append("<br><input type=button value=Back class=back-button onclick='quit()'>");
}

var quit = function() {
	moveLock=false;
	showMap();
	$('.back-button').remove();
	$('canvas').remove();
}

var move = function(dist, degs){
	// returns x dist, y dist
	return [-Math.sin(degs * TO_RADIANS) * dist, Math.cos(degs * TO_RADIANS) * dist];
}

var hideMap = function() {
	$('#map').hide();
}

var showMap = function() {
	$('#map').show();
}

var drawRotatedImage = function(image, x, y, angle, context) { 
	// save the current co-ordinate system 
	context.save(); 
 
	// move to the middle of where we want to draw our image
	context.translate(x, y);
 
	// rotate around that point, converting our 
	// angle from degrees to radians 
	context.rotate(angle * TO_RADIANS);
 
	// draw it up and to the left by half the width
	// and height of the image 
	context.drawImage(image, -(image.width/2), -(image.height/2));
 
	// and restore the co-ords to how they were when we began
	context.restore(); 
}

var drawRotatedImageScaled = function(image, x, y, angle, context, scaleW, scaleH) { 
	// save the current co-ordinate system 
	context.save(); 
 
	// move to the middle of where we want to draw our image
	context.translate(x, y);
 
	// rotate around that point, converting our 
	// angle from degrees to radians 
	context.rotate(angle * TO_RADIANS);
 
	// draw it up and to the left by half the width
	// and height of the image 
	context.drawImage(image, -(image.width/2), -(image.height/2), scaleW, scaleH);
 
	// and restore the co-ords to how they were when we began
	context.restore(); 
}

var wrap = function (x, y, width, height, bound_x, bound_y) {
	if (x - width / 2.0 > bound_x) {
		x = (x - width / 2.0)%bound_x;
	}
	while (x + width / 2.0 < 0) {
		x += bound_x;
	}
	
	if (y + height / 2.0 > bound_y) {
		y = (y + height / 2.0)%bound_y;
	}
	while (y + height / 2.0 < 0) {
		y += bound_y;
	}
	return [x, y]
}

var TO_RADIANS = Math.PI/180; 

var distance = function (x1, x2, y1, y2) {
	return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

var updateScore = function() {
	document.getElementById("score").innerHTML = score;
}	