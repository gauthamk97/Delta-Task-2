var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var platformHeight, cWidth = window.innerWidth, cHeight = window.innerWidth/2, cloudXPositions, cloudYPositions;

cloudXPositions = [cWidth*0.1, cWidth*0.4, cWidth*0.65, cWidth*0.95];
cloudYPositions = [cHeight*0.2, cHeight*0.1, cHeight*0.3, cHeight*0.15];

var i = 0;

function animate() {

	requestAnimationFrame(animate);

	//Resizes canvas on changing browser size
	canvas.width = window.innerWidth;
	canvas.height = canvas.width/2;

	//Canvas Dimensions
	cWidth = canvas.width;
	cHeight = canvas.height;
	
	if (window.innerHeight >= canvas.height) {
		canvas.style.marginTop=(window.innerHeight-canvas.height)/2 + "px"; //Centers canvas vertically	if browser is larger than canvas
	}
	else {
		canvas.style.marginTop=0; //Canvas starts at (0,0) if browser becomes smaller than canvas
	}
	
	//Clears canvas
	context.clearRect(0,0,canvas.width,canvas.height);

	//Creates Platform
	context.fillStyle = 'green';
	platformHeight = canvas.height*0.35;
	context.fillRect(0,canvas.height-platformHeight,canvas.width,platformHeight);

	//Create Clouds
	context.fillStyle = 'white';

	for (i=0;i<4;i++) {
		cloudXPositions[i]-=cWidth*0.005;
		
		if (cloudXPositions[i] < (-cWidth*0.14)) {
			cloudXPositions[i] = cWidth;
		}

		context.fillRect(cloudXPositions[i],cloudYPositions[i],canvas.width*0.15, canvas.width*0.07);
	}
}

animate();