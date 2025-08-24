// Импортируем класс Chess из локального файла chess.min.js
import { Chess } from './chess.min.js';

// Объект для сопоставления FEN-нотации с юникодными символами фигур
const PIECES = {
    'p': '♙', 'n': '♘', 'b': '♗', 'r': '♖', 'q': '♕', 'k': '♔',
    'P': '♟', 'N': '♞', 'B': '♝', 'R': '♜', 'Q': '♛', 'K': '♚'
};

const game = new Chess();
let currentMoveIndex = 0;
const boardElement = document.getElementById('board');

// Элементы DOM
const pgnFileInput = document.getElementById('pgnFile');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const startBtn = document.getElementById('startBtn');
const endBtn = document.getElementById('endBtn');
const statusDiv = document.getElementById('status');
const pgnDiv = document.getElementById('pgn');

// Функция для отрисовки доски
function drawBoard(fen) {
    boardElement.innerHTML = ''; // Очищаем доску

    const ranks = fen.split(' ')[0].split('/');
    for (let i = 0; i < 8; i++) {
        let isLightSquare = (i % 2 === 0);
        for (const char of ranks[i]) {
            if (char >= '1' && char <= '8') {
                const emptySquares = parseInt(char, 10);
                for (let j = 0; j < emptySquares; j++) {
                    const square = document.createElement('div');
                    square.className = 'square ' + (isLightSquare ? 'white' : 'black');
                    boardElement.appendChild(square);
                    isLightSquare = !isLightSquare;
                }
            } else {
                const piece = document.createElement('div');
                piece.className = 'square ' + (isLightSquare ? 'white' : 'black');
                piece.textContent = PIECES[char];
                boardElement.appendChild(piece);
                isLightSquare = !isLightSquare;
            }
        }
    }
}

// Функция для обновления доски и статуса
function updateBoardAndStatus() {
    const history = game.history({ verbose: true });
    
    let currentFen;
    if (currentMoveIndex > 0) {
        currentFen = history[currentMoveIndex - 1].after;
    } else {
        currentFen = game.initialFen();
    }
    
    drawBoard(currentFen);

    let statusText = `Ход ${currentMoveIndex} из ${history.length}`;
    if (history.length === 0) {
        statusText = 'Партия не загружена';
    }
    statusDiv.textContent = statusText;
}

// Функции для навигации по ходам
function showNextMove() {
    if (currentMoveIndex < game.history().length) {
        currentMoveIndex++;
        updateBoardAndStatus();
    }
}

function showPrevMove() {
    if (currentMoveIndex > 0) {
        currentMoveIndex--;
        updateBoardAndStatus();
    }
}

function showStart() {
    currentMoveIndex = 0;
    updateBoardAndStatus();
}

function showEnd() {
    currentMoveIndex = game.history().length;
    updateBoardAndStatus();
}

// Обработчик загрузки PGN-файла
pgnFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const pgnText = e.target.result;
            try {
                game.loadPgn(pgnText);
                pgnDiv.textContent = game.pgn();
                currentMoveIndex = 0;
                showEnd();
            } catch (error) {
                alert('Не удалось загрузить PGN. Пожалуйста, убедитесь, что файл корректен.');
                console.error(error);
                game.reset();
                pgnDiv.textContent = '';
                updateBoardAndStatus();
            }
        };
        reader.readAsText(file);
    }
});

// Добавляем обработчики событий для кнопок
nextBtn.addEventListener('click', showNextMove);
prevBtn.addEventListener('click', showPrevMove);
startBtn.addEventListener('click', showStart);
endBtn.addEventListener('click', showEnd);

// Инициализация
updateBoardAndStatus();
