let tasks = [];

// ⭐ 读取 localStorage
if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
}

// =========================
// ⭐ TASKS PAGE LOGIC
// =========================

// 渲染任务（只在 tasks.html 执行）
function renderTasks() {
  const list = document.getElementById("task-list");
  if (!list) return; // ⭐ 防止其他页面报错

  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    li.innerHTML = `
      <div>
        <strong>${task.name}</strong><br>
        ${task.date ? "Due: " + task.date : ""}
        ${task.course ? "<br>Course: " + task.course : ""}
      </div>
      <button class="btn btn-danger btn-sm">Delete</button>
    `;

    li.querySelector("button").addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    list.appendChild(li);
  });
}

// 保存任务
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 添加任务（只在 tasks.html 执行）
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

// 初始渲染（只在 tasks 页面有效）
renderTasks();


// =========================
// ⭐ INDEX PAGE LOGIC（新加）
// =========================

if (window.location.pathname.includes("index.html")) {

  // 更新 task 数量
  const taskCount = document.getElementById("task-count");
  if (taskCount) {
    taskCount.innerText = tasks.length;
  }

  // 获取 quote（fetch API）
  fetch("https://api.quotable.io/random")
    .then(res => res.json())
    .then(data => {
      const quote = document.getElementById("quote");
      if (quote) {
        quote.innerText = data.content;
      }
    })
    .catch(() => {
      const quote = document.getElementById("quote");
      if (quote) {
        quote.innerText = "Failed to load quote.";
      }
    });
}

// =========================
// ⭐ COURSES PAGE LOGIC（新加）
// =========================

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