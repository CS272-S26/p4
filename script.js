// =======================
// GLOBAL DATA
// =======================
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update task count on pages with #task-count
function updateTaskCount() {
  const taskCount = document.getElementById("task-count");
  if (taskCount) {
    taskCount.innerText = tasks.length;
  }
}

// =======================
// TASKS PAGE
// =======================
function renderTasks(filterCourse = "") {
  const list = document.getElementById("task-list");
  const emptyMsg = document.getElementById("empty-msg");

  if (!list) return;

  list.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    return !filterCourse || task.course.toLowerCase().includes(filterCourse.toLowerCase());
  });

  if (filteredTasks.length === 0) {
    if (emptyMsg) {
      emptyMsg.style.display = "block";
      emptyMsg.innerText = filterCourse ? "No tasks match this course." : "No tasks yet.";
    }
    updateTaskCount();
    return;
  }

  if (emptyMsg) {
    emptyMsg.style.display = "none";
  }

  filteredTasks.forEach(task => {
    const realIndex = tasks.indexOf(task);

    const li = document.createElement("li");
    li.className = "list-group-item task-item d-flex justify-content-between align-items-center";

    if (task.priority === "High") {
      li.classList.add("high-priority");
    }

    li.innerHTML = `
      <div>
        <strong>${task.name}</strong><br>
        <small>${task.date ? "Due: " + task.date : "No due date"}</small>
        ${task.course ? `<br><span class="badge bg-primary">${task.course}</span>` : ""}
        ${task.priority ? `<span class="badge bg-warning text-dark ms-1">${task.priority}</span>` : ""}
      </div>

      <div>
        <button class="btn btn-outline-success btn-sm complete-btn">Done</button>
        <button class="btn btn-warning btn-sm edit-btn">Edit</button>
        <button class="btn btn-danger btn-sm delete-btn">Delete</button>
      </div>
    `;

    li.querySelector(".delete-btn").addEventListener("click", () => {
      tasks.splice(realIndex, 1);
      saveTasks();
      renderTasks(filterCourse);
      renderDeadlines();
      updateTaskCount();
    });

    li.querySelector(".edit-btn").addEventListener("click", () => {
      const newName = prompt("Edit task name:", task.name);

      if (newName && newName.trim() !== "") {
        tasks[realIndex].name = newName.trim();
        saveTasks();
        renderTasks(filterCourse);
        renderDeadlines();
        updateTaskCount();
      }
    });

    li.querySelector(".complete-btn").addEventListener("click", () => {
      li.classList.toggle("text-decoration-line-through");
      li.classList.toggle("text-muted");
    });

    list.appendChild(li);
  });

  updateTaskCount();
}

// Add task form
const taskForm = document.getElementById("task-form");

if (taskForm) {
  taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("task-name").value.trim();
    const date = document.getElementById("task-date").value;
    const course = document.getElementById("task-course").value.trim();
    const priority = document.getElementById("task-priority").value;

    if (name === "") {
      alert("Please enter a task name.");
      return;
    }

    tasks.push({
      name: name,
      date: date,
      course: course,
      priority: priority
    });

    saveTasks();
    renderTasks();
    renderDeadlines();
    updateTaskCount();

    taskForm.reset();
  });
}

// Filter tasks
const filterInput = document.getElementById("filter-course");

if (filterInput) {
  filterInput.addEventListener("input", () => {
    renderTasks(filterInput.value);
  });
}

// =======================
// INDEX PAGE
// =======================
updateTaskCount();

const quote = document.getElementById("quote");

if (quote) {
  fetch("data.json")
    .then(response => response.json())
    .then(data => {
      const randomIndex = Math.floor(Math.random() * data.quotes.length);
      quote.innerText = data.quotes[randomIndex];
    })
    .catch(() => {
      quote.innerText = "Plan your work, then work your plan.";
    });
}

// =======================
// COURSES PAGE
// =======================
const courseContainer = document.getElementById("course-list");

if (courseContainer) {
  const courses = [
    {
      name: "CS272",
      desc: "Intro to Web Development",
      credits: 3,
      type: "Web Development"
    },
    {
      name: "ECON 310",
      desc: "Statistics and Econometrics",
      credits: 4,
      type: "Economics"
    },
    {
      name: "STAT 340",
      desc: "Data Science Modeling",
      credits: 3,
      type: "Data Science"
    },
    {
      name: "INFO 340",
      desc: "User Experience and Information Design",
      credits: 3,
      type: "Information Science"
    }
  ];

  courses.forEach(course => {
    const col = document.createElement("div");
    col.className = "col-md-4";

    col.innerHTML = `
      <article class="card feature-card h-100 p-3">
        <h5>${course.name}</h5>
        <p>${course.desc}</p>
        <p><strong>Credits:</strong> ${course.credits}</p>
        <span class="badge bg-secondary">${course.type}</span>
      </article>
    `;

    courseContainer.appendChild(col);
  });
}

// =======================
// CALENDAR PAGE
// =======================
function renderDeadlines() {
  const deadlineList = document.getElementById("deadline-list");

  if (!deadlineList) return;

  deadlineList.innerHTML = "";

  const tasksWithDates = tasks
    .filter(task => task.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (tasksWithDates.length === 0) {
    deadlineList.innerHTML = `<p class="text-muted">No deadlines saved yet.</p>`;
    return;
  }

  tasksWithDates.forEach(task => {
    const item = document.createElement("div");
    item.className = "deadline-item";

    if (task.priority === "High") {
      item.classList.add("high-priority");
    }

    item.innerHTML = `
      <strong>${task.name}</strong>
      <p>Due date: ${task.date}</p>
      ${task.course ? `<p>Course: ${task.course}</p>` : ""}
      ${task.priority ? `<p>Priority: ${task.priority}</p>` : ""}
    `;

    deadlineList.appendChild(item);
  });
}

// =======================
// CONTACT PAGE
// =======================
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("contact-name").value.trim();
    const message = document.getElementById("contact-message").value.trim();
    const result = document.getElementById("contact-result");

    if (name === "" || message === "") {
      alert("Please complete the form.");
      return;
    }

    localStorage.setItem("contactMessage", message);

    if (result) {
      result.innerText = `Thank you, ${name}. Your message was saved successfully.`;
    }

    contactForm.reset();
  });
}

// =======================
// PROFILE PAGE
// =======================
const profileForm = document.getElementById("profile-form");

if (profileForm) {
  profileForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("profile-name").value.trim();
    const major = document.getElementById("profile-major").value.trim();
    const goal = document.getElementById("profile-goal").value.trim();

    localStorage.setItem("profileName", name);
    localStorage.setItem("profileMajor", major);
    localStorage.setItem("profileGoal", goal);

    showProfile();
    profileForm.reset();
  });
}

function showProfile() {
  const profileResult = document.getElementById("profile-result");

  if (!profileResult) return;

  const name = localStorage.getItem("profileName");
  const major = localStorage.getItem("profileMajor");
  const goal = localStorage.getItem("profileGoal");

  if (!name && !major && !goal) {
    profileResult.innerHTML = `<p class="text-muted">No profile saved yet.</p>`;
    return;
  }

  profileResult.innerHTML = `
    <div class="card p-3 mt-3">
      <h5>${name || "Student"}</h5>
      <p><strong>Major:</strong> ${major || "Not added yet"}</p>
      <p><strong>Goal:</strong> ${goal || "Not added yet"}</p>
    </div>
  `;
}

// =======================
// INITIAL RENDER
// =======================
renderTasks();
renderDeadlines();
showProfile();