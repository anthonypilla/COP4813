const canvas = document.getElementById("spirographCanvas");
const ctx = canvas.getContext("2d");

const startButton = document.getElementById("startButton");
const errorMessage = document.getElementById("errorMessage");

let animationId = null;


// Start drawing when the button is clicked

startButton.addEventListener("click", function () {

    // Read the parameters entered by the user

    const R = Number(document.getElementById("outerRadius").value);
    const r = Number(document.getElementById("innerRadius").value);
    const O = Number(document.getElementById("penOffset").value);

    // Validate the parameters

    if (
        !Number.isFinite(R) ||
        !Number.isFinite(r) ||
        !Number.isFinite(O) ||
        R <= 0 ||
        r <= 0 ||
        O < 0
    ) {
        errorMessage.textContent =
            "Enter positive values for R and r, and a nonnegative value for O.";
        return;
    }

    if (R + r + O > 280) {
        errorMessage.textContent =
            "The combined parameters are too large for the canvas. Reduce the values so R + r + O is 280 or less.";
        return;
    }

    errorMessage.textContent = "";

    // Stop any previous animation

    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    // Clear the canvas

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set the center of the canvas

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Start t at zero

    let t = 0;

    const tIncrement = 0.01;
    const pointsPerFrame = 20;
    const maxT = 2 * Math.PI * 100;

    let firstPoint = true;

    ctx.beginPath();
    ctx.strokeStyle = "#2496FF";
    ctx.lineWidth = 1.5;

    // Draw the Spirograph progressively

    function draw() {

        for (let i = 0; i < pointsPerFrame && t <= maxT; i++) {

            // Spirograph equations

            const x =
                (R + r) * Math.cos(t) -
                (r + O) * Math.cos(((R + r) / r) * t);

            const y =
                (R + r) * Math.sin(t) -
                (r + O) * Math.sin(((R + r) / r) * t);

            // Convert mathematical coordinates to canvas coordinates

            const canvasX = centerX + x;
            const canvasY = centerY - y;

            if (firstPoint) {
                ctx.moveTo(canvasX, canvasY);
                firstPoint = false;
            } else {
                ctx.lineTo(canvasX, canvasY);
            }

            t += tIncrement;
        }

        ctx.stroke();

        if (t <= maxT) {
            animationId = requestAnimationFrame(draw);
        } else {
            animationId = null;
        }
    }

    draw();
});
