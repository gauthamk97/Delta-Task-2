//Canvas Variables
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var platformHeight, cWidth, cHeight;

//Request Animation Frame variable
var raf

//Ship and Obstacle Variables
var shipXPositions, shipYPositions, shipLeftMove, obstaclesLeftMove, obstaclesXPositions, trooperHeight;

//Player variables
var playerWidth, playerHeight;

//Jump related variables
var yVel, playerYPos, grav;

//Whether paused or not
var isCurrentlyPaused;

//Obstacle Blaster firing variables
var randVal, shouldFireBlaster, checkedIfCanFire, didObstacleShoot, firedHowLongAgo;
var blasterXPositions, blasterLeftMove, blasterYPosition, blasterWidth, blasterHeight, blasterDeflected;

//Ship Blaster firing variables
var didShipFire, shipBlasterYPosition, shipBlasterXPosition, shipBlasterLeftMove, shipBlasterWidth, shipBlasterHeight, shipBlasterDeflected;

//Iterating variable
var i;

//Background movement variable
var backgroundLeftMove;

//Keeping track of score
var score;

//Sprites
var framenumber;
var lukeRunning = new Image();
lukeRunning.src = "Assets/lukeRunning.png";
var lukeRunSpritePosition; //Position within the png
var lukeRunSpeed; //Number of frames per which luke runs. Lower is faster.

var lukeJumping = new Image();
lukeJumping.src = "Assets/lukeJumping.png";
var lukeJumpSpritePosition; //Position within the png
var lukeJumpSpeed; //Number of frames per which luke jumps. Lower is faster.

var lukeSwing = new Image();
lukeSwing.src = "Assets/lukeSwing.png";
var lukeSwingSpritePosition; //Position within the png
var lukeSwingSpeed; //Number of frames per which luke swings. Lower is faster.
var swingFrameNumber;

var cloneTrooper = new Image();
cloneTrooper.src = "Assets/cloneTrooper.gif";

var backgroundImage = new Image();
backgroundImage.src = "Assets/background.png";

var boltImage = new Image();
boltImage.src = "Assets/bolt.png";

var shipImage = new Image();
shipImage.src = "Assets/ship.png";

var logo = new Image();
logo.src = "Assets/starWarsLogo.png";

var wtf=0;
//States
var currentlySwinging, currentlyJumping;

//Event Listener for keyboard presses
window.addEventListener('keydown', keyPressedAtHomeScreen, false);

drawNecessities();

function drawNecessities() {

	draf = window.requestAnimationFrame(drawNecessities);

	//Resizes canvas on changing browser size
	canvas.width = window.innerWidth;
	canvas.height = canvas.width/2;

	//Canvas Dimensions
	cWidth = canvas.width;
	cHeight = canvas.height;
	
	if (window.innerHeight >= cHeight) {
		canvas.style.marginTop=(window.innerHeight-cHeight)/2 + "px"; //Centers canvas vertically	if browser is larger than canvas
	}
	else {
		canvas.style.marginTop=0; //Canvas starts at (0,0) if browser becomes smaller than canvas
	}
	
	//Clears canvas
	context.clearRect(0,0,cWidth,cHeight);

	//Creates background image
	context.drawImage(backgroundImage,0,0,1280,1280*cHeight/cWidth,0,0,cWidth,cHeight);

	//Draw Luke
	playerWidth = cWidth*0.05;
	playerHeight = playerWidth*43/24;
	context.drawImage(lukeRunning,0,0,24,43,playerWidth,cHeight-platformHeight-playerHeight, playerWidth, playerHeight);

	//Creates Platform
	context.fillStyle = '#222222';
	platformHeight = cHeight*0.24;
	context.fillRect(0,cHeight-platformHeight,cWidth,platformHeight);

	//Draw Star Wars Logo
	context.drawImage(logo,0,0,300,132,cWidth*0.35,cHeight*0.1,cWidth*0.3,cWidth*0.3*132/300);

	wtf++;

	var fontSize=10/749*cWidth;
	context.fillStyle = '#FFFFFF';
	context.textAlign = "center";

	context.font = fontSize+"px Verdana";
	context.fillText("Press space button to begin",cWidth/2, cHeight/2);

}

function keyPressedAtHomeScreen(e) {
	if (e.keyCode==32) { //Begin game 
		initialAssignments();
		animate();
		window.removeEventListener('keydown', keyPressedAtHomeScreen);
		window.addEventListener('keydown', keyPressed, false);
		window.cancelAnimationFrame(draf);
	}
}

