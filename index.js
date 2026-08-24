const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const taskCount = document.getElementById("taskCount");
const clearBtn = document.getElementById("clearBtn");
const filterButtons = document.querySelectorAll(".filter");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

// Add Todo
function addTodo() {
    const text = todoInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(todo);

    saveTodos();
    renderTodos();

    todoInput.value = "";
    todoInput.focus();
}

// Display Todos
function renderTodos() {
    todoList.innerHTML = "";

    let filteredTodos = todos;

    if (currentFilter === "pending") {
        filteredTodos = todos.filter(todo => !todo.completed);
    }

    if (currentFilter === "completed") {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    filteredTodos.forEach(todo => {
        const li = document.createElement("li");

        li.className = `todo-item ${
            todo.completed ? "completed" : ""
        }`;

        li.innerHTML = `
            <input 
                type="checkbox"
                ${todo.completed ? "checked" : ""}
                onchange="toggleTodo(${todo.id})"
            >

            <span class="todo-text">${escapeHTML(todo.text)}</span>

            <button 
                class="delete-btn"
                onclick="deleteTodo(${todo.id})"
            >
                Delete
            </button>
        `;

        todoList.appendChild(li);
    });

    updateCount();
}

// Toggle Todo
function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            todo.completed = !todo.completed;
        }

        return todo;
    });

    saveTodos();
    renderTodos();
}

// Delete Todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);

    saveTodos();
    renderTodos();
}

// Clear Completed
function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);

    saveTodos();
    renderTodos();
}

// Update Task Count
function updateCount() {
    const pending = todos.filter(todo => !todo.completed).length;

    taskCount.textContent =
        `${pending} ${pending === 1 ? "task" : "tasks"} remaining`;
}

// Save Todos
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Filter
filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTodos();
    });
});

// Add button
addBtn.addEventListener("click", addTodo);

// Enter key
todoInput.addEventListener("keypress", event => {
    if (event.key === "Enter") {
        addTodo();
    }
});

// Clear completed
clearBtn.addEventListener("click", clearCompleted);

// Prevent HTML injection
function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Initial render
renderTodos();