// =======================
// ⭐ DATA
// =======================
let tasks = [];

// ⭐ Load tasks from localStorage
if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
}

// =======================
// ⭐ SAVE FUNCTION
// =======================
function saveTasks() {
  // Save tasks so data persists after refresh
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// =======================
// ⭐ TASKS PAGE LOGIC
// =======================
function renderTasks(filterCourse = "") {
  const list = document.getElementById("task-list");
  if (!list) return;

  list.innerHTML = "";

  tasks
    .filter(task => !filterCourse || task.course === filterCourse)
    .forEach((task, index) => {

      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";

      li.innerHTML = `
        <div>
          <strong>${task.name}</strong><br>
          ${task.date ? "Due: " + task.date : ""}
          ${task.course ? "<br>Course: " + task.course : ""}
        </div>
        <div>
          <button class="btn btn-warning btn-sm edit-btn">Edit</button>
          <button class="btn btn-danger btn-sm delete-btn">Delete</button>
        </div>
      `;

      // delete
      li.querySelector(".delete-btn").addEventListener("click", () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      });

      // ⭐ edit（加分点）
      li.querySelector(".edit-btn").addEventListener("click", () => {
        const newName = prompt("Edit task name:", task.name);
        if (newName) {
          task.name = newName;
          saveTasks();
          renderTasks();
        }
      });

      list.appendChild(li);
    });
}

// =======================
// ⭐ ADD TASK
// =======================
const addBtn = document.getElementById("add-btn");

if (addBtn) {
  addBtn.addEventListener("click", () => {
    const name = document.getElementById("task-name").value;
    const date = document.getElementById("task-date").value;
    const course = document.getElementById("task-course").value;

    if (name === "") return;

    tasks.push({ name, date, course });
    saveTasks();
    renderTasks();

    document.getElementById("task-name").value = "";
    document.getElementById("task-date").value = "";
    document.getElementById("task-course").value = "";
  });
}

// =======================
// ⭐ FILTER（加分项）
// =======================
const filterInput = document.getElementById("filter-course");

if (filterInput) {
  filterInput.addEventListener("input", () => {
    renderTasks(filterInput.value);
  });
}

// 初始渲染
renderTasks();

// =======================
// ⭐ INDEX PAGE LOGIC
// =======================
if (window.location.pathname.includes("index.html")) {

  const taskCount = document.getElementById("task-count");
  if (taskCount) {
    taskCount.innerText = tasks.length;
  }

  // ⭐ Fetch API
  fetch("https://api.quotable.io/random")
    .then(res => res.json())
    .then(data => {
      const quote = document.getElementById("quote");
      if (quote) {
        quote.innerText = data.content;
      }
    })
    .catch(() => {
      document.getElementById("quote").innerText = "Failed to load quote.";
    });
}

// =======================
// ⭐ COURSES PAGE LOGIC
// =======================
if (window.location.pathname.includes("courses.html")) {

  const courses = [
    { name: "CS272", desc: "Intro to Web Development" },
    { name: "ECON 310", desc: "Econometrics" },
    { name: "STAT 340", desc: "Data Science Modeling" }
  ];

  const container = document.getElementById("course-list");

  courses.forEach(course => {
    const col = document.createElement("div");
    col.className = "col-md-4";

    col.innerHTML = `
      <div class="card p-3">
        <h5>${course.name}</h5>
        <p>${course.desc}</p>
      </div>
    `;

    container.appendChild(col);
  });
}