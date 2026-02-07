const editorTitle = document.getElementById("editor-title");
const editorSubtitle = document.getElementById("editor-subtitle");
const closeEditorButton = document.getElementById("close-editor");

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
