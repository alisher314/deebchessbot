// Инициализируем объекты Chess.js и Chessboard.js
let game = null;
let board = null;

// Элементы DOM
const pgnFileInput = document.getElementById('pgnFile');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const startBtn = document.getElementById('startBtn');
const endBtn = document.getElementById('endBtn');
const statusDiv = document.getElementById('status');
const pgnDiv = document.getElementById('pgn');

// Текущий индекс хода в истории
let currentMoveIndex = 0;

// Функция для обновления доски и статуса
function updateBoardAndStatus() {
    // Получаем текущую позицию из истории
    const history = game.history({ verbose: true });
    let currentFen;
    if (currentMoveIndex > 0) {
        currentFen = history[currentMoveIndex - 1].after;
    } else {
        currentFen = game.initialFen();
    }
    board.position(currentFen, false);

    // Обновляем статус
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
                // Загружаем PGN в объект Chess.js
                game.loadPgn(pgnText);
                pgnDiv.textContent = game.pgn(); // Отображаем загруженный PGN
                currentMoveIndex = 0;
                showEnd(); // Переходим в конец партии
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

// Инициализация, которая ждёт загрузки DOM и библиотек
$(document).ready(function() {
    // Теперь мы создаем объект Chess.js здесь, внутри этого блока
    game = new Chess();

    const config = {
        draggable: false,
        position: 'start',
        sparePieces: false
    };
    board = Chessboard('board', config);
    updateBoardAndStatus(); // Обновляем доску при первой загрузке
});
