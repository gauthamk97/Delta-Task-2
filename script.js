var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var platformHeight, cWidth = window.innerWidth, cHeight = window.innerWidth/2, cloudXPositions, cloudYPositions, obstaclesXPositions, playerWidth, playerHeight, playerYPos=0;

var yVel=0;
var grav=0.6;

cloudXPositions = [cWidth*0.1, cWidth*0.4, cWidth*0.65, cWidth*0.95];
cloudYPositions = [cHeight*0.2, cHeight*0.1, cHeight*0.3, cHeight*0.15];
obstaclesXPositions = [cWidth*0.15, cWidth*0.5, cWidth*0.85];

var cloudLeftMove = [0,0,0,0];
var obstaclesLeftMove = [0,0,0];

var i = 0;

function animate() {

	requestAnimationFrame(animate);

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
	obstaclesXPositions = [cWidth*0.15, cWidth*0.5, cWidth*0.85];

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
	context.fillStyle = 'red';
	playerWidth = cWidth*0.05;
	playerHeight = playerWidth;

	if (playerYPos>0) {
		yVel -= grav;
		playerYPos += yVel;
		document.body.onkeypress = null;
	}

	else {
		yVel = 0;
		playerYPos = 0;
		document.body.onkeypress = function(e) {

			if (e.keyCode==32) { //Space Bar was pressed
				yVel = 10;
				playerYPos += yVel;
			}
		}
	}

	context.fillRect(40,cHeight-platformHeight-playerHeight-playerYPos, playerWidth, playerHeight);
}

animate();

document.body.onkeypress = function(e) {

	if (e.keyCode==32) { //Space Bar was pressed
		yVel = 10;
		playerYPos += yVel;
	}
}