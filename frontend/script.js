// ================== SOUNDS ==================
const clickSound = new Audio("sounds/click.wav");
const winSound = new Audio("sounds/win.wav");
const loseSound = new Audio("sounds/lose.wav");
const drawSound = new Audio("sounds/draw.wav");

// Safe sound play (browser restriction fix)
function playSound(sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {
        console.log("Sound will play after user interaction");
    });
}

// ================== ELEMENTS ==================
const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const restartBtn = document.getElementById("restart");

// ================== GAME DATA ==================
const HUMAN = "X";
const AI = "O";

let board = Array(9).fill("");
let gameOver = false;

// ================== CREATE BOARD ==================
function createBoard() {
    boardElement.innerHTML = "";
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.addEventListener("click", () => handleCellClick(i));
        boardElement.appendChild(cell);
    }
}

createBoard();
renderBoard();
statusElement.innerText = "Your turn 🙂";

// ================== HANDLE CLICK ==================
function handleCellClick(index) {
    if (board[index] !== "" || gameOver) return;

    board[index] = HUMAN;
    playSound(clickSound);
    renderBoard();

    if (checkWinner(HUMAN)) {
        statusElement.innerText = "You Win 🎉";
        playSound(winSound);
        gameOver = true;
        return;
    }

    if (isDraw()) {
        statusElement.innerText = "It's a Draw 😐";
        playSound(drawSound);
        gameOver = true;
        return;
    }

    statusElement.innerText = "AI is thinking... 🤖";

    setTimeout(aiMove, 400);
}

// ================== AI MOVE ==================
function aiMove() {
    const bestMove = minimax(board, AI).index;
    board[bestMove] = AI;
    renderBoard();

    if (checkWinner(AI)) {
        statusElement.innerText = "AI Wins 🤖💥";
        playSound(loseSound);
        gameOver = true;
        return;
    }

    if (isDraw()) {
        statusElement.innerText = "It's a Draw 😐";
        playSound(drawSound);
        gameOver = true;
        return;
    }

    statusElement.innerText = "Your turn 🙂";
}

// ================== RENDER ==================
function renderBoard() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, i) => {
        cell.innerText = board[i];
    });
}

// ================== WIN CHECK ==================
function checkWinner(player) {
    const patterns = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    return patterns.some(p => p.every(i => board[i] === player));
}

// ================== DRAW ==================
function isDraw() {
    return board.every(cell => cell !== "");
}

// ================== MINIMAX ==================
function minimax(newBoard, player) {
    const empty = newBoard
        .map((v, i) => v === "" ? i : null)
        .filter(v => v !== null);

    if (checkWinMini(newBoard, HUMAN)) return { score: -10 };
    if (checkWinMini(newBoard, AI)) return { score: 10 };
    if (empty.length === 0) return { score: 0 };

    const moves = [];

    for (let i of empty) {
        const move = {};
        move.index = i;
        newBoard[i] = player;

        const result = minimax(newBoard, player === AI ? HUMAN : AI);
        move.score = result.score;

        newBoard[i] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === AI) {
        let bestScore = -Infinity;
        moves.forEach((m, i) => {
            if (m.score > bestScore) {
                bestScore = m.score;
                bestMove = i;
            }
        });
    } else {
        let bestScore = Infinity;
        moves.forEach((m, i) => {
            if (m.score < bestScore) {
                bestScore = m.score;
                bestMove = i;
            }
        });
    }

    return moves[bestMove];
}

function checkWinMini(b, player) {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    return wins.some(p => p.every(i => b[i] === player));
}

// ================== RESTART ==================
restartBtn.addEventListener("click", () => {
    board = Array(9).fill("");
    gameOver = false;
    statusElement.innerText = "Your turn 🙂";
    renderBoard();
});
