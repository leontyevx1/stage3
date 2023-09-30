let minNumber;
let maxNumber;
let randomNumber;
let attempts = 0;
let rangeIndicator = document.getElementById("range-indicator");
let inputNumber = document.getElementById("guess");

// функция запуска игры
function startGame() {
    minNumber = parseInt(document.getElementById("min").value);
    maxNumber = parseInt(document.getElementById("max").value);
    let resultElement = document.getElementById("result");

    inputNumber.removeAttribute("disabled");

    if (minNumber < 1 || maxNumber > 1000 || minNumber >= maxNumber) {
        alert("Пожалуйста, введите корректные значения для диапазона чисел.");
        return;
    }

    if (resultElement.classList.value === 'alert' || 'victory') {
        resultElement.classList.remove(...resultElement.classList);
    }

    attempts = 0;
    document.getElementById("guess").value = "";
    document.getElementById("result").textContent = "";
    document.getElementById("attempts").textContent = "";
    generateRandomNumber(minNumber, maxNumber);
    updateRangeIndicator();
}

// функция генерации случайного числа в заданных диапазонах
function generateRandomNumber(min, max) {
    randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
}

// функция проверки введенного числа
function checkGuess() {
    let guess = parseInt(document.getElementById("guess").value);
    let resultElement = document.getElementById("result");
    let attemptsElement = document.getElementById("attempts");


    if (!minNumber || !maxNumber) {
        alert('Сначала выберите интервал, а затем нажмите кнопку "Начать игру"')
    }

    // предупреждение о недопустимом значении
    if (minNumber && maxNumber) {
        if (guess < minNumber || guess > maxNumber) {
            resultElement.textContent = "Пожалуйста, введите число от " + minNumber + " до " + maxNumber + ".";
            resultElement.classList.add('alert');
            return;
        }

        attempts++;

        // логика отображения подсказок
        if (guess === randomNumber) {
            inputNumber.setAttribute("disabled", "true");
            resultElement.textContent = "Вы угадали число!";
            resultElement.classList.add('victory');
            attemptsElement.textContent = "Количество попыток: " + attempts;
            rangeIndicator.textContent = '';
        } else if (guess < randomNumber) {
            if (resultElement.classList.value === 'alert') {
                resultElement.classList.remove('alert')
            }
            resultElement.textContent = "Загаданное число больше.";
        } else {
            if (resultElement.classList.value === 'alert') {
                resultElement.classList.remove('alert')
            }
            resultElement.textContent = "Загаданное число меньше.";
        }

        // если попытка каждая третья, то отображается дополнительная подсказка
        if (attempts % 3 === 0) {
            let hint = "";

            if (randomNumber % 2 === 0) {
                hint = "Загаданное число четное.";
            } else {
                hint = "Загаданное число нечетное.";
            }

            resultElement.textContent += " " + hint;
        }
    }
}

// функция отображения диапазона
function updateRangeIndicator() {
    rangeIndicator.textContent = "Загаданное число находится в диапазоне от " + minNumber + " до " + maxNumber + ".";
}

// при отображении окна браузера запускается функция гереации числа
window.onload = function() {
    generateRandomNumber();
};