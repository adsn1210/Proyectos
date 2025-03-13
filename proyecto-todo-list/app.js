"use strict";

// SELECIONAR ELEMENTOS DEL DOM
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const showAll = document.getElementById("show-all");
const showCompleted = document.getElementById("show-completed");
const showPending = document.getElementById("show-pending");

// Cargar tareas desde LocalStorage al iniciar
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Generar un ID único para cada tarea
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

// Función para guardar tareas en LocalStorage
const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Función para renderizar tareas
const renderTasks = (filter = "all") => {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter((task) => {
        if (filter === "completed") return task.completed;
        if (filter === "pending") return !task.completed;
        return true;
    });

    filteredTasks.forEach((task) => {
        const li = document.createElement("li");
        li.textContent = task.text;
        if (task.completed) {
            li.classList.add("completed");
        }

        // Botón para eliminar tarea
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter((t) => t.id !== task.id);
            saveTasks();
            renderTasks(filter); // Mantén el filtro activo después de la eliminación
        });

        // Botón para marcar como completada
        const completeButton = document.createElement("button");
        completeButton.textContent = task.completed ? "Desmarcar" : "Completar";
        completeButton.addEventListener("click", () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks(filter); // Mantén el filtro activo después de actualizar
        });

        li.appendChild(completeButton);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });
};

// Añadir nueva tarea
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        tasks.push({ id: generateId(), text: taskText, completed: false });
        saveTasks();
        renderTasks();
        taskInput.value = "";
    }
});

// Filtros
showAll.addEventListener("click", () => renderTasks("all"));
showCompleted.addEventListener("click", () => renderTasks("completed"));
showPending.addEventListener("click", () => renderTasks("pending"));

// Renderizar tareas al cargar la página
renderTasks();

console.log(tasks);
