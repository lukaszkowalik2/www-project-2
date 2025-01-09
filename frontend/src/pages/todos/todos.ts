import invariant from "tiny-invariant";

import { checkTokenValidity } from "../../utils/auth.js";
import { createTodo, deleteTodo, getAllTodos, updateTodo } from "../../services/todos.services.js";

import type { Todo, TodoStatus } from "../../types/todo.js";
import { showAlert } from "../../utils/notifications.js";

let userId: number | undefined;

async function callback(result: { valid: boolean; userId?: number }) {
  if (!result.valid) {
    window.location.href = "/src/pages/login";
  }
  userId = result.userId;
  await loadTodos();
  setupEventListeners();
}

checkTokenValidity(callback);

async function loadTodos() {
  try {
    invariant(userId, "User ID is not set");

    const response = await getAllTodos(userId);
    renderTodos(response.items);
  } catch (error) {
    console.error("Failed to load todos:", error);
    showAlert("Failed to load todos", "error");
  }
}

function renderTodos(todos: Todo[]) {
  const todoList = document.getElementById("todoList")!;
  todoList.innerHTML = todos
    .map(
      (todo) => `
        <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden" data-todo-id="${todo.id}">
          <div class="p-4 sm:p-6">
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-800 mb-1">${todo.title}</h3>
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">${todo.description || "No description"}</p>
                <div class="flex flex-wrap items-center gap-2">
                  <span class="px-2.5 py-1 text-sm rounded-full ${getStatusColor(todo.status)}">${todo.status}</span>
                  ${
                    todo.due_date
                      ? `<span class="text-sm text-gray-500 flex items-center gap-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Due: ${new Date(todo.due_date).toLocaleDateString()}
                        </span>`
                      : ""
                  }
                </div>
              </div>
              <div class="flex items-center gap-2 sm:flex-col sm:items-end">
                <button class="edit-todo-btn text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                <button class="delete-todo-btn text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
              </div>
            </div>
          </div>
        </div>
      `
    )
    .join("");
}

function getStatusColor(status: TodoStatus): string {
  const colors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };
  return colors[status];
}

function setupEventListeners() {
  const addTodoBtn = document.getElementById("addTodoBtn")!;
  addTodoBtn.addEventListener("click", showAddTodoModal);

  document.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;

    if (target.classList.contains("edit-todo-btn")) {
      const todoId = Number(target.closest("[data-todo-id]")?.getAttribute("data-todo-id"));
      if (todoId) showEditTodoModal(todoId);
    }

    if (target.classList.contains("delete-todo-btn")) {
      const todoId = Number(target.closest("[data-todo-id]")?.getAttribute("data-todo-id"));
      if (todoId) await handleDeleteTodo(todoId);
    }
  });

  setupModalEventListeners();
}

function showAddTodoModal() {
  const modal = document.getElementById("todoModal")!;
  const form = document.getElementById("todoForm") as HTMLFormElement;
  const modalTitle = document.getElementById("modalTitle")!;
  const submitBtnText = document.getElementById("submitBtnText")!;

  modalTitle.textContent = "Add Todo";
  submitBtnText.textContent = "Create";
  form.reset();
  delete form.dataset.todoId;

  modal.classList.remove("hidden");
  modal.classList.add("flex");

  // Focus on title input
  const titleInput = form.querySelector('[name="title"]') as HTMLInputElement;
  titleInput.focus();
}

async function showEditTodoModal(todoId: number) {
  const modal = document.getElementById("todoModal")!;
  const form = document.getElementById("todoForm") as HTMLFormElement;
  const modalTitle = document.getElementById("modalTitle")!;
  const submitBtnText = document.getElementById("submitBtnText")!;

  try {
    const todos = (await getAllTodos(userId!)).items;
    const todo = todos.find((t) => t.id === todoId);

    if (!todo) {
      showAlert("Todo not found", "error");
      return;
    }

    // Set form values
    const titleInput = form.querySelector('[name="title"]') as HTMLInputElement;
    const descriptionInput = form.querySelector('[name="description"]') as HTMLTextAreaElement;
    const statusInput = form.querySelector('[name="status"]') as HTMLSelectElement;
    const dueDateInput = form.querySelector('[name="due_date"]') as HTMLInputElement;

    titleInput.value = todo.title;
    descriptionInput.value = todo.description || "";
    statusInput.value = todo.status;

    if (todo.due_date) {
      // Convert ISO string to local datetime-local format
      const dueDate = new Date(todo.due_date);
      const year = dueDate.getFullYear();
      const month = String(dueDate.getMonth() + 1).padStart(2, "0");
      const day = String(dueDate.getDate()).padStart(2, "0");
      const hours = String(dueDate.getHours()).padStart(2, "0");
      const minutes = String(dueDate.getMinutes()).padStart(2, "0");
      dueDateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    } else {
      dueDateInput.value = "";
    }

    modalTitle.textContent = "Edit Todo";
    submitBtnText.textContent = "Update";
    form.dataset.todoId = todoId.toString();

    // Show modal with animation
    modal.classList.remove("hidden");
    modal.classList.add("flex");

    // Focus on title input
    titleInput.focus();
  } catch (error) {
    console.error("Failed to load todo details:", error);
    showAlert("Failed to load todo details", "error");
  }
}

function setupModalEventListeners() {
  const modal = document.getElementById("todoModal")!;
  const form = document.getElementById("todoForm") as HTMLFormElement;
  const cancelBtn = document.getElementById("cancelTodoBtn")!;

  const closeModal = () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    form.reset();
    delete form.dataset.todoId;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const todoId = form.dataset.todoId;

    invariant(userId, "User ID is not set");

    const todoData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as TodoStatus,
      due_date: new Date(formData.get("due_date") as string).toISOString(),
      user_id: userId,
    };

    try {
      if (todoId) {
        await updateTodo(Number(todoId), todoData);
      } else {
        invariant(userId, "User ID is not set");

        await createTodo(userId, todoData);
      }
      closeModal();
      loadTodos();
      showAlert(`Todo ${todoId ? "updated" : "created"} successfully`, "success");
    } catch (error) {
      console.error(`Failed to ${todoId ? "update" : "create"} todo:`, error);
      showAlert(`Failed to ${todoId ? "update" : "create"} todo`, "error");
    }
  });

  cancelBtn.addEventListener("click", closeModal);
}

async function handleDeleteTodo(todoId: number) {
  if (confirm("Are you sure you want to delete this todo?")) {
    try {
      await deleteTodo(todoId);
      loadTodos();
      showAlert("Todo deleted successfully", "success");
    } catch (error) {
      console.error("Failed to delete todo:", error);
      showAlert("Failed to delete todo", "error");
    }
  }
}
