
const canvas = document.getElementById("baseballCanvas");
const ctx = canvas.getContext("2d");
const gameMessage = document.getElementById("gameMessage");

// Load the baseball field background image.
const fieldImage = new Image();
fieldImage.src = "images/baseballfield.jpg";

// Load the baseball image.
const baseballImage = new Image();
baseballImage.src = "images/baseball.webp";

// Baseball movement and animation settings.
const ball = {
    x: 100,
    y: 100,
    radius: 20,
    dx: 2.5,
    dy: 2,
    rotation: 0,
    hit: false,
    hitTimer: 0
};

let lastTime = 0;

// Draw the field background.
function drawField() {
    if (fieldImage.complete && fieldImage.naturalWidth > 0) {
        ctx.drawImage(fieldImage, 0, 0, canvas.width, canvas.height);
    } else {
        // Temporary background while the field image loads.
        ctx.fillStyle = "#398542";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// Draw the baseball image and rotate it as it moves.
function drawBaseball() {
    if (!baseballImage.complete || baseballImage.naturalWidth === 0) {
        return;
    }

    ctx.save();

    // Move the drawing origin to the baseball's position.
    ctx.translate(ball.x, ball.y);

    // Rotate the baseball image.
    ctx.rotate(ball.rotation);

    // Draw the image centered on the baseball's position.
    ctx.drawImage(
        baseballImage,
        -ball.radius,
        -ball.radius,
        ball.radius * 2,
        ball.radius * 2
    );

    ctx.restore();
}

// Keep the baseball inside the canvas.
function bounceOffWalls() {
    if (ball.x - ball.radius <= 0) {
        ball.x = ball.radius;
        ball.dx = Math.abs(ball.dx);
    }

    if (ball.x + ball.radius >= canvas.width) {
        ball.x = canvas.width - ball.radius;
        ball.dx = -Math.abs(ball.dx);
    }

    if (ball.y - ball.radius <= 0) {
        ball.y = ball.radius;
        ball.dy = Math.abs(ball.dy);
    }

    if (ball.y + ball.radius >= canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.dy = -Math.abs(ball.dy);
    }
}

// Update the baseball's position and rotation.
function updateBall(timeScale) {
    ball.x += ball.dx * timeScale;
    ball.y += ball.dy * timeScale;

    // Spin the baseball while it moves.
    ball.rotation += (ball.dx + ball.dy) * 0.015 * timeScale;

    // Gradually slow the baseball after it is hit.
    if (ball.hit) {
        ball.dx *= Math.pow(0.992, timeScale);
        ball.dy *= Math.pow(0.992, timeScale);
        ball.hitTimer -= timeScale;

        // Return to normal movement after the hit.
        if (ball.hitTimer <= 0) {
            ball.hit = false;

            ball.dx = ball.dx < 0 ? -2.5 : 2.5;
            ball.dy = ball.dy < 0 ? -2 : 2;

            gameMessage.textContent =
                "The baseball has returned to its normal movement. Click it to hit it again!";
        }
    }

    bounceOffWalls();
}

// Detect clicks on the baseball.
canvas.addEventListener("click", function(event) {
    const rect = canvas.getBoundingClientRect();

    // Convert the mouse position to canvas coordinates.
    const mouseX =
        (event.clientX - rect.left) * canvas.width / rect.width;

    const mouseY =
        (event.clientY - rect.top) * canvas.height / rect.height;

    // Check the distance between the click and the baseball.
    const distanceX = mouseX - ball.x;
    const distanceY = mouseY - ball.y;
    const distance = Math.sqrt(
        distanceX * distanceX + distanceY * distanceY
    );

    if (distance <= ball.radius) {
        // Simulate hitting the baseball in a new direction.
        const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.8;
        const speed = 10;

        ball.dx = Math.cos(angle) * speed;
        ball.dy = Math.sin(angle) * speed;

        ball.hit = true;
        ball.hitTimer = 150;

        // Visible feedback confirms the click event was captured.
        gameMessage.textContent =
            "HIT! The baseball was clicked and launched across the field!";
    } else {
        gameMessage.textContent =
            "You clicked the field. Click directly on the baseball to hit it!";
    }
});

// Main animation loop.
function animate(timestamp) {
    let timeScale = 1;

    if (lastTime !== 0) {
        timeScale = Math.min((timestamp - lastTime) / 16.67, 2);
    }

    lastTime = timestamp;

    // Redraw the background and moving baseball.
    drawField();
    updateBall(timeScale);
    drawBaseball();

    requestAnimationFrame(animate);
}

// Start the animation.
requestAnimationFrame(animate);
