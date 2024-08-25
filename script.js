const gameBoard = document.getElementById('gameBoard');
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const singlePlayerBtn = document.getElementById('singlePlayer');
const multiPlayerBtn = document.getElementById('multiPlayer');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;
let isSinglePlayer = false;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = board[winCondition[0]];
        let b = board[winCondition[1]];
        let c = board[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = `${currentPlayer} has won!`;
        isGameActive = false;
        return;
    }

    let roundDraw = !board.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = `Draw!`;
        isGameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = `It's ${currentPlayer}'s turn`;
}

function findBestMove(player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === player && board[b] === player && board[c] === "") {
            return c;
        } else if (board[a] === player && board[b] === "" && board[c] === player) {
            return b;
        } else if (board[a] === "" && board[b] === player && board[c] === player) {
            return a;
        }
    }
    return null;
}

function botMove() {
    // Block player if they are about to win
    let move = findBestMove("X");
    if (move !== null) {
        board[move] = currentPlayer;
        cells[move].innerHTML = currentPlayer;
        handleResultValidation();
        return;
    }

    // Try to win if possible
    move = findBestMove("O");
    if (move !== null) {
        board[move] = currentPlayer;
        cells[move].innerHTML = currentPlayer;
        handleResultValidation();
        return;
    }

    // Otherwise, pick a random move
    let availableCells = [];
    board.forEach((cell, index) => {
        if (cell === "") availableCells.push(index);
    });

    const randomIndex = Math.floor(Math.random() * availableCells.length);
    board[availableCells[randomIndex]] = currentPlayer;
    cells[availableCells[randomIndex]].innerHTML = currentPlayer;
    handleResultValidation();
}

function cellClick(e) {
    const clickedCellIndex = e.target.getAttribute('data-index');

    if (board[clickedCellIndex] !== "" || !isGameActive) {
        return;
    }

    board[clickedCellIndex] = currentPlayer;
    e.target.innerHTML = currentPlayer;

    handleResultValidation();

    if (isSinglePlayer && currentPlayer === "O" && isGameActive) {
        setTimeout(botMove, 500);
    }
}

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    isGameActive = true;
    statusDisplay.innerHTML = `It's ${currentPlayer}'s turn`;
    cells.forEach(cell => cell.innerHTML = "");
    restartBtn.style.display = 'none';
}

function startGame(singlePlayer) {
    isSinglePlayer = singlePlayer;
    restartGame();
    restartBtn.style.display = 'block';
}

cells.forEach(cell => cell.addEventListener('click', cellClick));
restartBtn.addEventListener('click', restartGame);
singlePlayerBtn.addEventListener('click', () => startGame(true));
multiPlayerBtn.addEventListener('click', () => startGame(false));
