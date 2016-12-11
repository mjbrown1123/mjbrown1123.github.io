//stores the webcam video
var capture;

//set the dimensions for the glasses
var glassesWidth = 125;
var glassesHeight = 100;

//instead of analyzing each adjacent pixel, you can analyze more spaced out pixels to increase frame rate
var spaceBetweenPixels = 4;

//array that stores pixel values
var pixRGBA;  
var RGBA;

//various variables for pixel comparisons
var a;
var stop;
var pixelArray;
var pix;
var maximum = 0;
var contrasting;
var contrastLimit = 200;
var endXR = 0;
var endXG = 0;
var endXB = 0;
var endXA = 0;
var endYR = 0;
var endYG = 0;
var endYB = 0;
var endYA = 0;
var totalX = 0;
var totalY = 0;
var numPoints = 0;
var analyzePicTest = 0;
var contrastImage;
var contrastArray;
var clickIndex = 0;
var totalContrast;

//stores the glasses image
var glasses;

//stores the kingcake image
var kingcake;

//stores the rainbow image
var rainbow;

//stores variables for the random box  
var randomBoxX = 330;
var randomBoxY = 250;
var randomBoxW = 100;
var randomBoxH = 50;

//index that chooses the random filter: starts at -1 so the filter is randomly chosen at the beg
var randomFilterIndex = -1;
var filterArray; //= ["Disguise", "Rainbow", "Kingcake"];
var filterObjects;
var imgPaths;// = ["glasses.png", "rainbow.png", "kingcake_4.png"];
var widthOffset;// = [62.5, 10, 70];
var heightOffset;// = [50,-50,50];
var imgWidth;// = [125, 20, 100];
var imgHeight;// = [100, 80, 100];

//includes the nuber of filters
var numFilters;// = //filterArray.length;
var numImgFilters;// = imgPaths.length;
var prevFilterIndex = 0;
var contrastingAr = [];

function setup() {
 // delay  
 // var imgs = [glasses, rainbow, kingcake];
 filterObjects = [0,0,0];

//various properties for each image filter
filterArray = ["Disguise", "Rainbow", "Kingcake"];
imgPaths = ["glasses.png", "rainbow.png", "kingcake_4.png"];
widthOffset = [62.5, 80, 160];
heightOffset = [50,-40,200];
imgWidth = [125, 160, 320];
imgHeight = [100, 80, 400];
numImgFilters  = imgPaths.length;
numFilters = 4;

  //load the images for the filters and store in an array
  for(var i = 0; i < numImgFilters; i++) {

    //create a filter object for each image
    filterObjects[i] = new ImageFilter(filterArray[i], i,imgPaths[i], imgWidth[i], imgHeight[i], widthOffset[i], heightOffset[i]);


  }

  //create a canvas
  createCanvas(600, 600);

  //initialize webcame video
  capture = createCapture(VIDEO);

  //debugging video dimensions
  console.log(capture.width);
  console.log(capture.height);
  console.log(pixelDensity());

  //set size of webcam video
  capture.size(320, 240);

  //hide the original webcam video
  capture.hide();

  //get a random filter at the beginning 
  randomFilterIndex = randomInteger(0, numFilters);
}

function draw() {

  //refresh the background each frame
  background(255);

  //fill the random box
  fill(255, 0, 0);
  rect(randomBoxX, randomBoxY, randomBoxW, randomBoxH);

  //insert text into random box
  fill(0, 255, 0);
  textSize(20);
  text("New Filter!", randomBoxX, randomBoxY, randomBoxX + randomBoxW, randomBoxY + randomBoxH);

  //if the filter index is greater than zero, the filter is an image
  if(randomFilterIndex > 0) {

    //offset index by one to correspond with image indices
    imageOverlay(randomFilterIndex -1);    

  }
  else {
    //if the filter isn't an image, make it matrix mode
    matrixMode();

  }

}

//gets a random integer between the selected values (excluding the upper value)
function randomInteger(a, b) {

  return Math.floor(random(a, b));

}

//filter object constructor
function ImageFilter(nam, ind,img, wid, hei, xOff, yOff) {

  this.name = nam;
  this.imagePath = img;
  this.image = loadImage(img);
  this.index = ind;
  this.width = wid;
  this.height = hei;
  this.xOffset = xOff;
  this.yOffset = yOff;

  
  
}

