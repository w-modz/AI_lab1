// Initialize task list from Local Storage or empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Function to save tasks to Local Storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to render task list
function renderTasks(filteredTasks = null) {
    const taskList = document.getElementById('taskList');
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const tasksToRender = filteredTasks || tasks;

    taskList.innerHTML = '';

    tasksToRender.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item';

        // Create task content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'task-content';

        // Highlight search phrase
        if (searchQuery && searchQuery.length >= 2) {
            const regex = new RegExp(`(${searchQuery})`, 'gi');
            contentDiv.innerHTML = task.content.replace(regex, '<span class="highlight">$1</span>');
        } else {
            contentDiv.textContent = task.content;
        }

        // Add deadline if exists
        if (task.deadline) {
            const deadline = new Date(task.deadline);
            contentDiv.innerHTML += `<br><small>Deadline: ${deadline.toLocaleString()}</small>`;
        }

        // Handle task editing
        contentDiv.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = task.content;
            input.style.width = '80%';

            const saveEdit = () => {
                const newContent = input.value.trim();
                if (validateTask(newContent)) {
                    tasks[index].content = newContent;
                    saveTasks();
                    renderTasks();
                }
            };

            input.addEventListener('blur', saveEdit);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    saveEdit();
                }
            });

            contentDiv.innerHTML = '';
            contentDiv.appendChild(input);
            input.focus();
        });

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '🗑️';
        deleteBtn.addEventListener('click', () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// Task validation function
function validateTask(content, deadline = null) {
    if (content.length < 3) {
        alert('Task must be at least 3 characters long!');
        return false;
    }
    if (content.length > 255) {
        alert('Task cannot be longer than 255 characters!');
        return false;
    }
    if (deadline) {
        const deadlineDate = new Date(deadline);
        const now = new Date();
        if (deadlineDate <= now) {
            alert('Deadline must be in the future!');
            return false;
        }
    }
    return true;
}

// Function to add new task
function addTask() {
    const contentInput = document.getElementById('newTaskInput');
    const deadlineInput = document.getElementById('taskDeadline');
    const content = contentInput.value.trim();
    const deadline = deadlineInput.value;

    if (validateTask(content, deadline)) {
        tasks.push({
            content,
            deadline: deadline || null,
            createdAt: new Date().toISOString()
        });
        
        saveTasks();
        renderTasks();
        
        // Clear form fields
        contentInput.value = '';
        deadlineInput.value = '';
    }
}

// Search handling
document.getElementById('searchInput').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    if (query.length >= 2) {
        const filteredTasks = tasks.filter(task => 
            task.content.toLowerCase().includes(query)
        );
        renderTasks(filteredTasks);
    } else {
        renderTasks();
    }
});

// Function to set default date to tomorrow
function setDefaultDate() {
    const now = new Date();
    // Set date to tomorrow
    now.setDate(now.getDate() + 1);
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const defaultDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    document.getElementById('taskDeadline').value = defaultDateTime;
}

// Initial task rendering and default date setting
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    setDefaultDate();
});