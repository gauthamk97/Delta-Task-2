var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var platformHeight, cWidth = window.innerWidth, cHeight = window.innerWidth/2, cloudXPositions, cloudYPositions, obstaclesXPositions, playerWidth, playerHeight, playerYPos=0, raf, trooperHeight;

var yVel=0;
var grav=0.001;

cloudXPositions = [cWidth*2.2, cWidth*0.4, cWidth*0.65, cWidth*0.95];
cloudYPositions = [cHeight*0.3, cHeight*0.1, cHeight*0.2, cHeight*0.15];
obstaclesXPositions = [cWidth*1.15, cWidth*1.65];

var cloudLeftMove = [0,0,0,0];
var obstaclesLeftMove = [0,0,0];

var isCurrentlyPaused = false;

//Blaster firing variables
var randVal, shouldFireBlaster = [false, false], checkedIfCanFire = [false, false], didObstacleShoot = [false,false], firedHowLongAgo = [0,0];
var blasterXPositions = [0,0], blasterLeftMove = [0,0], blasterYPosition = 0, blasterWidth, blasterHeight, blasterDeflected = [false,false];
var didCloudFire=false, cloudBlasterYPosition = 0, cloudBlasterXPosition = 0, cloudBlasterLeftMove = 0, cloudBlasterWidth, cloudBlasterHeight, cloudBlasterDeflected=false;

var i = 0;

//Background movement variable
var backgroundLeftMove = 0;
console.log(cWidth);
var score=0;

//Sprites
var framenumber = 0;
var lukeRunning = new Image();
lukeRunning.src = "Assets/lukeRunning.png";
var lukeRunSpritePosition = 0; //Position within the png
var lukeRunSpeed = 4; //Number of frames per which luke runs. Lower is faster.

var lukeJumping = new Image();
lukeJumping.src = "Assets/lukeJumping.png";
var lukeJumpSpritePosition = 0; //Position within the png
var lukeJumpSpeed = 5; //Number of frames per which luke jumps. Lower is faster.

var lukeSwing = new Image();
lukeSwing.src = "Assets/lukeSwing.png";
var lukeSwingSpritePosition = 0; //Position within the png
var lukeSwingSpeed = 5; //Number of frames per which luke swings. Lower is faster.
var swingFrameNumber = 0;

var cloneTrooper = new Image();
cloneTrooper.src = "Assets/cloneTrooper.gif";

var backgroundImage = new Image();
backgroundImage.src = "Assets/background.png";

var boltImage = new Image();
boltImage.src = "Assets/bolt.png";

var shipImage = new Image();
shipImage.src = "Assets/ship.png"

//States
var currentlySwinging = false;
var currentlyJumping = false;

//Event Listener for keyboard presses
window.addEventListener('keydown', keyPressed, false);

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
	context.fillText("Score : "+score,cWidth*0.8, cHeight*0.9);

	//Create Clouds
	cloudYPositions = [cHeight*0.25, cHeight*0.1, cHeight*0.2, cHeight*0.15];
	cloudXPositions = [cWidth*8.1, cWidth*0.4, cWidth*0.65, cWidth*0.95];
	obstaclesXPositions = [cWidth*1.15, cWidth*1.65];

	//Cloud movement
	for (i=0;i<1;i++) {

		cloudLeftMove[i]+=0.01;
		
		//Wrapping around when reaches end of screen
		if ((cloudXPositions[i]-(cloudLeftMove[i]*cWidth)) < (-cWidth*0.2)) {
			//Element of randomness to when ship appears next
			cloudLeftMove[i] = Math.random()*500*0.01;
			didCloudFire=false;
			cloudBlasterDeflected = false;
		}

		if ((cloudXPositions[i]-(cloudLeftMove[i]*cWidth))/cWidth <= 0.6 && (didCloudFire==false)) {
			didCloudFire=true;
			cloudBlasterYPosition = cloudYPositions[i] + cWidth*0.15*33/112;
			cloudBlasterXPosition = cloudXPositions[i]-(cloudLeftMove[i]*cWidth);
			
			cloudBlasterLeftMove = 0;
		}

		if (didCloudFire) {
			cloudBlasterWidth = cWidth*0.012;
			cloudBlasterHeight = cloudBlasterWidth*200/455;

			if (cloudBlasterDeflected) {
				cloudBlasterLeftMove -= 0.01;
			}

			else {
				cloudBlasterLeftMove += 0.01;
			}

			context.save();
			context.translate(cloudBlasterXPosition-(cloudBlasterLeftMove*cWidth),cloudBlasterYPosition);
			context.rotate(-0.6);
			context.drawImage(boltImage,0,0,455,40,-(cloudBlasterLeftMove*cWidth),0,cloudBlasterWidth,cloudBlasterHeight);
			
			if (cloudBlasterLeftMove>=0.27 && cloudBlasterLeftMove<=0.28) {
				console.log(cloudBlasterLeftMove);
			}
			context.restore();

		}

		context.drawImage(shipImage,0,0,112,44,cloudXPositions[i]-(cloudLeftMove[i]*cWidth),cloudYPositions[i],cWidth*0.15, cWidth*0.15*44/112);
	}

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

animate();

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
	if (cloudBlasterLeftMove>=0.27 && cloudBlasterLeftMove<=0.28 && !cloudBlasterDeflected) {
		if (playerYPos>=0 && playerYPos<trooperHeight*4/5) {
			if (!currentlySwinging) {
				dead();
			}

			else {
				cloudBlasterDeflected = true;
			}
		}
	}

}

function dead() {
	console.log('collision detected');
	window.cancelAnimationFrame(raf);
	window.alert('you dead');
	window.location.reload();
}