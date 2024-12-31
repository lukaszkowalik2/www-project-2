export const showLoader = () => {
  const loader = document.createElement("div");
  loader.id = "global-loader";
  loader.innerHTML = `
    <div class="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div class="flex flex-col items-center gap-4">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600"></div>
        <div class="text-gray-600 font-medium">Loading...</div>
      </div>
    </div>
  `;
  document.body.appendChild(loader);
  document.body.classList.add("overflow-hidden");
};

export const hideLoader = () => {
  const loader = document.getElementById("global-loader");
  loader?.remove();
  document.body.classList.remove("overflow-hidden");
};
