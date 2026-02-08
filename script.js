const mainMenu = document.getElementById("main-menu");
const projectsView = document.getElementById("projects-view");
const settingsView = document.getElementById("settings-view");
const projectList = document.getElementById("project-list");
const formError = document.getElementById("form-error");
const openProjectsButton = document.getElementById("open-projects");
const openCreateButton = document.getElementById("open-create");
const openSettingsButton = document.getElementById("open-settings");
const backToMainButton = document.getElementById("back-to-main");
const backToMainFromSettingsButton = document.getElementById("back-to-main-from-settings");
const createFromProjectsButton = document.getElementById("create-from-projects");
const createModal = document.getElementById("create-modal");
const cancelCreateButton = document.getElementById("cancel-create");
const projectForm = document.getElementById("project-form");

const STORAGE_KEY = "fortify-mods-projects";

const loadProjects = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return [];
  }
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const saveProjects = (projects) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
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
    return "Внутреннее имя обязательно.";
  }
  if (!regex.test(value)) {
    return "Допустимы только английские строчные буквы и знак _.";
  }
  const duplicate = projects.some((project) => project.appName === value);
  if (duplicate) {
    return "Такое внутреннее имя уже используется.";
  }
  return "";
};

const showSection = (section) => {
  const sections = [mainMenu, projectsView, settingsView];
  sections.forEach((item) => {
    const isActive = item === section;
    item.classList.toggle("hidden", !isActive);
    item.setAttribute("aria-hidden", isActive ? "false" : "true");
  });
  closeCreateModal();
};

const openMainMenu = () => {
  showSection(mainMenu);
};

const openProjects = () => {
  renderProjects();
  showSection(projectsView);
};

const openSettings = () => {
  showSection(settingsView);
};

const openCreateModal = () => {
  createModal.classList.remove("hidden");
  createModal.setAttribute("aria-hidden", "false");
  resetFormError();
};

const closeCreateModal = () => {
  createModal.classList.add("hidden");
  createModal.setAttribute("aria-hidden", "true");
  projectForm.reset();
  resetFormError();
};

let editorWindow = null;
let editorWatcher = null;

const openEditor = (project) => {
  const params = new URLSearchParams({
    displayName: project.displayName,
    appName: project.appName,
  });
  editorWindow = window.open(`editor.html?${params.toString()}`, "_blank");

  if (editorWatcher) {
    clearInterval(editorWatcher);
  }

  editorWatcher = window.setInterval(() => {
    if (!editorWindow || editorWindow.closed) {
      clearInterval(editorWatcher);
      editorWatcher = null;
      editorWindow = null;
      openProjects();
    }
  }, 500);
};

const updateProject = (id, updates) => {
  const projects = loadProjects();
  const updated = projects.map((project) =>
    project.id === id ? { ...project, ...updates } : project
  );
  saveProjects(updated);
  renderProjects();
};

const renderProjects = () => {
  const projects = loadProjects();
  projectList.innerHTML = "";

  if (projects.length === 0) {
    const empty = document.createElement("div");
    empty.className = "project-card";
    empty.innerHTML = `
      <div class="project-info">
        <h3>Проектов пока нет</h3>
        <p>Создайте первый проект, чтобы начать работу.</p>
      </div>
    `;
    projectList.appendChild(empty);
    return;
  }

  projects.forEach((project) => {
    const card = document.createElement("div");
    card.className = "project-card";
    const imageMarkup = project.image
      ? `<img src="${project.image}" alt="${project.displayName}" />`
      : "📁";

    card.innerHTML = `
      <div class="project-header">
        <div class="project-thumb">${imageMarkup}</div>
        <div class="project-info">
          <h3>${project.displayName}</h3>
          <p>Внутреннее имя: ${project.appName}</p>
        </div>
      </div>
      <div class="form-row">
        <label>Внешнее имя</label>
        <input type="text" value="${project.displayName}" data-action="rename" />
      </div>
      <div class="form-row">
        <label>Картинка</label>
        <input type="file" accept="image/*" data-action="image" />
      </div>
      <div class="project-actions">
        <button class="lime-button" data-action="open">Открыть</button>
      </div>
    `;

    const renameInput = card.querySelector("input[data-action='rename']");
    renameInput.addEventListener("change", (event) => {
      const nextName = event.target.value.trim();
      updateProject(project.id, {
        displayName: nextName || project.appName,
      });
    });

    const imageInput = card.querySelector("input[data-action='image']");
    imageInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        updateProject(project.id, { image: reader.result });
      };
      reader.readAsDataURL(file);
    });

    const openButton = card.querySelector("button[data-action='open']");
    openButton.addEventListener("click", () => openEditor(project));

    projectList.appendChild(card);
  });
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
      finalizeProject(projects, displayName, appName, reader.result);
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

  saveProjects([project, ...projects]);
  closeCreateModal();
  openProjects();
};

openProjectsButton.addEventListener("click", openProjects);
openCreateButton.addEventListener("click", openCreateModal);
openSettingsButton.addEventListener("click", openSettings);
backToMainButton.addEventListener("click", openMainMenu);
backToMainFromSettingsButton.addEventListener("click", openMainMenu);
createFromProjectsButton.addEventListener("click", openCreateModal);
cancelCreateButton.addEventListener("click", closeCreateModal);
projectForm.addEventListener("submit", createProject);

openMainMenu();
