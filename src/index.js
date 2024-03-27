import './style.css';
import vcheck from './vcheck.png';
import addImg from './add.svg';
import modifyImg from './modify.svg';
import deleteImg from './delete.svg';

const listsContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const taskTitleElement = document.querySelector('[data-task-title]');
const taskContainer = document.querySelector('[data-tasks]')
const newTaskForm = document.querySelector('[data-new-task-form');
const newTaskInput = document.querySelector('[data-new-task-input]');
const newNameContainer = document.querySelector('[data-new-name-container]')
const newNameTitle = document.querySelector('[data-new-name-title]');
const newNameForm = document.querySelector('[data-new-name-form]');
const newNameInput = document.querySelector('[data-new-name-input]');
const newTaskNameContainer = document.querySelector('[data-new-name-task-container]')
const newTaskNameTitle = document.querySelector('[data-new-name-task-title]');
const newTaskNameForm = document.querySelector('[data-new-name-task-form]');
const newTaskNameInput = document.querySelector('[data-new-name-task-input]');

const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);
let selectedTaskId = null;

listsContainer.addEventListener('click', e => {
    if (e.target.classList.contains('list__name')){
        selectedListId = e.target.parentElement.parentElement.dataset.listId;
        saveAndRender();
    }
});

taskContainer.addEventListener('click', e => {
    if(e.target.tagName.toLowerCase() === 'input') {
        const selectedList = lists.find(list => list.id === selectedListId);
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id);
        selectedTask.complete = e.target.checked;
        saveAndRender();
    }
})

newListForm.addEventListener("submit", e => {
    e.preventDefault();
    const listName = newListInput.value;
    if (listName == null || listName === '') return;
    const list = createList(listName);
    newListInput.value = null;
    lists.push(list);
    saveAndRender();
});

newTaskForm.addEventListener("submit", e => {
    e.preventDefault();
    const taskName = newTaskInput.value;
    if (taskName == null || taskName === '') return;
    const task = createTask(taskName);
    newTaskInput.value = null;
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks.push(task);
    saveAndRender();
});

newNameForm.addEventListener("submit", e => {
    e.preventDefault();
    if (newNameInput.value == null || newNameInput.value === ''){
        newNameContainer.style.display = "none";
    }else{
        const selectedList = lists.find(list => list.id === selectedListId);
        selectedList.name = newNameInput.value;
        newNameInput.value = null;
        newNameContainer.style.display = "none";
        saveAndRender();
    }
});

newTaskNameForm.addEventListener("submit", e => {
    e.preventDefault();
    if (newTaskNameInput.value == null || newTaskNameInput.value === ''){
        newTaskNameContainer.style.display = "none";
    }else{
        const selectedList = lists.find(list => list.id === selectedListId);
        const selectedTask = selectedList.tasks.find(task => task.id === selectedTaskId);
        selectedTask.name = newTaskNameInput.value;
        newTaskNameInput.value = null;
        newTaskNameContainer.style.display = "none";
        saveAndRender();
    }
});

function createList(name) {
   return { id: Date.now().toString(), name: name, tasks: [] };
}

function createTask(name) {
    return { id: Date.now().toString(), name: name, complete: false, priority: false };
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
        taskTitleElement.innerText = `${selectedList.name} - To Do:`;
        clearElement(taskContainer);
        renderTasks(selectedList);
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
        btnModify.dataset.listId = list.id;
        btnModify.classList.add('btn');
        btnModify.addEventListener('click', () => {
            selectedListId = list.id;
            newNameTitle.innerText = `List:${list.name} - New Name:`
            newNameContainer.style.display = 'flex';
            newNameInput.focus();
            saveAndRender();
        })
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

function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task');
        taskContainer.appendChild(taskDiv);
        const priorityClr = document.createElement('span');
        priorityClr.classList.add('priority', task.priority ? 'high__clr' : 'low__clr');
        taskDiv.appendChild(priorityClr);
        priorityClr.addEventListener('click', () => {
            task.priority = !task.priority;
            priorityClr.classList.toggle('high__clr');
            priorityClr.classList.toggle('low__clr');
            saveAndRender();
        });
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.id = task.id;
        checkbox.checked = task.complete;
        taskDiv.appendChild(checkbox);
        const label = document.createElement('label');
        label.setAttribute('for', task.id);
        label.innerText = task.name;
        taskDiv.appendChild(label);
        const btnModify = document.createElement('button');
        btnModify.addEventListener('click', () => {
            selectedTaskId = task.id;
            newTaskNameTitle.innerText = `Task:${task.name} - New Name:`
            newTaskNameContainer.style.display = 'flex';
            newTaskNameInput.focus();
            saveAndRender();
        })
        btnModify.classList.add('btn', 'btn__modify');
        taskDiv.appendChild(btnModify);
        const btnDelete = document.createElement('button');
        btnDelete.classList.add('btn');
        btnDelete.addEventListener('click', () => {
            deleteTask(selectedList, task.id);
        });
        taskDiv.appendChild(btnDelete);
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

function deleteTask(selectedList, taskId) {
    selectedList.tasks = selectedList.tasks.filter(task => task.id !== taskId);
    saveAndRender();
}

render();

