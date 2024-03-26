import './style.css';
import vcheck from './vcheck.png';
import addImg from './add.svg';
import modifyImg from './modify.svg';
import deleteImg from './delete.svg';

const listsContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const taskDisplayContainer = document.querySelector('[data-task-display-container]');
const taskTitleElement = document.querySelector('[data-task-title]');
const taskContainer = document.querySelector('[data-tasks]')


const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

listsContainer.addEventListener('click', e => {
    if (e.target.classList.contains('list__name')){
        selectedListId = e.target.parentElement.parentElement.dataset.listId;
        saveAndRender();
    }
});



newListForm.addEventListener("submit", e => {
    e.preventDefault();
    const listName = newListInput.value;
    if (listName == null || listName === '') return;
    const list = createList(listName);
    newListInput.value = null;
    lists.push(list);
    saveAndRender();
});

function createList(name) {
   return { id: Date.now().toString(), name: name, tasks: [] };
}

function saveAndRender() {
    save();
    render();
}

function save () {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

function render() {
    clearElement(listsContainer);
    renderLists();
    
    const selectedList = lists.find(list => list.id === selectedListId);
    if (!selectedListId || !selectedList) {
        taskTitleElement.innerText = `Your Tasks`;
        taskContainer.innerHTML = '';
    }else {
        console.log(selectedList)
        taskTitleElement.innerText = `${selectedList.name} - To Do:`;
    }
}

function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement('li');
        listElement.dataset.listId = list.id;
        if (list.id === selectedListId){
            listElement.classList.add('list__active');
        }
        listsContainer.appendChild(listElement);
        const listDiv = document.createElement('div');
        listDiv.classList.add('list');
        listElement.appendChild(listDiv);
        const listName = document.createElement('p');
        listName.classList.add('list__name');
        listName.innerText = list.name;
        listDiv.appendChild(listName);
        const btnModify = document.createElement('button');
        btnModify.classList.add('btn');
        listDiv.appendChild(btnModify);
        const btnDelete = document.createElement('button');
        btnDelete.classList.add('btn');
        btnDelete.addEventListener('click', () => {
            const listId = listElement.dataset.listId;
            deleteList(listId);
        });
        listDiv.appendChild(btnDelete);
        const modifySvg = document.createElement('img');
        modifySvg.classList.add('svg');
        modifySvg.src = modifyImg;
        btnModify.appendChild(modifySvg);
        const deleteSvg = document.createElement('img');
        deleteSvg.classList.add('svg');
        deleteSvg.src = deleteImg;
        btnDelete.appendChild(deleteSvg);
    });
}

function clearElement(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function deleteList(listId) {
    lists = lists.filter(list => list.id !== listId);
    saveAndRender();
}

render();

