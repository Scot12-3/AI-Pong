const canvas = document.getElementById("pong-canvas");
const ctx = canvas.getContext("2d");

// Game settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 14;

// Left paddle (player)
let leftPaddleY = canvas.height / 2 - PADDLE_HEIGHT / 2;

// Right paddle (AI)
let rightPaddleY = canvas.height / 2 - PADDLE_HEIGHT / 2;

// Ball
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballSpeedX = 5 * (Math.random() < 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() < 0.5 ? 1 : -1);

// Scores
let leftScore = 0;
let rightScore = 0;

// Mouse control for left paddle
canvas.addEventListener("mousemove", function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    leftPaddleY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp paddle within the canvas
    leftPaddleY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, leftPaddleY));
});

// Simple AI for right paddle
function moveAIPaddle() {
    // Center of the paddle
    const paddleCenter = rightPaddleY + PADDLE_HEIGHT / 2;
    if (paddleCenter < ballY) {
        rightPaddleY += 4;
    } else if (paddleCenter > ballY + BALL_SIZE) {
        rightPaddleY -= 4;
    }
    // Clamp
    rightPaddleY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, rightPaddleY));
}

// Reset ball after score
function resetBall() {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballSpeedX = 5 * (Math.random() < 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() < 0.5 ? 1 : -1);
}

// Main game loop
function gameLoop() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Wall collision
    if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
        ballSpeedY = -ballSpeedY;
        ballY = Math.max(0, Math.min(canvas.height - BALL_SIZE, ballY));
    }

    // Left paddle collision
    if (
        ballX <= PADDLE_WIDTH &&
        ballY + BALL_SIZE > leftPaddleY &&
        ballY < leftPaddleY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -ballSpeedX;
        // Optional: add some spin based on where ball hits paddle
        const hitPos = ((ballY + BALL_SIZE/2) - (leftPaddleY + PADDLE_HEIGHT/2)) / (PADDLE_HEIGHT/2);
        ballSpeedY += hitPos * 2;
        ballX = PADDLE_WIDTH; // Prevent sticking
    }

    // Right paddle collision
    if (
        ballX + BALL_SIZE >= canvas.width - PADDLE_WIDTH &&
        ballY + BALL_SIZE > rightPaddleY &&
        ballY < rightPaddleY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -ballSpeedX;
        const hitPos = ((ballY + BALL_SIZE/2) - (rightPaddleY + PADDLE_HEIGHT/2)) / (PADDLE_HEIGHT/2);
        ballSpeedY += hitPos * 2;
        ballX = canvas.width - PADDLE_WIDTH - BALL_SIZE; // Prevent sticking
    }

    // Score
    if (ballX < 0) {
        rightScore++;
        resetBall();
    }
    if (ballX + BALL_SIZE > canvas.width) {
        leftScore++;
        resetBall();
    }

    // Move AI paddle
    moveAIPaddle();

    // Draw everything
    draw();

    requestAnimationFrame(gameLoop);
}

function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw net
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    for (let y = 0; y < canvas.height; y += 24) {
        ctx.moveTo(canvas.width / 2, y);
        ctx.lineTo(canvas.width / 2, y + 16);
    }
    ctx.stroke();

    // Draw paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(canvas.width - PADDLE_WIDTH, rightPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX + BALL_SIZE/2, ballY + BALL_SIZE/2, BALL_SIZE/2, 0, Math.PI * 2);
    ctx.fill();

    // Draw scores
    ctx.font = "40px monospace";
    ctx.fillText(leftScore, canvas.width/2 - 60, 50);
    ctx.fillText(rightScore, canvas.width/2 + 30, 50);
}

// Start game
gameLoop();