function initialAssignments() {

	//Canvas variables
	cWidth = window.innerWidth;
	cHeight = window.innerWidth/2;

	//Jumping related variables
	playerYPos=0;
	yVel=0;
	grav=0.001;

	//Ship Position
	shipXPositions = cWidth*8.1
	shipYPositions = cHeight*0.25
	shipLeftMove = 0;

	//Obstacles Position
	obstaclesXPositions = [cWidth*1.15, cWidth*1.65];
	obstaclesLeftMove = [0,0];

	//Whether paused or not
	isCurrentlyPaused = false;

	//Blaster bolts coming from obstacles
	shouldFireBlaster = [false, false];
	checkedIfCanFire = [false, false];
	didObstacleShoot = [false,false];
	firedHowLongAgo = [0,0];
	blasterXPositions = [0,0];
	blasterLeftMove = [0,0];
	blasterYPosition = 0;
	blasterDeflected = [false,false];

	//Blaster bolts coming from ship
	didShipFire=false;
	shipBlasterYPosition = 0;
	shipBlasterXPosition = 0;
	shipBlasterLeftMove = 0;
	shipBlasterDeflected=false;

	//Iterating variable
	i = 0;

	backgroundLeftMove = 0;
	score=0;

	framenumber = 0;
	lukeRunSpritePosition = 0;
	lukeRunSpeed = 4;
	lukeJumpSpritePosition = 0;
	lukeJumpSpeed = 5;
	lukeSwingSpritePosition = 0;
	lukeSwingSpeed = 5;
	swingFrameNumber = 0;

	//States
	currentlySwinging = false;
	currentlyJumping = false;
}

