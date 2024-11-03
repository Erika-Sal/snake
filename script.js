let blockSize;
let rows;
let cols;
let board;
let context;

let snakeX;
let snakeY;

let velocityX = 0;
let velocityY = 0;

let snakeBody = [];

let foodX;
let foodY;

let gameOver = false;
let score = 0;

window.addEventListener('resize', resizeGame);

function resizeGame() {
    board.width = window.innerWidth;
    board.height = window.innerHeight;
    
    // Ensure blockSize is a whole number to avoid alignment issues
    blockSize = Math.floor(Math.min(board.width, board.height) / 40);
    
    rows = Math.floor(board.height / blockSize);
    cols = Math.floor(board.width / blockSize);
    
    if (!gameOver) {
        // Ensure snake position is grid-aligned
        snakeX = Math.floor(snakeX / blockSize) * blockSize;
        snakeY = Math.floor(snakeY / blockSize) * blockSize;
    }
    
    // Realign food to grid
    foodX = Math.floor(foodX / blockSize) * blockSize;
    foodY = Math.floor(foodY / blockSize) * blockSize;
    
    if (foodX >= cols * blockSize || foodY >= rows * blockSize) {
        placeFood();
    }
}

window.onload = function() {
    board = document.getElementById("board");
    context = board.getContext("2d");
    
    resizeGame();
    
    // Ensure initial snake position is grid-aligned
    snakeX = Math.floor(cols / 4) * blockSize;
    snakeY = Math.floor(rows / 2) * blockSize;
    
    placeFood();
    document.addEventListener("keyup", changeDirection);
    setInterval(update, 1000/10);
}

function update() {
    if (gameOver) {
        displayGameOver();
        return;
    }

    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    // Add debug visualization
    context.strokeStyle = "rgba(255, 255, 255, 0.2)";
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            context.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
        }
    }

    // Precise position comparison
    if (Math.abs(snakeX - foodX) < 1 && Math.abs(snakeY - foodY) < 1) {
        snakeBody.push([foodX, foodY]);
        placeFood();
        score += 10;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle = "lime";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    
    // Ensure snake stays grid-aligned
    snakeX = Math.round(snakeX / blockSize) * blockSize;
    snakeY = Math.round(snakeY / blockSize) * blockSize;
    
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    context.fillStyle = "white";
    context.font = `${blockSize}px Courier`;
    context.fillText(`Score: ${score}`, blockSize, blockSize * 1.5);

    if (snakeX < 0 || snakeX >= cols * blockSize || snakeY < 0 || snakeY >= rows * blockSize) {
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOver = true;
        }
    }
}

function displayGameOver() {
    context.fillStyle = "rgba(0, 0, 0, 0.75)";
    context.fillRect(0, 0, board.width, board.height);
    
    context.fillStyle = "white";
    context.font = `${blockSize * 2}px Courier`;
    
    const gameOverText = "Game Over!";
    const scoreText = `Final Score: ${score}`;
    const restartText = "Press Space to Restart";
    
    const textWidth = context.measureText(gameOverText).width;
    const x = (board.width - textWidth) / 2;
    const y = board.height / 2;
    
    context.fillText(gameOverText, x -90, y - blockSize * 2);
    context.fillText(scoreText, x - 90, y);
    context.fillText(restartText, x - 90, y + blockSize * 2);
}

function changeDirection(e) {
    if (gameOver && e.code === "Space") {
        resetGame();
        return;
    }
    
    if (e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    }
    else if (e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    }
    else if (e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }
    else if (e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

function placeFood() {
    // Ensure food is placed exactly on grid intersections
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

function resetGame() {
    snakeX = Math.floor(cols / 4) * blockSize;
    snakeY = Math.floor(rows / 2) * blockSize;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    score = 0;
    gameOver = false;
    placeFood();
}