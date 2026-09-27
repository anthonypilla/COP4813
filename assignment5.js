const canvas = document.getElementById("spirographCanvas");
const ctx = canvas.getContext("2d");

const startButton = document.getElementById("startButton");

let animationId = null;

// Start the Spirograph

startButton.addEventListener("click", function () {


// Stop any previous drawing

if (animationId !== null) {
    cancelAnimationFrame(animationId);
}


// Clear the canvas

ctx.clearRect(0, 0, canvas.width, canvas.height);


// Generate random values

const R = randomNumber(100, 250);
const r = randomNumber(20, R - 20);
const O = randomNumber(0, r);


// Center of the canvas

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;


// Starting value of t

let t = 0;

// Amount t increases for each point

const tIncrement = 0.01;


// Number of points drawn per animation frame

const pointsPerFrame = 100;


// Begin drawing

ctx.beginPath();

let firstPoint = true;


function draw() {

    // Draw several points during each frame

    for (let i = 0; i < pointsPerFrame; i++) {

        // Calculate the x and y positions
        // using the Spirograph equations

        const x =
            (R + r) * Math.cos(t) -
            (r + O) * Math.cos(((R + r) / r) * t);

        const y =
            (R + r) * Math.sin(t) -
            (r + O) * Math.sin(((R + r) / r) * t);


        // Convert mathematical coordinates
        // to canvas coordinates

        const canvasX = centerX + x;
        const canvasY = centerY - y;


        // Move to the first point

        if (firstPoint) {

            ctx.moveTo(canvasX, canvasY);

            firstPoint = false;

        } else {

            ctx.lineTo(canvasX, canvasY);

        }


        // Increase t

        t += tIncrement;

    }


    // Draw the new line segments

    ctx.stroke();


    // Continue drawing

    if (t < Math.PI * 2 * 20) {

        animationId = requestAnimationFrame(draw);

    } else {

        animationId = null;

    }

}


// Start the animation

draw();


});

// Generate a random whole number
// between min and max

function randomNumber(min, max) {


return Math.floor(
    Math.random() * (max - min + 1)
) + min;


}
