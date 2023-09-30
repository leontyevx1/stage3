// Получаем ссылки на элементы DOM

const productNameInput = document.getElementById('productNameInput');
const caloriesInput = document.getElementById('caloriesInput');
const addProductButton = document.getElementById('addProductButton');
const filterInput = document.getElementById('filterInput');
const sortButton = document.getElementById('sortButton');
const productsUl = document.getElementById('productsUl');
const caloriesSum = document.getElementById('caloriesSum');
const targetCalories = document.getElementById('targetCalories');
const caloriesMessage = document.getElementById('caloriesMessage');
const clearButton = document.getElementById('clearButton');
const targetCaloriesInput = document.getElementById('targetCaloriesInput');
const saveTargetCaloriesButton = document.getElementById('saveTargetCaloriesButton');
const headerItemsProduct = document.querySelector('.header-list');

// При загрузке страницы проверяем наличие сохраненных данных в localStorage

let products = JSON.parse(localStorage.getItem('products')) || [];
let dailyCalories = JSON.parse(localStorage.getItem('dailyCalories')) || 0;

// Функция для добавления продукта

function addProduct() {
    const productName = productNameInput.value;
    const calories = parseInt(caloriesInput.value);

    // Добавляем продукт в массив

    products.push({ name: productName, calories: calories });

    // Сохраняем обновленные данные в localStorage

    localStorage.setItem('products', JSON.stringify(products));

    // Очищаем поля ввода

    productNameInput.value = '';
    caloriesInput.value = '';

    // Перерисовываем список продуктов

    renderProducts();
}

// Функция для фильтрации продуктов по названию

function filterProducts() {
    const filterValue = filterInput.value;

    // Фильтруем продукты по названию

    const filteredProducts = products.filter(product => {
        return product.name.toLowerCase().includes(filterValue.toLowerCase());
    });

    // Перерисовываем список продуктов

    renderProducts(filteredProducts);
}

// Функция для сортировки продуктов по калориям

function sortProducts() {
    // Сортируем продукты по калориям (по возрастанию)
    const sortedProducts = products.sort((a, b) => a.calories - b.calories);

    // Перерисовываем список продуктов

    renderProducts(sortedProducts);
}

// Функция для сохранения целевых калорий

function saveTargetCalories() {
    const newTargetCalories = parseInt(targetCaloriesInput.value);

    // Сохраняем новое значение целевых калорий в localStorage

    localStorage.setItem('dailyCalories', JSON.stringify(newTargetCalories));

    // Обновляем значение в памяти

    dailyCalories = newTargetCalories;

    // Обновляем отображение целевых калорий

    targetCalories.textContent = `Целевые калории на день: ${dailyCalories}`;

    // Очищаем поле ввода

    targetCaloriesInput.value = '';

    // Пересчитываем и отображаем сумму калорий

    calculateCaloriesSum();
}

// Обработчик клика на кнопку сохранения целевых калорий

saveTargetCaloriesButton.addEventListener('click', saveTargetCalories);

// Функция для подсчета и отображения суммы калорий

function calculateCaloriesSum() {
    // Считаем сумму калорий

    const sum = products.reduce((total, product) => total + product.calories, 0);

    // Отображаем сумму калорий

    caloriesSum.textContent = `Сумма калорий: ${sum}`;

    // Проверяем, превышает ли сумма калорий установленный лимит

    if (sum > dailyCalories) {
        caloriesMessage.textContent = 'Превышено дневное потребление калорий!';
    } else {
        caloriesMessage.textContent = '';
    }
}

// Функция для удаления продукта

function removeProduct(index) {
    // Удаляем продукт из массива

    products.splice(index, 1);

    // Сохраняем обновленные данные в localStorage

    localStorage.setItem('products', JSON.stringify(products));

    // Перерисовываем список продуктов

    renderProducts();
}

// Функция для очистки всех данных

function clearData() {
    // Очищаем данные из localStorage

    localStorage.removeItem('products');
    localStorage.removeItem('dailyCalories');

    // Очищаем массив продуктов и сумму калорий

    products = [];
    dailyCalories = 0;

    // Перерисовываем список продуктов

    renderProducts();
}

// Функция для отрисовки списка продуктов

function renderProducts(filteredProducts = products) {
    // Очищаем список продуктов

    productsUl.innerHTML = '';

    // Проверяем, пустой ли список продуктов

    if (filteredProducts.length === 0) {
        const emptyMessage = document.createElement('h1');
        emptyMessage.textContent = 'Список продуктов пуст';
        productsUl.appendChild(emptyMessage);
    } else {
        // Создаем элементы списка для каждого продукта

        for (let i = 0; i < filteredProducts.length; i++) {
            const product = filteredProducts[i];
            const li = document.createElement('li');
            li.textContent = `${product.name} - ${product.calories} ккал`;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Удалить';
            removeButton.addEventListener('click', () => removeProduct(i));
            li.appendChild(removeButton);
            productsUl.appendChild(li);
        }
    }

    // Подсчитываем и отображаем сумму калорий

    calculateCaloriesSum();
}

// Обработчик клика на кнопку добавления продукта

addProductButton.addEventListener('click', addProduct);

// Обработчик изменения поля фильтра

filterInput.addEventListener('input', filterProducts);

// Обработчик клика на кнопку сортировки

sortButton.addEventListener('click', sortProducts);

// Обработчик клика на кнопку очистки данных

clearButton.addEventListener('click', clearData);

// Отображаем целевые показатели калорийности

targetCalories.textContent = `Целевые калории на день: ${dailyCalories}`;

// Перерисовываем список продуктов при загрузке страницы

renderProducts();