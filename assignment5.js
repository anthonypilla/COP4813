const canvas = document.getElementById("spirographCanvas");
const ctx = canvas.getContext("2d");

const form = document.getElementById("spirographForm");
const errorMessage = document.getElementById("errorMessage");

let animationId = null;


// Calculate the greatest common divisor

function gcd(a, b) {
    while (b !== 0) {
        const remainder = a % b;
        a = b;
        b = remainder;
    }

    return a;
}


// Draw the Spirograph when the form is submitted

form.addEventListener("submit", function (event) {

    event.preventDefault();

    // Read the user-entered parameters

    const R = Number(document.getElementById("outerRadius").value);
    const r = Number(document.getElementById("innerRadius").value);
    const O = Number(document.getElementById("penOffset").value);

    // Validate the parameters

    if (
        !Number.isFinite(R) ||
        !Number.isFinite(r) ||
        !Number.isFinite(O) ||
        !Number.isInteger(R) ||
        !Number.isInteger(r) ||
        R <= 0 ||
        r <= 0 ||
        O < 0
    ) {
        errorMessage.textContent =
            "Enter whole numbers greater than zero for R and r, and a nonnegative value for O.";
        return;
    }

    // Ensure the pattern fits inside the canvas

    if (R + 2 * r + O > 330) {
        errorMessage.textContent =
            "The pattern may be too large. Reduce the values so R + 2r + O is 330 or less.";
        return;
    }

    errorMessage.textContent = "";

    // Stop any previous animation

    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    // Clear the previous pattern

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set the canvas center

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Calculate the complete cycle

    const commonDivisor = gcd(R, r);
    const maxT = 2 * Math.PI * (r / commonDivisor);

    // Divide the cycle into small steps.
    // The final point will be exactly at maxT.

    const totalPoints = Math.ceil(maxT / 0.01);
    let pointIndex = 0;

    const pointsPerFrame = 300;

    // Set the drawing style

    ctx.beginPath();
    ctx.strokeStyle = "#2496FF";
    ctx.lineWidth = 1.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    // Calculate the first point

    const firstX =
        (R + r) * Math.cos(0) -
        (r + O) * Math.cos(0);

    const firstY =
        (R + r) * Math.sin(0) -
        (r + O) * Math.sin(0);

    ctx.moveTo(
        centerX + firstX,
        centerY - firstY
    );

    // Draw the pattern progressively

    function draw() {

        let pointsDrawn = 0;

        while (
            pointIndex < totalPoints &&
            pointsDrawn < pointsPerFrame
        ) {

            pointIndex++;

            // Make the last point exactly equal to maxT

            const t = maxT * pointIndex / totalPoints;

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

            ctx.lineTo(canvasX, canvasY);

            pointsDrawn++;
        }

        // Display the new line segments

        ctx.stroke();

        // Continue until the entire cycle is drawn

        if (pointIndex < totalPoints) {
            animationId = requestAnimationFrame(draw);
        } else {
            animationId = null;
        }
    }

    draw();

});