//for when the mouse is clicked
function mouseClicked() {

  //make sure the mouse is in the box
  if (mouseX > randomBoxX && mouseX < randomBoxX + randomBoxW && mouseY > randomBoxY && mouseY < randomBoxY + randomBoxH) {
    
    //while loop to make sure a new filter is selected, instead of the same filter
    while (prevFilterIndex === randomFilterIndex) {
      randomFilterIndex = randomInteger(0, numFilters);
    }

    //alter the previous index value for next time we compare indices 
    prevFilterIndex = randomFilterIndex;

  }

}

//filter that adds a disguise to the user
function imageOverlay(imgIndex) {

  //get the pixel array of the current frame
  capture.loadPixels();

  //get the pixel density of the image
  var d = pixelDensity();

  //index value for current pixel
  var off;

  //store the pixel array in a new array
  pix = capture.pixels;

  //stores the rgba values of the current pixel
  var startR;
  var startG;
  var startB;
  var startA;

  //stores the number of contrast points
  numPoints = 0;

  //stores the sum of the x and y coordinates of contrast points
  totalX = 0;
  totalY = 0;

  //debug the height, width, and pixel array length of capture
  console.log(capture.height + " " + capture.width + " " + capture.pixels.length);

  //go through each pixel from row to row of capture
  for (var y = 0;y < capture.height; y++) {
    for (var x = 0; x < capture.width; x++) {

      //creates the index for the current pixel in the pixel array
      off = (x * capture.width + y) * d * 4; 

      //makes sure the pixel is in the grid of analyzed pixels
      if (x % spaceBetweenPixels === 0 && y % spaceBetweenPixels === 0) { //x % spaceBetweenPixels === 0 && y % spaceBetweenPixels === 0) {

        //get the rgba values of this pixel
        startR = pix[off];
        startG = pix[off + 1];
        startB = pix[off + 2];
        startA = pix[off + 3];

        //get the rgba values of the pixel spaceBetweenPixels below the current pixel
        if (x < capture.height - spaceBetweenPixels - 1) {
          endXR = pix[off + capture.width * d * 4 * spaceBetweenPixels];
          endXG = pix[off + capture.width * d * 4 * spaceBetweenPixels + 1];
          endXB = pix[off + capture.width * d * 4 * spaceBetweenPixels + 2];
          endXA = pix[off + capture.width * d * 4 * spaceBetweenPixels + 3];
        }

        //get the rgba values of the pixel spaceBetweenPixels to the right of the current pixel
        if (y < capture.width - spaceBetweenPixels - 1) {

          endYR = pix[off + spaceBetweenPixels * 4];
          endYG = pix[off + spaceBetweenPixels * 4 + 1];
          endYB = pix[off + spaceBetweenPixels * 4 + 2];
          endYA = pix[off + spaceBetweenPixels * 4 + 3];

        }

        //create the contrast value for this pixel (the sum of the absolute values of the difference b/w rgba values, respectively)
            //the contrasts between pixels to the left and below are summed
            contrasting = Math.abs(startR - endXR) + Math.abs(startG - endXG) + Math.abs(startB - endXB) + Math.abs(startR - endYR) + Math.abs(startG - endYG) + Math.abs(startB - endYB);

        //if the contrast is greater than zero (contrast exists)
        if (contrasting > 0) {

          //set the green value of that pixel between 0 and the upper limit, contrastLimit            
          capture.pixels[off + 1] = map(contrasting, 0, contrastLimit, 0, 255);

          //add the x and y values to the current total for pixels with contrast
              //each x and y coordinate is divided by 2 b/c the number of pixels reported by capture.width and capture.height
              //is twice as much as the actual used values
              var c = map(contrasting, 0, contrastLimit, 0, 255);
              totalContrast += c;
              totalX += (y / 2);
              
              totalY += x / 2;

          //increase the number of contrast points by one
          numPoints++;

        } else {

          //if a contrast doesn't exist, set the green value of this pixel to zero
          capture.pixels[off + 1] = 0;

        }

        //set the red and blue values to zero (we want just green or black)
        capture.pixels[off + 0] = 0;
        capture.pixels[off + 2] = 0;

        //and make sure the alpha value is at its max
        capture.pixels[off + 3] = 255;
        
        
      //giving errors
      contrastingAr[off / 4] = contrasting;


    } else {

        //if the pixel is not in the grid, set it to black
        capture.pixels[off] = 0;
        capture.pixels[off + 1] = 0;
        capture.pixels[off + 2] = 0;
        capture.pixels[off + 3] = 255;
      }

      
    }
    
   
  }

  //debug the location of the circle and current contrastLimit
  console.log("totalX: " + totalX / numPoints + " totalY: " + totalY / numPoints);
  console.log(contrastLimit);

 /* //update the pixel array for capture; do not do for image overlay!
  capture.updatePixels();*/

  //display the current frame for capture 
  image(capture, 0, 0, 320, 240);

  //set the debug circle to be green
  fill(0, 255, 0);

  //draw a circle at the average x and y coordinates; debug only
  ellipseMode(CENTER);
  ellipse(totalX / numPoints, totalY / numPoints, 30, 30);

  console.log(imgIndex);

  //draw the image on the capture display 
  image(filterObjects[imgIndex].image, totalX / numPoints - filterObjects[imgIndex].xOffset, 
    totalY / numPoints - filterObjects[imgIndex].yOffset, filterObjects[imgIndex].width, filterObjects[imgIndex].height);

}

