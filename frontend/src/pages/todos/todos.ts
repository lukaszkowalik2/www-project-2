import invariant from "tiny-invariant";

import { checkTokenValidity } from "../../utils/auth.js";
import { createTodo, deleteTodo, getAllTodos, updateTodo } from "../../services/todos.services.js";
import { getUser } from "../../services/user.services.js";
import { showAlert } from "../../utils/notifications.js";
import { logout } from "../../services/auth.services.js";
import { ROUTES } from "../../constants.js";

import type { Todo, TodoStatus } from "../../types/todo.js";

let userId: number | undefined;

async function callback(result: { valid: boolean; userId?: number }) {
  if (!result.valid) {
    window.location.href = ROUTES.LOGIN;
    return;
  }
  userId = result.userId;

  try {
    invariant(userId, "User ID is not set");

    const userData = await getUser(userId);
    document.getElementById("userEmail")!.textContent = userData.item.name;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }

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
  const sections = {
    PENDING: document.getElementById("pendingTodos")!,
    IN_PROGRESS: document.getElementById("inProgressTodos")!,
    COMPLETED: document.getElementById("completedTodos")!,
    CANCELLED: document.getElementById("cancelledTodos")!,
  };

  const counts = {
    PENDING: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  };

  Object.values(sections).forEach((section) => {
    section.innerHTML = "";
  });

  todos.sort((a, b) => {
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  todos.forEach((todo) => {
    counts[todo.status]++;
    sections[todo.status].innerHTML += `
      <div class="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow transition-shadow duration-200 overflow-hidden" data-todo-id="${todo.id}">
        <div class="p-4">
          <div class="flex flex-col gap-2">
            <div class="flex items-start justify-between gap-2">
              <h3 class="text-sm font-medium text-gray-800">${todo.title}</h3>
              <div class="flex items-center gap-1">
                <button class="edit-todo-btn text-blue-600 hover:text-blue-800 p-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button class="delete-todo-btn text-red-600 hover:text-red-800 p-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
            ${todo.description ? `<p class="text-xs text-gray-600 line-clamp-2">${todo.description}</p>` : ""}
            ${
              todo.due_date
                ? `
              <div class="flex items-center gap-1 text-xs text-gray-500">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                ${new Date(todo.due_date).toLocaleDateString()}
              </div>
            `
                : ""
            }
          </div>
        </div>
      </div>
    `;
  });

  Object.entries(counts).forEach(([status, count]) => {
    const countElement = document.getElementById(`${status.toLowerCase()}Count`);
    if (countElement) {
      countElement.textContent = String(count);
    }
  });
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

  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn?.addEventListener("click", logout);

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

    const titleInput = form.querySelector('[name="title"]') as HTMLInputElement;
    const descriptionInput = form.querySelector('[name="description"]') as HTMLTextAreaElement;
    const statusInput = form.querySelector('[name="status"]') as HTMLSelectElement;
    const dueDateInput = form.querySelector('[name="due_date"]') as HTMLInputElement;

    titleInput.value = todo.title;
    descriptionInput.value = todo.description || "";
    statusInput.value = todo.status;

    if (todo.due_date) {
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

    modal.classList.remove("hidden");
    modal.classList.add("flex");

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
