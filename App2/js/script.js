// Переменная canvas получает элемент с id 'tetris', который используется для отрисовки игры.
const canvas = document.getElementById('tetris');
// Переменная context получает контекст отрисовки для canvas.
const context = canvas.getContext('2d');
// Переменная scale определяет размер каждого блока игрового поля.
const scale = 20;
// Переменная gameOverFlag определяет, является ли игра оконченной.
let gameOverFlag = false;


// массив colors, в котором каждый элемент соответствует цвету для каждого типа фигуры.
const colors = [
    null,
    'purple',
    'cyan',
    'yellow',
    'green',
    'red',
    'blue',
    'orange',
];

//Устанавливаем масштаб отрисовки для контекста context.
context.scale(scale, scale);

//Создаем функцию createMatrix, которая принимает ширину и высоту игрового поля и возвращает матрицу (двумерный массив) заполненную нулями.
function createMatrix(width, height) {
    const matrix = [];
    while (height--) {
        matrix.push(new Array(width).fill(0));
    }
    return matrix;
}

// Создаем функцию draw, которая отрисовывает игру на canvas.
function draw() {
    // Сначала заполняем canvas черным цветом.
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Затем вызываем функцию drawMatrix для отрисовки текущего состояния игрового поля и фигуры игрока.
    drawMatrix(matrix, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
}

//Создаем функцию drawMatrix, которая принимает матрицу и смещение и отрисовывает каждый элемент матрицы на canvas.
function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        // Итерируемся по каждому элементу матрицы.
        row.forEach((value, x) => {
            // Если значение элемента не равно 0, то устанавливаем цвет fillStyle для контекста context
            // в соответствии с цветом фигуры и отрисовываем прямоугольник с размером 1x1 и смещением относительно смещения offset.
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}
// Создаем функцию merge, которая объединяет фигуру игрока с игровым полем.
function merge(matrix, player) {
    player.matrix.forEach((row, y) => {
        // Итерируемся по каждому элементу матрицы фигуры игрока.
        row.forEach((value, x) => {
            // Если значение элемента не равно 0, то устанавливаем значение элемента в соответствующую ячейку игрового поля с учетом смещения игрока.
            if (value !== 0) {
                matrix[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
    // Затем вызываем функцию removeFullRows для удаления полных строк на игровом поле.
    removeFullRows();
}

// Создаем функцию collide, которая проверяет, столкнулась ли фигура игрока со стенками или другими фигурами на игровом поле.
function collide(matrix, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        // Итерируемся по каждому элементу матрицы фигуры игрока.
        for (let x = 0; x < m[y].length; ++x) {
            // Если значение элемента не равно 0 и ячейка игрового поля с учетом смещения игрока не равна 0, то возвращаем true.
            if (
                m[y][x] !== 0 &&
                (matrix[y + o.y] &&
                    matrix[y + o.y][x + o.x]) !== 0

            ) {
                return true;
            }
        }
    }
    // Если все проверки пройдены, то возвращаем false.
    return false;
}

// Создаем функцию rotate, которая поворачивает матрицу на 90 градусов.
function rotate(matrix, dir) {
    // Итерируемся по каждому элементу матрицы.
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            // Меняем местами элементы с координатами (x, y) и (y, x).
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }

    // Если dir больше 0, то разворачиваем каждую строку матрицы.
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        // Если dir меньше или равно 0, то разворачиваем всю матрицу.
        matrix.reverse();
    }
}

// Создаем функцию playerDrop, которая перемещает фигуру игрока вниз на одну клетку.
function playerDrop() {
    // Увеличиваем значение координаты y позиции игрока.
    player.pos.y++;
    // Если фигура столкнулась с другими фигурами или стенками,
    // то уменьшаем значение координаты y позиции игрока на одну клетку,
    // объединяем фигуру с игровым полем, сбрасываем фигуру игрока в начальное положение, обновляем счет,
    // и если после объединения фигуры с игровым полем фигура игрока сталкивается с другими фигурами или стенками,
    // то вызываем функцию gameOver.
    if (collide(matrix, player)) {
        player.pos.y--;
        merge(matrix, player);
        playerReset();
        updateScore();
        if (collide(matrix, player)) {
            gameOver();
            return;
        }
    }
}

// Создаем функцию playerMove, которая перемещает фигуру игрока влево или вправо.
function playerMove(dir) {
    // Изменяем значение координаты x позиции игрока на dir.
    player.pos.x += dir;
    // Если фигура столкнулась с другими фигурами или стенками, то отменяем перемещение и возвращаем фигуру в исходное положение.
    if (collide(matrix, player)) {
        player.pos.x -= dir;
    }
}

// Создаем функцию playerReset, которая сбрасывает фигуру игрока в начальное положение.
function playerReset() {
    // Получаем случайный тип фигуры из массива pieces.
    const pieces = 'TJLOSZI';
    // Создаем матрицу фигуры игрока в соответствии с типом.
    player.matrix = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
    // Устанавливаем начальные координаты фигуры игрока.
    player.pos.y = 0;
    player.pos.x = Math.floor((matrix[0].length - player.matrix[0].length) / 2);
    // Если фигура столкнулась с другими фигурами или стенками, то вызываем функцию gameOver.
    if (collide(matrix, player)) {
        gameOver();
        return;
    }
}

// Создаем функцию createPiece, которая возвращает матрицу для каждого типа фигуры.
// Каждый тип фигуры представлен уникальной матрицей, где ненулевые значения соответствуют цвету фигуры.
function createPiece(type) {
    if (type === 'T') {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
        ];
    } else if (type === 'J') {
        return [
            [0, 2, 0],
            [0, 2, 0],
            [2, 2, 0],
        ];
    } else if (type === 'L') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3],
        ];
    } else if (type === 'O') {
        return [
            [4, 4],
            [4, 4],
        ];
    } else if (type === 'S') {
        return [
            [0, 5, 5],
            [5, 5, 0],
            [0, 0, 0],
        ];
    } else if (type === 'Z') {
        return [
            [6, 6, 0],
            [0, 6, 6],
            [0, 0, 0],
        ];
    } else if (type === 'I') {
        return [
            [0, 0, 0, 0],
            [7, 7, 7, 7],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];
    }
}

//Создаем функцию rotatePiece, которая поворачивает фигуру игрока с учетом столкновений.
function rotatePiece(dir) {
    // Запоминаем текущую координату x позиции игрока.
    const pos = player.pos.x;
    // Устанавливаем смещение равное 1.
    let offset = 1;
    // Поворачиваем фигуру игрока.
    rotate(player.matrix, dir);
    while (collide(matrix, player)) {
        // Если фигура столкнулась с другими фигурами или стенками, то смещаем фигуру игрока по x на смещение и меняем его знак.
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        // Если смещение больше длины строки матрицы фигуры, то отменяем поворот и возвращаем фигуру в исходное положение.
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

// Создаем функцию updateScore, которая обновляет счет игрока на странице.
function updateScore() {
    document.getElementById('score').innerText = player.score;
}

// Создаем функцию gameOver, которая вызывается при окончании игры.
function gameOver() {
    // Если игра уже окончена, то возвращаемся.
    if (gameOverFlag) {
        return;
    }
    // Устанавливаем флаг окончания игры.
    gameOverFlag = true;
    // Выводим сообщение об окончании игры и текущем счете игрока.
    alert("Game Over\n" + "Your score: " + player.score);
    // Запускаем новую игру.
    startGame();
}

// Создаем функцию playerRotate, которая вызывает функцию rotatePiece с определенным направлением поворота.
function playerRotate(dir) {
    // Запоминаем текущую координату x позиции игрока.
    const pos = player.pos.x;
    // Устанавливаем смещение равное 1.
    let offset = 1;
    // Поворачиваем фигуру игрока.
    rotatePiece(dir);
    // Если фигура столкнулась с другими фигурами или стенками, то смещаем фигуру игрока по x на смещение и меняем его знак.
    while (collide(matrix, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        // Если смещение больше длины строки матрицы фигуры, то отменяем поворот и возвращаем фигуру в исходное положение.
        if (offset > player.matrix[0].length) {
            rotatePiece(-dir);
            player.pos.x = pos;
            return;
        }
    }
}

// Добавляем обработчик событий нажатия клавиш клавиатуры.
document.addEventListener('keydown', event => {
    // Если нажата клавиша влево, вызываем функцию playerMove с аргументом -1 (движение влево).
    if (event.keyCode === 37) {
        playerMove(-1); // Движение влево

    } else if (event.keyCode === 39) {
        // Если нажата клавиша вправо, вызываем функцию playerMove с аргументом 1 (движение вправо).
        playerMove(1); // Движение вправо

    } else if (event.keyCode === 40) {
        // Если нажата клавиша вниз, вызываем функцию playerDrop (движение вниз).
        playerDrop(); // Движение вниз

    } else if (event.keyCode === 81) {
        // Если нажата клавиша Q, вызываем функцию playerRotate с аргументом -1 (поворот против часовой стрелки).
        playerRotate(-1); // Повернуть фигуру против часовой стрелки (клавиша Q)
    } else if (event.keyCode === 87 || event.keyCode === 38) {
        // Если нажата клавиша W или стрелка вверх, вызываем функцию playerRotate с аргументом 1 (поворот по часовой стрелке).
        playerRotate(1); // Повернуть фигуру по часовой стрелке (клавиша W)
    }
});

// Создаем переменные lastTime, dropCounter и dropInterval для управления скоростью падения фигуры.
let lastTime = 0;
let dropCounter = 0;
let dropInterval = 1000;

// Создаем функцию update, которая обновляет состояние игры и отрисовывает его.





function update(time = 0) {
    // Вычисляем разницу времени между текущим и последним обновлением.
    const deltaTime = time - lastTime;
    lastTime = time;
    // Вычисляем значение dropCounter путем добавления разницы времени.
    dropCounter += deltaTime;
    // Если dropCounter превышает значение dropInterval, то вызываем функцию playerDrop (фигура падает вниз).
    if (dropCounter > dropInterval) {
        playerDrop();
        dropCounter = 0;
    }

    // Отрисовываем состояние игры.
    draw();
    // Запрашиваем анимацию для следующего обновления.
    requestAnimationFrame(update);
}

// Создаем игровую матрицу с помощью функции createMatrix.
const matrix = createMatrix(12, 20);

// Создаем объект player со свойствами pos (позиция фигуры) и matrix (матрица фигуры).
const player = {
    pos: { x: 0, y: 0 },
    matrix: null,
    score: 0,
};

// Функция очистки игрового поля
function clearMatrix() {
    matrix.forEach(row => row.fill(0));
}

// Функция удаления строк, которые заполнились
function removeFullRows() {
    // Создаем массив, в который будем добавлять заполненные строки, которые будет нужно удалить
    const fullRows = [];
    outer: for (let y = matrix.length - 1; y >= 0; --y) {
        for (let x = 0; x < matrix[y].length; ++x) {
            if (matrix[y][x] === 0) {
                continue outer;
            }
        }
        fullRows.push(y);
    }
    for (let i = 0; i < fullRows.length; i++) {
        const row = matrix.splice(fullRows[i], 1)[0].fill(0);
        matrix.unshift(row);
        player.pos.y -= 1;
    }
    player.score += 10 * fullRows.length;
}

// Функция начала игры
function startGame() {
    clearMatrix();
    player.score = 0;
    playerReset();
    updateScore();
    update();
    gameOverFlag = false;
}

startGame();