function matrixMode() {
  //get the pixel array of the current frame
  capture.loadPixels();

  //get the pixel density of the image
  var d = pixelDensity();

  //index value for current pixel
  var off;

  //store the pixel array in a new array
  pix = capture.pixels;

  //stores the rgba values of the current pixel
  var startR;
  var startG;
  var startB;
  var startA;

  //go through each pixel from row to row of capture
  for (var x = 0; x < capture.height; x++) {
    for (var y = 0; y < capture.width; y++) {

      //creates the index for the current pixel in the pixel array
      off = (x * capture.width + y) * d * 4; 

       //makes sure the pixel is in the grid of analyzed pixels
      if (x % spaceBetweenPixels === 0 && y % spaceBetweenPixels === 0) { //x % spaceBetweenPixels === 0 && y % spaceBetweenPixels === 0) {

        //get the rgba values of this pixel
        startR = pix[off];
        startG = pix[off + 1];
        startB = pix[off + 2];
        startA = pix[off + 3];

        //get the rgba values of the pixel spaceBetweenPixels below the current pixel
        if (x < capture.height - spaceBetweenPixels - 1) {
          endXR = pix[off + capture.width * d * 4 * spaceBetweenPixels];
          endXG = pix[off + capture.width * d * 4 * spaceBetweenPixels + 1];
          endXB = pix[off + capture.width * d * 4 * spaceBetweenPixels + 2];
          endXA = pix[off + capture.width * d * 4 * spaceBetweenPixels + 3];
        }

        //get the rgba values of the pixel spaceBetweenPixels to the right of the current pixel
        if (y < capture.width - spaceBetweenPixels - 1) {

          endYR = pix[off + spaceBetweenPixels * 4];
          endYG = pix[off + spaceBetweenPixels * 4 + 1];
          endYB = pix[off + spaceBetweenPixels * 4 + 2];
          endYA = pix[off + spaceBetweenPixels * 4 + 3];

        }

        //create the contrast value for this pixel (the sum of the absolute values of the difference b/w rgba values, respectively)
            //the contrasts between pixels to the left and below are summed
            contrasting = Math.abs(startR - endXR) + Math.abs(startG - endXG) + Math.abs(startB - endXB) + Math.abs(startR - endYR) + Math.abs(startG - endYG) + Math.abs(startB - endYB);


        //set the green value of that pixel between 0 and the upper limit, contrastLimit         
        capture.pixels[off + 1] = map(contrasting, 0, contrastLimit, 0, 255);
        capture.pixels[off + 0] = 0;
        capture.pixels[off + 2] = 0;
        capture.pixels[off + 3] = 255;

      } else {

        //if the pixel doesn't experience contrast, set the pixel color to black
        capture.pixels[off] = 0;
        capture.pixels[off + 1] = 0;
        capture.pixels[off + 2] = 0;
        capture.pixels[off + 3] = 255;
      }

    }

  }

  //update the pixels for capture
  capture.updatePixels();

  //display the capture frame to the canvas
  image(capture, 0, 0, 320, 240);

}

//function to easily establish a good contrast limit
function keyPressed() {

  //if the user clicks the up arrow
  if (keyCode === UP_ARROW) {

    //increase the contrast limit
    contrastLimit++;


  }
  //if the user clicks down
  else if (keyCode === DOWN_ARROW) {

    //decrease the contrast limit
    contrastLimit--;

  }

}