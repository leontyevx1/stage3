document.addEventListener("DOMContentLoaded", function() {
    const cells = document.getElementsByClassName("cell");
    const restartButton = document.getElementById("restart");
    const playerDisplay = document.getElementById("player");
    const resultGame = document.getElementById("result");

    let currentPlayer;
    let moves;
    let gameEnded;

    // Загрузка данных из localStorage
    loadGame();

    // Функция loadGame используется для загрузки данных из localStorage и восстановления состояния игры.
    function loadGame() {
        const savedGameState = localStorage.getItem('gameState');
        // проверяется наличие сохраненного состояния игры в localStorage.
        // Если сохраненное состояние есть, то извлекаются данные и присваиваются соответствующим переменным.
        if (savedGameState) {
            const gameState = JSON.parse(savedGameState);
            currentPlayer = gameState.currentPlayer;
            moves = gameState.moves;
            gameEnded = gameState.gameEnded;

            playerDisplay.textContent = "Ход игрока: " + currentPlayer;

            // Восстановление состояния ячеек, если игра была завершена
            if (gameEnded) {
                resultGame.classList.add(gameEnded ? "victory" : "draw");
                resultGame.textContent = gameEnded ? "Игрок " + currentPlayer + " выиграл!" : "Ничья!";
                highlightWinningCombination();
            }

            // Восстановление состояния ячеек
            for (let i = 0; i < cells.length; i++) {
                cells[i].textContent = localStorage.getItem('cell' + i);
                cells[i].style.color = localStorage.getItem('cellColor' + i);
            }
        } else {
            // Если сохраненного состояния нет, начинаем новую игру
            restartGame();
        }
    }

    // функция handleCellClick является обработчиком события "click" на ячейке
    function handleCellClick(e) {
        if (gameEnded) return;

        const cell = e.target;
        if (cell.textContent !== "") return;

        cell.textContent = currentPlayer;
        cell.style.color = currentPlayer === "X" ? "red" : "blue";

        moves++;
        if (checkWin()) {
            highlightWinningCombination();
            playerDisplay.textContent = '';
            resultGame.textContent = "Игрок " + currentPlayer + " выиграл!"
            resultGame.classList.add("victory");
            gameEnded = true;
        } else if (moves === 9) {
            playerDisplay.textContent = '';
            resultGame.textContent = "Ничья!";
            resultGame.classList.add("draw");
            gameEnded = true;
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            playerDisplay.textContent = "Ход игрока: " + currentPlayer;
        }
        saveGame();
    }

    // Функция checkWin проверяет, есть ли выигрышная комбинация ячеек.
    function checkWin() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // горизонтальные линии

            [0, 3, 6], [1, 4, 7], [2, 5, 8], // вертикальные линии

            [0, 4, 8], [2, 4, 6] // диагонали

        ];

        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (
                cells[a].textContent === currentPlayer &&
                cells[b].textContent === currentPlayer &&
                cells[c].textContent === currentPlayer

            ) {
                return true;
            }
        }

        return false;
    }

    // функция highlightWinningCombination выделяет выигрышную комбинацию ячеек.
    function highlightWinningCombination() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // горизонтальные линии

            [0, 3, 6], [1, 4, 7], [2, 5, 8], // вертикальные линии

            [0, 4, 8], [2, 4, 6] // диагонали

        ];

        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (
                cells[a].textContent === currentPlayer &&
                cells[b].textContent === currentPlayer &&
                cells[c].textContent === currentPlayer

            ) {
                cells[a].classList.add("win");
                cells[b].classList.add("win");
                cells[c].classList.add("win");
            }
        }
    }

    // функция restartGame используется для перезапуска игры.
    function restartGame() {

        resultGame.classList.remove(...resultGame.classList);
        resultGame.textContent = ''

        for (let cell of cells) {
            cell.textContent = "";
            cell.style.color = "black";
            cell.classList.remove("win");
        }

        currentPlayer = "X";
        moves = 0;
        gameEnded = false;
        playerDisplay.textContent = "Ход игрока: " + currentPlayer;

        // Сохранение данных в localStorage

        saveGame();
    }

    // функция saveGame используется для сохранения состояния игры в localStorage.
    function saveGame() {
        // Создается объект gameState, в котором хранятся текущий игрок, количество ходов и указание завершена ли игра.
        const gameState = {
            currentPlayer: currentPlayer,
            moves: moves,
            gameEnded: gameEnded

        };
        // Объект gameState преобразуется в строку JSON и сохраняется в localStorage.
        localStorage.setItem('gameState', JSON.stringify(gameState));

        // Для каждой ячейки также сохраняется текст и цвет текста в localStorage.
        for (let i = 0; i < cells.length; i++) {
            localStorage.setItem('cell' + i, cells[i].textContent);
            localStorage.setItem('cellColor' + i, cells[i].style.color);
        }
    }

    // Добавляются обработчики событий "click" на каждую ячейку и на кнопку "restart".
    for (let cell of cells) {
        cell.addEventListener("click", handleCellClick);
    }

    restartButton.addEventListener("click", restartGame);
});