function animate() {

	raf = window.requestAnimationFrame(animate);

	//Resizes canvas on changing browser size
	canvas.width = window.innerWidth;
	canvas.height = canvas.width/2;

	//Canvas Dimensions
	cWidth = canvas.width;
	cHeight = canvas.height;
	
	if (window.innerHeight >= cHeight) {
		canvas.style.marginTop=(window.innerHeight-cHeight)/2 + "px"; //Centers canvas vertically	if browser is larger than canvas
	}
	else {
		canvas.style.marginTop=0; //Canvas starts at (0,0) if browser becomes smaller than canvas
	}
	
	//Clears canvas
	context.clearRect(0,0,cWidth,cHeight);

	//Creates background image
	context.drawImage(backgroundImage,0,0,1280,1280*cHeight/cWidth,-(backgroundLeftMove*cWidth),0,cWidth,cHeight);
	context.drawImage(backgroundImage,0,0,1280,1280*cHeight/cWidth,cWidth*(1-backgroundLeftMove),0,cWidth,cHeight);
	backgroundLeftMove+=0.001;

	if (backgroundLeftMove>=1) {
		backgroundLeftMove=0;
	}

	//Creates Platform
	context.fillStyle = '#222222';
	platformHeight = cHeight*0.24;
	context.fillRect(0,cHeight-platformHeight,cWidth,platformHeight);

	//Score Counter
	var fontSize=20/749*cWidth;
	context.fillStyle = '#FFFFFF';
	context.font = fontSize+"px Verdana";
	context.fillText("Score : "+score,cWidth*0.05, cHeight*0.1);

	//Create Ships
	shipYPositions = cHeight*0.25
	shipXPositions = cWidth*8.1
	obstaclesXPositions = [cWidth*1.15, cWidth*1.65];

	//Ship movement
	shipLeftMove+=0.01;
	
	//Wrapping around when reaches end of screen
	if ((shipXPositions-(shipLeftMove*cWidth)) < (-cWidth*0.2)) {
		//Element of randomness to when ship appears next
		shipLeftMove = Math.random()*500*0.01;
		didShipFire=false;
		shipBlasterDeflected = false;
	}

	if ((shipXPositions-(shipLeftMove*cWidth))/cWidth <= 0.6 && (didShipFire==false)) {
		didShipFire=true;
		shipBlasterYPosition = shipYPositions + cWidth*0.15*33/112;
		shipBlasterXPosition = shipXPositions-(shipLeftMove*cWidth);
		
		shipBlasterLeftMove = 0;
	}

	if (didShipFire) {
		shipBlasterWidth = cWidth*0.012;
		shipBlasterHeight = shipBlasterWidth*200/455;

		if (shipBlasterDeflected) {
			shipBlasterLeftMove -= 0.01;
		}

		else {
			shipBlasterLeftMove += 0.01;
		}

		context.save();
		context.translate(shipBlasterXPosition-(shipBlasterLeftMove*cWidth),shipBlasterYPosition);
		context.rotate(-0.6);
		context.drawImage(boltImage,0,0,455,40,-(shipBlasterLeftMove*cWidth),0,shipBlasterWidth,shipBlasterHeight);
		context.restore();

	}

	context.drawImage(shipImage,0,0,112,44,shipXPositions-(shipLeftMove*cWidth),shipYPositions,cWidth*0.15, cWidth*0.15*44/112);
	

	//Obstactles movement
	for (i=0;i<2;i++) {

		obstaclesLeftMove[i]+=0.005;

		//Checking if we can fire blaster
		if ((obstaclesXPositions[i]-(obstaclesLeftMove[i]*cWidth))/cWidth <= 0.5 && (checkedIfCanFire[i]==false)) {
			
			checkedIfCanFire[i] = true;

			if (!didObstacleShoot[i]) {
				
				randVal = Math.floor(Math.random()*5);
				
				//Fire blaster
				if (randVal==0||randVal==1) {
				
					didObstacleShoot[i] = true;
					shouldFireBlaster[i] = true;
					firedHowLongAgo[i] = 0;

					//Initializing blaster positions
					blasterXPositions[i] = obstaclesXPositions[i]-(obstaclesLeftMove[i]*cWidth);
					blasterLeftMove[i] = 0;
				}
			}
		}

		//Wrapping around when reaches end of screen
		if ((obstaclesXPositions[i]-(obstaclesLeftMove[i]*cWidth)) < (-cWidth*0.05)) {
			obstaclesLeftMove[i] = (obstaclesXPositions[i]-cWidth)/cWidth;
			didObstacleShoot[i] = false;
			checkedIfCanFire[i] = false;
			blasterXPositions[i]=0;
			blasterDeflected[i] = false;
			score++;
		}

		if (shouldFireBlaster[i]) {

			//Reset to normal sprite
			if (firedHowLongAgo[i] >= 10) {
				shouldFireBlaster[i] = false;
				firedHowLongAgo[i]=0;
			}

			//Recoil sprite
			else if (firedHowLongAgo[i]>=8 && firedHowLongAgo[i]<10) {
				trooperWidth = cWidth*0.05*36/43
				trooperHeight = trooperWidth*53/36
				context.drawImage(cloneTrooper,43,0,36,53,obstaclesXPositions[i]-(obstaclesLeftMove[i]*cWidth), cHeight-platformHeight-(trooperHeight), trooperWidth, trooperHeight);
			}

			//Firing sprite
			else {
				trooperWidth = cWidth*0.05*46/43
				trooperHeight = trooperWidth*53/46;
				context.drawImage(cloneTrooper,86,0,46,53,obstaclesXPositions[i]-(obstaclesLeftMove[i]*cWidth), cHeight-platformHeight-(trooperHeight), trooperWidth, trooperHeight);
			}

			firedHowLongAgo[i]++;

		}

		//Normal sprite
		else {
			trooperWidth = cWidth*0.05
			trooperHeight = trooperWidth*53/43;
			context.drawImage(cloneTrooper,0,0,36,53,obstaclesXPositions[i]-(obstaclesLeftMove[i]*cWidth), cHeight-platformHeight-(trooperHeight), trooperWidth, trooperHeight);	
		}

		//Drawing blaster if fired

		if (didObstacleShoot[i]) {

			blasterWidth = cWidth*0.007;
			blasterHeight = blasterWidth*200/455;

			if (!blasterDeflected[i]) {
				blasterLeftMove[i]+=0.01
				blasterYPosition = cHeight-platformHeight-(36*trooperHeight/53);
				context.drawImage(boltImage,0,0,455,40,blasterXPositions[i]-(blasterLeftMove[i]*cWidth),blasterYPosition,blasterWidth,blasterHeight);
			}

			else {
				blasterLeftMove[i]-=0.01
				context.drawImage(boltImage,0,0,455,40,blasterXPositions[i]-(blasterLeftMove[i]*cWidth),blasterYPosition,blasterWidth,blasterHeight);
			}
			
		}
		
	}

	//Create Player
	playerWidth = cWidth*0.05;
	swingFrameNumber++;
	framenumber++;

	//Currently Jumping
	if (playerYPos>0) {

		playerHeight = playerWidth*54/35;

		yVel -= grav;
		playerYPos += (yVel*cHeight);
		if (playerYPos < 0) {
			playerYPos = 0;
		}
		currentlyJumping = true;

		if (currentlySwinging) {

			playerHeight = playerWidth*43/24;

			context.drawImage(lukeSwing,lukeSwingSpritePosition,0,34,34,playerWidth,cHeight-platformHeight-playerHeight-playerYPos, playerWidth, playerHeight);

			if (swingFrameNumber%lukeSwingSpeed == 0) {
				lukeSwingSpritePosition += (153/4);
				if (lukeSwingSpritePosition >= 153) {
					lukeSwingSpritePosition=0;
					currentlySwinging = false
				}	
				framenumber = 0;
			}
		}

		else {
			context.drawImage(lukeJumping,lukeJumpSpritePosition,0,35,54,playerWidth,cHeight-platformHeight-playerHeight-playerYPos, playerWidth, playerHeight);

			if (framenumber%lukeJumpSpeed == 0) {
				lukeJumpSpritePosition += (299/7);
				if (lukeJumpSpritePosition >= 334) {
					lukeJumpSpritePosition = 0;
				}	
				framenumber = 0;
			}
		}
		
	}

	//Not jumping
	else {

		if (currentlySwinging) {

			playerHeight = playerWidth*43/24;

			context.drawImage(lukeSwing,lukeSwingSpritePosition,0,34,34,playerWidth,cHeight-platformHeight-playerHeight-playerYPos, playerWidth, playerHeight);

			if (swingFrameNumber%lukeSwingSpeed == 0) {
				lukeSwingSpritePosition += (153/4);
				if (lukeSwingSpritePosition >= 153) {
					lukeSwingSpritePosition=0;
					currentlySwinging = false
				}	
				framenumber = 0;
			}
		}

		else {

			playerHeight = playerWidth*43/24;

			yVel = 0;
			currentlyJumping = false;
			context.drawImage(lukeRunning,lukeRunSpritePosition,0,24,43,playerWidth,cHeight-platformHeight-playerHeight-playerYPos, playerWidth, playerHeight);

			if (framenumber%lukeRunSpeed == 0) {
				lukeRunSpritePosition += (221/7);
				if (lukeRunSpritePosition >= 245) {
					lukeRunSpritePosition = 0;
				}	
				framenumber = 0;
			}
		}
		
	}

	checkCollision();
}

