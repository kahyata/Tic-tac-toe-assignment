// Initialize the game variables
let board = ['', '', '', '', '', '', '', '', '']; // 3x3 board
let currentPlayer = 'X'; // X always starts first
let gameActive = true; // Game status
let isComputerMode = false; // Determines if we're playing against the computer

// Winning conditions for the Tic-Tac-Toe game
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal lines
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical lines
    [0, 4, 8], [2, 4, 6]             // Diagonal lines
];

// Colors for each player
const playerColors = {
    'X': '#FF6347', // Tomato color for player X
    'O': '#4682B4'  // Steel blue color for player O
};

// Function to handle cell click
function handleCellClick(clickedCellIndex) {
    if (board[clickedCellIndex] !== '' || !gameActive) return; // Ignore if filled or game is over
    makeMove(clickedCellIndex);

    if (isComputerMode && gameActive) {
        setTimeout(() => computerPlay(), 500); // Computer makes a move after a delay
    }
}

// Function to make a move
function makeMove(cellIndex) {
    board[cellIndex] = currentPlayer;
    const clickedCell = document.querySelectorAll('.cell')[cellIndex];
    clickedCell.innerText = currentPlayer;
    clickedCell.style.color = playerColors[currentPlayer];
    checkResult();
    
    if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        document.getElementById('status').innerText = `Player ${currentPlayer}'s turn`;
    }
}

// Function to check the result of the game
function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = board[winCondition[0]];
        let b = board[winCondition[1]];
        let c = board[winCondition[2]];

        if (a === '' || b === '' || c === '') continue;

        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        document.getElementById('status').innerText = `Player ${currentPlayer} has won!`;
        gameActive = false;
        return;
    }

    let roundDraw = !board.includes('');
    if (roundDraw) {
        document.getElementById('status').innerText = "It's a draw!";
        gameActive = false;
        return;
    }
}

// Minimax algorithm implementation
function minimax(newBoard, player) {
    let availableCells = newBoard
        .map((cell, index) => (cell === '' ? index : null))
        .filter(index => index !== null);

    if (checkWin(newBoard, 'O')) return { score: 10 };
    if (checkWin(newBoard, 'X')) return { score: -10 };
    if (availableCells.length === 0) return { score: 0 };

    let moves = [];

    for (let i = 0; i < availableCells.length; i++) {
        let move = {};
        move.index = availableCells[i];
        newBoard[availableCells[i]] = player;

        if (player === 'O') {
            let result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            let result = minimax(newBoard, 'O');
            move.score = result.score;
        }

        newBoard[availableCells[i]] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

// Function for the computer to play using the Minimax algorithm
function computerPlay() {
    let bestMove = minimax(board, 'O');
    makeMove(bestMove.index);
}

// Function to check for a win in the minimax algorithm
function checkWin(board, player) {
    return winningConditions.some(condition => 
        condition.every(index => board[index] === player)
    );
}

// game restart
function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerText = '';
        cell.style.color = ''; // Reset cell color
    });
    document.getElementById('status').innerText = `Player ${currentPlayer}'s turn`;
}

// menu buttons
document.getElementById('player2Btn').addEventListener('click', () => startGame(false));
document.getElementById('computerBtn').addEventListener('click', () => startGame(true));
document.getElementById('resetBtn').addEventListener('click', restartGame);

// Game mode selections
function startGame(vsComputer) {
    isComputerMode = vsComputer;
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    restartGame();
}

// Adding click event listeners to each cell for player moves
document.querySelectorAll('.cell').forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(index));
});
