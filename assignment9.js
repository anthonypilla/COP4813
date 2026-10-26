
/* Assignment 9 - Baseball Animation */

const canvas = document.getElementById("baseballCanvas");
const ctx = canvas.getContext("2d");
const gameMessage = document.getElementById("gameMessage");

// Baseball properties
const ball = {
    x: 100,
    y: 100,
    radius: 13,
    dx: 2.5,
    dy: 2,
    hit: false,
    hitTimer: 0,
    rotation: 0
};

let lastTime = 0;

// Draw the baseball field.
function drawField() {
    const w = canvas.width;
    const h = canvas.height;

    // Green grass background
    ctx.fillStyle = "#398542";
    ctx.fillRect(0, 0, w, h);

    // Alternating grass stripes
    for (let i = 0; i < w; i += 100) {
        if ((i / 100) % 2 === 0) {
            ctx.fillStyle = "rgba(255,255,255,0.06)";
            ctx.fillRect(i, 0, 100, h);
        }
    }

    // Outfield warning track
    ctx.strokeStyle = "#bd9a63";
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.arc(w / 2, h + 120, 390, Math.PI, Math.PI * 2);
    ctx.stroke();

    // Dirt infield diamond
    const home = { x: w / 2, y: h - 45 };
    const first = { x: w / 2 + 115, y: h - 160 };
    const second = { x: w / 2, y: h - 275 };
    const third = { x: w / 2 - 115, y: h - 160 };

    ctx.fillStyle = "#b97843";
    ctx.beginPath();
    ctx.moveTo(home.x, home.y);
    ctx.lineTo(first.x, first.y);
    ctx.lineTo(second.x, second.y);
    ctx.lineTo(third.x, third.y);
    ctx.closePath();
    ctx.fill();

    // Foul lines
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(home.x, home.y);
    ctx.lineTo(40, 20);
    ctx.moveTo(home.x, home.y);
    ctx.lineTo(w - 40, 20);
    ctx.stroke();

    // Infield grass
    ctx.fillStyle = "#34783a";
    ctx.beginPath();
    ctx.moveTo(home.x, home.y - 5);
    ctx.lineTo(first.x - 5, first.y);
    ctx.lineTo(second.x, second.y + 5);
    ctx.lineTo(third.x + 5, third.y);
    ctx.closePath();
    ctx.fill();

    // Pitcher's mound
    ctx.fillStyle = "#b97843";
    ctx.beginPath();
    ctx.arc(w / 2, h - 205, 24, 0, Math.PI * 2);
    ctx.fill();

    // Pitcher's rubber
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(w / 2 - 8, h - 209, 16, 4);

    // Draw the bases
    drawBase(home.x, home.y, true);
    drawBase(first.x, first.y);
    drawBase(second.x, second.y);
    drawBase(third.x, third.y);
}

// Draw a white base.
function drawBase(x, y, isHome = false) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = "#ffffff";

    if (isHome) {
        ctx.restore();

        ctx.beginPath();
        ctx.moveTo(x - 10, y - 5);
        ctx.lineTo(x + 10, y - 5);
        ctx.lineTo(x + 10, y + 5);
        ctx.lineTo(x, y + 12);
        ctx.lineTo(x - 10, y + 5);
        ctx.closePath();
        ctx.fill();
        return;
    }

    ctx.fillRect(-7, -7, 14, 14);
    ctx.restore();
}

// Draw the baseball with red stitching.
function drawBaseball() {
    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.rotate(ball.rotation);

    // Ball shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.beginPath();
    ctx.ellipse(3, 5, ball.radius, ball.radius * 0.7,
        0, 0, Math.PI * 2);
    ctx.fill();

    // White baseball
    ctx.fillStyle = "#fffaf0";
    ctx.strokeStyle = "#dddddd";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Red curved seams
    ctx.strokeStyle = "#c62828";
    ctx.lineWidth = 1.5;

    for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(side * 5, -10);
        ctx.bezierCurveTo(
            side * 12, -5,
            side * 12, 5,
            side * 5, 10
        );
        ctx.stroke();

        // Small stitches
        for (let i = -6; i <= 6; i += 4) {
            ctx.beginPath();
            ctx.moveTo(side * (6 + Math.abs(i) * 0.4), i - 1);
            ctx.lineTo(side * (8 + Math.abs(i) * 0.4), i + 1);
            ctx.stroke();
        }
    }

    ctx.restore();
}

// Keep the ball inside the canvas and bounce it off the edges.
function bounceOffWalls() {
    if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.dx = Math.abs(ball.dx);
    }

    if (ball.x + ball.radius > canvas.width) {
        ball.x = canvas.width - ball.radius;
        ball.dx = -Math.abs(ball.dx);
    }

    if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.dy = Math.abs(ball.dy);
    }

    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.dy = -Math.abs(ball.dy);
    }
}

// Update the baseball's movement.
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    ball.rotation += (ball.dx + ball.dy) * 0.015;

    // A hit gives the ball a burst of speed.
    if (ball.hit) {
        ball.hitTimer--;

        // Gradually slow the ball after the hit.
        ball.dx *= 0.992;
        ball.dy *= 0.992;

        if (ball.hitTimer <= 0 ||
            Math.hypot(ball.dx, ball.dy) < 2.5) {
            ball.hit = false;

            // Resume normal bouncing speed.
            ball.dx = ball.dx < 0 ? -2.5 : 2.5;
            ball.dy = ball.dy < 0 ? -2 : 2;

            gameMessage.textContent =
                "The ball has slowed down. Click it to hit it again!";
        }
    }

    bounceOffWalls();
}

// Check whether the mouse clicked the baseball.
canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();

    // Convert screen coordinates to canvas coordinates.
    const mouseX =
        (event.clientX - rect.left) * canvas.width / rect.width;
    const mouseY =
        (event.clientY - rect.top) * canvas.height / rect.height;

    const distance = Math.hypot(
        mouseX - ball.x,
        mouseY - ball.y
    );

    if (distance <= ball.radius + 5) {
        // Simulate hitting the baseball with a bat.
        const angle = -Math.PI / 4 +
            (Math.random() - 0.5) * Math.PI / 2;
        const speed = 10;

        ball.dx = Math.cos(angle) * speed;
        ball.dy = Math.sin(angle) * speed;
        ball.hit = true;
        ball.hitTimer = 150;

        gameMessage.textContent =
            "CRACK! You hit the baseball! Watch it fly around the field!";

    } else {
        gameMessage.textContent =
            "Click directly on the baseball to hit it!";
    }
});

// Main animation loop.
function animate(timestamp) {
    // Limit movement so the animation stays consistent across screens.
    const elapsed = lastTime ? timestamp - lastTime : 16.67;
    lastTime = timestamp;
    const timeScale = Math.min(elapsed / 16.67, 2);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawField();

    // Update movement using the elapsed frame time.
    ball.x += ball.dx * (timeScale - 1);
    ball.y += ball.dy * (timeScale - 1);

    updateBall();
    drawBaseball();

    requestAnimationFrame(animate);
}

// Start the animation.
requestAnimationFrame(animate);