function keyPressed(e) {

	if (isCurrentlyPaused) {
		isCurrentlyPaused=false;
		animate();
		return;
	}

	if (e.keyCode==32 && !currentlyJumping) { //Space Bar was pressed
		yVel = 0.02;
		cHeight = window.innerWidth/2;
		playerYPos += (yVel*cHeight);
		currentlySwinging = false;
	}

	else if (e.keyCode==77 && !currentlySwinging) {
		currentlySwinging = true;
		swingFrameNumber = 1;
		lukeSwingSpritePosition=0;
	}

	else if (e.keyCode==80) {

		var fontSize=10/749*cWidth;
		context.fillStyle = '#FFFFFF';
		context.textAlign = "center";

		context.font = fontSize+"px Verdana";
		context.fillText("Press any button to continue",cWidth/2, cHeight*0.53);

		fontSize=15/749*cWidth;
		context.font = fontSize+"px Verdana";
		context.fillText("Paused",cWidth/2, cHeight*0.47);

		window.cancelAnimationFrame(raf);
		isCurrentlyPaused=true;
	}

	else {
		console.log(e.keyCode);
	}
}

function checkCollision() {

	//Obstacle collision check
	for (i=0;i<2;i++) {
		if (((obstaclesXPositions[i]-(obstaclesLeftMove[i]*cWidth)) < 2*playerWidth) && ((obstaclesXPositions[i]-(obstaclesLeftMove[i]*cWidth)) > playerWidth) && (playerYPos<trooperHeight)) {
			dead();
		}
	}

	//Blaster collision check
	for (i=0;i<2;i++) {
		if (didObstacleShoot[i]) {
			if ((blasterXPositions[i]-(blasterLeftMove[i]*cWidth)+blasterWidth/2) < 2*playerWidth && (blasterXPositions[i]-(blasterLeftMove[i]*cWidth)+blasterWidth/2) > playerWidth && playerYPos<(cHeight-platformHeight-blasterYPosition)) {
				
				if (!currentlySwinging && !blasterDeflected[i]) {
					dead();
				}
				
				else {
					blasterDeflected[i] = true;
				}

			}
		}
	}

	//Ship blaster collision check
	if (shipBlasterLeftMove>=0.27 && shipBlasterLeftMove<=0.28 && !shipBlasterDeflected) {
		if (playerYPos>=0 && playerYPos<trooperHeight*4/5) {
			if (!currentlySwinging) {
				dead();
			}

			else {
				shipBlasterDeflected = true;
			}
		}
	}

}

function dead() {
	console.log('collision detected');
	window.cancelAnimationFrame(raf);

	//Event listeners
	window.removeEventListener('keydown', keyPressed, false);
	window.addEventListener('keydown', keyPressedAtHomeScreen);

	//Text on dying
	context.fillStyle = '#FFFFFF';
	context.textAlign = "center";

	var fontSize=15/749*cWidth;
	context.font = fontSize+"px Verdana";
	context.fillText("You Died",cWidth/2, cHeight*0.47);

	fontSize=10/749*cWidth;
	context.font = fontSize+"px Verdana";
	context.fillText("Press space to save the galaxy",cWidth/2, cHeight*0.53);

}