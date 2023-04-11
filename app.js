const inputForm = document.getElementById('insert-item');
const form = document.getElementById('item-form');
const removeLastBtn = document.getElementById('btn-remove-last');
const ul = document.querySelector('.list');
const placeholder = document.querySelector('.placeholder');
const liContainer = ul.parentElement;
const removeAllBtn = document.getElementById('btn-remove-all');
const filterInput = document.getElementById('filter');
const submitButton = form.querySelector('button');
let IsEditMode = false;

function revealForm() {
  inputForm.style.display = 'block';
  checkUI();
}

function displayFromStorage() {
  const itemsInStorage = getItemsInStorage();
  itemsInStorage.forEach((item) => {
    addItemToDOM(item);
    checkUI();
  });
  revealForm();
}

function createNewItem(e) {
  e.preventDefault();
  const inputValue = inputForm.value;

  //Validate Input

  if (inputForm.value === '') {
    alert('Du måste fylla i någonting');
    return;
  }

  if (IsEditMode) {
    const itemToEdit = ul.querySelector('.edit-mode');
    itemToEdit.remove();

    const text = itemToEdit.firstElementChild.textContent;

    removeItemFromStorage(text);

    IsEditMode = false;
  } else {
    if (checkItemExist(inputValue)) {
      alert('That item aldready exists');
      return;
    }
  }

  //Createitem DOM element
  addItemToDOM(inputValue);

  //Add item to local storage
  createItemForStorage(inputValue);

  inputForm.value = '';
  checkUI();
}

function addItemToDOM(item) {
  const text = createParagraph(item);
  const X = createX();
  const li = document.createElement('li');
  li.classList.add('list-item');
  li.appendChild(text);
  li.appendChild(X);
  ul.appendChild(li);
}

function createParagraph(itemName) {
  const text = document.createElement('p');
  text.innerHTML = itemName;
  return text;
}

function createX() {
  const removeX = document.createElement('i');
  removeX.classList.add('fa-xmark');
  removeX.classList.add('fa-solid');
  return removeX;
}

function getItemsInStorage() {
  let itemsInStorage;
  if (localStorage.getItem('items') === null) {
    itemsInStorage = [];
  } else {
    itemsInStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsInStorage;
}

function createItemForStorage(item) {
  const itemsInStorage = getItemsInStorage();
  itemsInStorage.push(item);
  localStorage.setItem('items', JSON.stringify(itemsInStorage));
}

function filterItems(e) {
  const text = e.target.value.toLowerCase();
  const liItems = document.querySelectorAll('.list-item');
  liItems.forEach((item) => {
    const liText = item.firstChild.textContent.toLowerCase();
    if (liText.indexOf(text) !== -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function removeAllItemsFromStorage() {
  localStorage.removeItem('items');
  checkUI();
}

function removeAllitemsFromDOM(e) {
  while (ul.children.length > 0) {
    ul.firstElementChild.remove();
  }
}

function setItemToEdit(item) {
  IsEditMode = true;

  ul.querySelectorAll('li').forEach((item) =>
    item.classList.remove('edit-mode')
  );

  item.classList.add('edit-mode');
  submitButton.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  submitButton.style.backgroundColor = '#ccc';
  inputForm.value = item.firstElementChild.innerHTML;
}

function onClickItem(e) {
  if (e.target.classList.contains('fa-xmark')) {
    removeItem(e.target.parentElement);
    console.log(e.target);
  } else if (e.target.className === 'list-item') {
    setItemToEdit(e.target);
  }
}

function checkItemExist(item) {
  let itemsInStorage = getItemsInStorage();
  itemsInStorage = itemsInStorage.map((item) => item.toLowerCase());
  if (itemsInStorage.includes(item.toLowerCase())) {
    return true;
  } else {
    return false;
  }
}

function removeItem(item) {
  item.remove();

  removeItemFromStorage(item.firstElementChild.innerHTML);

  checkUI();
}

function removeItemFromStorage(item) {
  let itemsInStorage = getItemsInStorage();
  itemsInStorage = itemsInStorage.filter((listItem) => listItem !== item);
  localStorage.setItem('items', JSON.stringify(itemsInStorage));
}

function removeLastItemFromStorage() {
  const itemsInStorage = getItemsInStorage();
  itemsInStorage.pop();
  localStorage.setItem('items', JSON.stringify(itemsInStorage));
}

const removeLastItem = (e) => {
  const lastItem = document.querySelector('li:last-child');
  lastItem.remove();
  removeLastItemFromStorage();
  checkUI();
};

const checkUI = () => {
  if (ul.children.length === 0) {
    removeLastBtn.style.display = 'none';
    removeAllBtn.style.display = 'none';
    placeholder.style.display = 'block';
    liContainer.classList.add('list-container-empty');
    ul.style.display = 'none';
    inputForm.style.marginTop = '';
    submitButton.style.marginBottom = '20px';
    document.getElementById('filter').hidden = true;
  } else {
    removeLastBtn.style.display = 'block';
    removeAllBtn.style.display = 'block';
    placeholder.style.display = 'none';
    liContainer.classList.remove('list-container-empty');
    ul.style.display = 'flex';
    inputForm.style.marginTop = '20px';
    submitButton.style.marginBottom = '';
    document.getElementById('filter').hidden = false;
  }

  IsEditMode = false;
  submitButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  submitButton.style.backgroundColor = '';
};

function init() {
  liContainer.addEventListener('mouseenter', revealForm);
  form.addEventListener('submit', createNewItem);
  removeLastBtn.addEventListener('click', removeLastItem);
  ul.addEventListener('click', onClickItem);
  removeAllBtn.addEventListener('click', removeAllitemsFromDOM);
  removeAllBtn.addEventListener('click', removeAllItemsFromStorage);
  checkUI();
  filter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayFromStorage);
}

init();
