const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const type = document.getElementById('type');
const category = document.getElementById('category');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function updateCategoryOptions() {
  const incomeCategories = ['Salary', 'Side Hustle'];
  const expenseCategories = ['Shopping', 'Travel', 'Food', 'Other'];

  category.innerHTML = '';
  const categories = type.value === 'income' ? incomeCategories : expenseCategories;

  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    category.appendChild(option);
  });
}

type.addEventListener('change', updateCategoryOptions);

function addTransaction(e) {
  e.preventDefault();

  let enteredAmount = +amount.value;
  if (type.value === 'expense') {
    enteredAmount = -Math.abs(enteredAmount);
  } else {
    enteredAmount = Math.abs(enteredAmount);
  }

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: enteredAmount,
    category: category.value
  };

  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();

  text.value = '';
  amount.value = '';
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';

  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'expense' : 'income');
  item.innerHTML = `
    ${transaction.text} (${transaction.category})
    <span>${sign}$${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(item);
}

function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  balance.style.color = total >= 0 ? 'green' : 'red';

  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();
updateCategoryOptions();
form.addEventListener('submit', addTransaction);