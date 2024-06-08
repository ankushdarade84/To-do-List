
document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskDateTime = document.getElementById('task-datetime');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    // Set the default value of the date-time input to the current date and time in IST
    setDefaultDateTime();

    // Load tasks from local storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => renderTask(task));

    addTaskBtn.addEventListener('click', addTask);
    taskList.addEventListener('click', handleTaskActions);

    function setDefaultDateTime() {
        const now = new Date();
        const nowIST = new Date(now.getTime() + (5.5 * 60 * 60 * 1000)); // Convert to IST
        taskDateTime.value = nowIST.toISOString().slice(0, 16);
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        const taskDateTimeValue = taskDateTime.value;
        if (taskText === '' || taskDateTimeValue === '') return;

        const task = {
            id: Date.now(),
            text: taskText,
            dateTime: taskDateTimeValue,
            completed: false
        };

        tasks.push(task);
        renderTask(task);
        saveTasks();
        taskInput.value = '';
        setDefaultDateTime(); // Reset to current date and time in IST
    }

    function renderTask(task) {
        const li = document.createElement('li');
        li.classList.add('task');
        if (task.completed) li.classList.add('completed');
        li.dataset.id = task.id;
        li.innerHTML = `
            <span>${task.text}</span>
            <span class="task-datetime">${new Date(task.dateTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
            <div class="task-buttons">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    }

    function handleTaskActions(e) {
        const li = e.target.closest('li');
        const taskId = li.dataset.id;

        if (e.target.classList.contains('delete-btn')) {
            deleteTask(taskId);
        } else if (e.target.classList.contains('edit-btn')) {
            editTask(taskId);
        }
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id != id);
        document.querySelector(`[data-id='${id}']`).remove();
        saveTasks();
    }

    function editTask(id) {
        const task = tasks.find(task => task.id == id);
        const newTaskText = prompt('Edit your task', task.text);
        const newTaskDateTime = prompt('Edit your date and time', task.dateTime);
        if (newTaskText !== null && newTaskDateTime !== null) {
            task.text = newTaskText;
            task.dateTime = newTaskDateTime;
            document.querySelector(`[data-id='${id}'] span`).textContent = newTaskText;
            document.querySelector(`[data-id='${id}'] .task-datetime`).textContent = new Date(newTaskDateTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
            saveTasks();
        }
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
