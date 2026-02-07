const projectForm = document.getElementById("project-form");
const projectList = document.getElementById("project-list");
const projectCount = document.getElementById("project-count");
const formError = document.getElementById("form-error");
const menu = document.getElementById("project-menu");
const openMenuButton = document.getElementById("open-menu");

const STORAGE_KEY = "fortify-mods-projects";

const loadProjects = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return [];
  }
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (error) {
    return [];
  }
};

const saveProjects = (projects) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

const updateProjectCount = (count) => {
  projectCount.textContent = `${count} проектов`;
};

const renderProjects = () => {
  const projects = loadProjects();
  projectList.innerHTML = "";
  if (projects.length === 0) {
    const empty = document.createElement("div");
    empty.className = "project-card";
    empty.innerHTML = `
      <div class="project-thumb">+</div>
      <div class="project-info">
        <h3>Нет проектов</h3>
        <p>Создайте первый проект, чтобы начать работать.</p>
      </div>
    `;
    projectList.appendChild(empty);
  } else {
    projects.forEach((project) => {
      const card = document.createElement("div");
      card.className = "project-card";
      card.innerHTML = `
        <div class="project-thumb">
          ${project.image ? `<img src="${project.image}" alt="${project.displayName}" />` : "📁"}
        </div>
        <div class="project-info">
          <h3>${project.displayName}</h3>
          <p>Внутреннее имя: ${project.appName}</p>
        </div>
      `;
      card.addEventListener("click", () => openEditor(project));
      projectList.appendChild(card);
    });
  }
  updateProjectCount(projects.length);
};

const resetFormError = () => {
  formError.textContent = "";
};

const showFormError = (message) => {
  formError.textContent = message;
};

const validateAppName = (value, projects) => {
  const regex = /^[a-z_]+$/;
  if (!value) {
    return "Название проекта внутри приложения обязательно.";
  }
  if (!regex.test(value)) {
    return "Допустимы только английские строчные буквы и знак _.";
  }
  const duplicate = projects.some((project) => project.appName === value);
  if (duplicate) {
    return "Такое внутреннее название уже используется другим проектом.";
  }
  return "";
};

let editorWindow = null;
let editorWatcher = null;

const openEditor = (project) => {
  const params = new URLSearchParams({
    displayName: project.displayName,
    appName: project.appName,
  });
  editorWindow = window.open(`editor.html?${params.toString()}`, "_blank");
  menu.classList.add("hidden");
  menu.setAttribute("aria-hidden", "true");

  if (editorWatcher) {
    clearInterval(editorWatcher);
  }

  editorWatcher = window.setInterval(() => {
    if (!editorWindow || editorWindow.closed) {
      clearInterval(editorWatcher);
      editorWatcher = null;
      editorWindow = null;
      menu.classList.remove("hidden");
      menu.setAttribute("aria-hidden", "false");
    }
  }, 500);
};

const createProject = (event) => {
  event.preventDefault();
  resetFormError();

  const projects = loadProjects();
  const displayNameInput = document.getElementById("project-name");
  const appNameInput = document.getElementById("project-app-name");
  const imageInput = document.getElementById("project-image");

  const displayName = displayNameInput.value.trim();
  const appName = appNameInput.value.trim();

  const validationMessage = validateAppName(appName, projects);
  if (validationMessage) {
    showFormError(validationMessage);
    return;
  }

  const imageFile = imageInput.files[0];
  if (imageFile) {
    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result;
      finalizeProject(projects, displayName, appName, imageData);
    };
    reader.readAsDataURL(imageFile);
  } else {
    finalizeProject(projects, displayName, appName, "");
  }
};

const finalizeProject = (projects, displayName, appName, image) => {
  const project = {
    id: crypto.randomUUID(),
    displayName: displayName || appName,
    appName,
    image,
    createdAt: new Date().toISOString(),
    projectFile: `${appName}.fortify`,
  };

  const updatedProjects = [project, ...projects];
  saveProjects(updatedProjects);
  renderProjects();
  projectForm.reset();
  openEditor(project);
};

const showMenuIfAvailable = () => {
  if (!editorWindow || editorWindow.closed) {
    menu.classList.remove("hidden");
    menu.setAttribute("aria-hidden", "false");
  }
};

projectForm.addEventListener("submit", createProject);
projectForm.addEventListener("reset", resetFormError);
openMenuButton.addEventListener("click", showMenuIfAvailable);

renderProjects();
