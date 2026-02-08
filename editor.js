const editorTitle = document.getElementById("editor-title");
const editorSubtitle = document.getElementById("editor-subtitle");
const closeEditorButton = document.getElementById("close-editor");
const createButton = document.getElementById("create-button");
const createDropdown = document.getElementById("create-dropdown");

const params = new URLSearchParams(window.location.search);
const displayName = params.get("displayName");
const appName = params.get("appName");

if (displayName || appName) {
  editorTitle.textContent = displayName || appName;
  if (appName) {
    editorSubtitle.textContent = `Файлы проекта "${appName}" готовы к работе.`;
  }
}

closeEditorButton.addEventListener("click", () => {
  window.close();
});

createButton.addEventListener("click", () => {
  createDropdown.classList.toggle("active");
});

window.addEventListener("click", (event) => {
  if (!event.target.closest(".create-menu")) {
    createDropdown.classList.remove("active");
  }
});
