 // DOM elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const filterButtons = document.querySelectorAll('.filter-btn');
const pendingCountEl = document.getElementById('pendingCount');
const completedCountEl = document.getElementById('completedCount');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all'; // all, pending, completed

document.addEventListener('DOMContentLoaded', renderTasks);
addTaskBtn.addEventListener('click', addTask);
clearCompletedBtn.addEventListener('click', clearCompletedTasks);
filterButtons.forEach(btn => btn.addEventListener('click', filterTasks));

// Function to add a new task
function addTask() {
    const taskText = taskInput.value;
    if (taskText === '') return;

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = '';

    saveTasks();
    renderTasks();
}

// Function to render tasks based on the filter
function renderTasks() {
    taskList.innerHTML = '';
    let filteredTasks = tasks;

    if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.textContent = task.text;

        const actions = document.createElement('div');
        actions.classList.add('task-actions');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit-btn');
        editBtn.onclick = () => editTask(task.id);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = () => deleteTask(task.id);

        const completeBtn = document.createElement('button');
        completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
        completeBtn.classList.add('complete-btn');
        completeBtn.onclick = () => toggleCompleteTask(task.id);

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        actions.appendChild(completeBtn);

        taskItem.appendChild(actions);

        if (task.completed) {
            taskItem.classList.add('completed');
        }

        taskList.appendChild(taskItem);
    });

    updateCounters();
}

// Function to edit a task
function editTask(id) {
    const taskText = prompt('Edit task:');
    if (taskText === null || taskText.trim() === '') return;

    tasks = tasks.map(task => task.id === id ? { ...task, text: taskText } : task);
    saveTasks();
    renderTasks();
}

// Function to delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Function to toggle completion status
function toggleCompleteTask(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    saveTasks();
    renderTasks();
}

// Function to clear completed tasks
function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

// Function to filter tasks
function filterTasks(e) {
    filter = e.target.id === 'filterAll' ? 'all' : e.target.id === 'filterPending' ? 'pending' : 'completed';
    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    renderTasks();
}

// Function to update pending and completed task counters
function updateCounters() {
    const pendingCount = tasks.filter(task => !task.completed).length;
    const completedCount = tasks.filter(task => task.completed).length;
    pendingCountEl.textContent = pendingCount;
    completedCountEl.textContent = completedCount;
}

// Function to save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


 