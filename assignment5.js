const canvas = document.getElementById("spirographCanvas");
const ctx = canvas.getContext("2d");

const form = document.getElementById("spirographForm");
const errorMessage = document.getElementById("errorMessage");

let animationId = null;


// Greatest common divisor

function gcd(a, b) {
    while (b !== 0) {
        const remainder = a % b;
        a = b;
        b = remainder;
    }

    return a;
}


// Draw the Spirograph

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const R = Number(document.getElementById("outerRadius").value);
    const r = Number(document.getElementById("innerRadius").value);
    const O = Number(document.getElementById("penOffset").value);

    // Validate input

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
            "Enter positive whole numbers for R and r, and a nonnegative value for O.";
        return;
    }

    errorMessage.textContent = "";

    // Stop previous animation

    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    // Clear canvas

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Canvas center

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Calculate the full cycle

    const commonDivisor = gcd(R, r);
    const maxT = 2 * Math.PI * (r / commonDivisor);

    // Use a fixed number of points for a smooth, repeatable curve

    const totalPoints = Math.ceil(maxT * 500);
    const pointsPerFrame = 500;

    let pointIndex = 0;

    ctx.beginPath();
    ctx.strokeStyle = "#2496FF";
    ctx.lineWidth = 1.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    // Calculate and move to the first point

    const firstX =
        (R + r) * Math.cos(0) -
        (r + O) * Math.cos(0);

    const firstY =
        (R + r) * Math.sin(0) -
        (r + O) * Math.sin(0);

    ctx.moveTo(centerX + firstX, centerY - firstY);


    function draw() {

        let pointsDrawn = 0;

        while (
            pointIndex < totalPoints &&
            pointsDrawn < pointsPerFrame
        ) {

            pointIndex++;

            const t = maxT * pointIndex / totalPoints;

            // Spirograph equations

            const x =
                (R + r) * Math.cos(t) -
                (r + O) * Math.cos(((R + r) / r) * t);

            const y =
                (R + r) * Math.sin(t) -
                (r + O) * Math.sin(((R + r) / r) * t);

            ctx.lineTo(centerX + x, centerY - y);

            pointsDrawn++;
        }

        ctx.stroke();

        if (pointIndex < totalPoints) {
            animationId = requestAnimationFrame(draw);
        } else {
            animationId = null;
        }
    }

    draw();

});
