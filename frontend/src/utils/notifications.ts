import clsx from "clsx";

type AlertType = "success" | "error" | "warning" | "info";

export const showAlert = (message: string, type: AlertType = "info") => {
  const existingAlert = document.getElementById("alert");
  if (existingAlert) {
    existingAlert.remove();
  }

  const alertContainer = document.createElement("div");
  alertContainer.id = "alert";
  alertContainer.className = "fixed top-4 right-4 rounded-lg shadow-lg transform transition-all duration-300 translate-y-[-100%] z-50";

  const alertElement = document.createElement("div");
  alertContainer.appendChild(alertElement);

  const baseStyles = "flex items-center p-4 text-white rounded-lg";
  const typeStyles = {
    success: "bg-green-500 border-l-4 border-green-700",
    error: "bg-red-500 border-l-4 border-red-700",
    warning: "bg-yellow-500 border-l-4 border-yellow-700",
    info: "bg-blue-500 border-l-4 border-blue-700",
  };

  const icons = {
    success: '<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>',
    error:
      '<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/></svg>',
    warning:
      '<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"/></svg>',
    info: '<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/></svg>',
  };

  alertElement.className = clsx(baseStyles, typeStyles[type]);
  alertElement.innerHTML = `
    <div class="flex items-center">
      ${icons[type]}
      <div class="flex-1">${message}</div>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200 focus:outline-none">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(alertContainer);

  requestAnimationFrame(() => {
    alertContainer.style.transform = "translateY(0)";
  });

  const timeout = setTimeout(() => {
    alertContainer.style.transform = "translateY(-110%)";
    setTimeout(() => {
      alertContainer.remove();
    }, 300);
  }, 5000);

  alertContainer.querySelector("button")?.addEventListener("click", () => {
    clearTimeout(timeout);
  });
};
