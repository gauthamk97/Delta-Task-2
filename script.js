var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var platformHeight, cWidth = window.innerWidth, cHeight = window.innerWidth/2, cloudXPositions, cloudYPositions, obstaclesXPositions, playerWidth, playerHeight, playerYPos=0, raf;

var yVel=0;
var grav=0.001;

cloudXPositions = [cWidth*0.1, cWidth*0.4, cWidth*0.65, cWidth*0.95];
cloudYPositions = [cHeight*0.2, cHeight*0.1, cHeight*0.3, cHeight*0.15];
obstaclesXPositions = [cWidth*1.15, cWidth*1.5, cWidth*1.85];

var cloudLeftMove = [0,0,0,0];
var obstaclesLeftMove = [0,0,0];

var i = 0;

//Sprites
var framenumber = 0;
var lukeRunning = new Image();
lukeRunning.src = "Assets/lukeRunning.png";
var lukeRunSpritePosition = 0; //Position within the png
var lukeRunSpeed = 5; //Number of frames per which luke runs. Lower is faster.

var lukeJumping = new Image();
lukeJumping.src = "Assets/lukeJumping.png";
var lukeJumpSpritePosition = 0; //Position within the png
var lukeJumpSpeed = 5; //Number of frames per which luke jumps. Lower is faster.

var lukeAttack = new Image();
lukeAttack.src = "Assets/lukeAttack.png";
var lukeAttackSpritePosition = 0; //Position within the png
var lukeAttackSpeed = 5; //Number of frames per which luke attacks. Lower is faster.
var attackFrameNumber = 0;

//States
var currentlyAttacking = false;
var currentlyJumping = false;

//Event Listener for space bar
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

	//Creates Platform
	context.fillStyle = 'green';
	platformHeight = cHeight*0.35;
	context.fillRect(0,cHeight-platformHeight,cWidth,platformHeight);

	//Create Clouds
	context.fillStyle = 'white';
	cloudYPositions = [cHeight*0.2, cHeight*0.1, cHeight*0.3, cHeight*0.15];
	cloudXPositions = [cWidth*0.1, cWidth*0.4, cWidth*0.65, cWidth*0.95];
	obstaclesXPositions = [cWidth*1.15, cWidth*1.5, cWidth*1.85];

	for (i=0;i<4;i++) {

		//Cloud movement
		cloudLeftMove[i]+=0.002;
		
		if ((cloudXPositions[i]-(cloudLeftMove[i]*cWidth)) < (-cWidth*0.1)) {
			cloudLeftMove[i] = (cloudXPositions[i]-cWidth)/cWidth;
		}

		context.fillStyle = 'white';
		context.fillRect(cloudXPositions[i]-(cloudLeftMove[i]*cWidth),cloudYPositions[i],cWidth*0.1, cWidth*0.05);

		//Obstactles movement
		obstaclesLeftMove[i]+=0.005;

		if ((obstaclesXPositions[i]-(obstaclesLeftMove[i]*cWidth)) < (-cWidth*0.01)) {
			obstaclesLeftMove[i] = (obstaclesXPositions[i]-cWidth)/cWidth;
		}

		context.fillStyle = 'blue';
		context.fillRect(obstaclesXPositions[i]-(obstaclesLeftMove[i]*cWidth), cHeight-platformHeight-(cWidth*0.03), cWidth*0.01, cWidth*0.03);
	}

	//Create Player
	playerWidth = cWidth*0.05;
	attackFrameNumber++;
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

		if (currentlyAttacking) {

			playerHeight = playerWidth*43/24;

			context.drawImage(lukeAttack,lukeAttackSpritePosition,0,34,34,playerWidth,cHeight-platformHeight-playerHeight-playerYPos, playerWidth, playerHeight);

			if (attackFrameNumber%lukeAttackSpeed == 0) {
				lukeAttackSpritePosition += (153/4);
				if (lukeAttackSpritePosition >= 153) {
					lukeAttackSpritePosition=0;
					currentlyAttacking = false
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

		if (currentlyAttacking) {

			playerHeight = playerWidth*43/24;

			context.drawImage(lukeAttack,lukeAttackSpritePosition,0,34,34,playerWidth,cHeight-platformHeight-playerHeight-playerYPos, playerWidth, playerHeight);

			if (attackFrameNumber%lukeAttackSpeed == 0) {
				lukeAttackSpritePosition += (153/4);
				if (lukeAttackSpritePosition >= 153) {
					lukeAttackSpritePosition=0;
					currentlyAttacking = false
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
	if (e.keyCode==32 && !currentlyJumping) { //Space Bar was pressed
		yVel = 0.018;
		cHeight = window.innerWidth/2;
		playerYPos += (yVel*cHeight);
		currentlyAttacking = false;
	}

	else if (e.keyCode==78 && !currentlyAttacking) {
		currentlyAttacking = true;
		attackFrameNumber = 1;
		lukeAttackSpritePosition=0;
	}

	else {
		console.log(e.keyCode);
	}
}

function checkCollision() {

	for (i=0;i<3;i++) {
		if (((obstaclesXPositions[i]-(obstaclesLeftMove[i]*cWidth)) < 2*playerWidth) && ((obstaclesXPositions[i]-(obstaclesLeftMove[i]*cWidth)) > playerWidth) && (playerYPos<cWidth*0.03)) {
			console.log('collision detected');
			window.cancelAnimationFrame(raf);
			window.alert('you dead');
			window.location.reload();
		}
	}
}