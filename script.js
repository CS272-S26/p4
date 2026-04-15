let tasks = [];

// 读取 localStorage
if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
}

// 渲染任务
function renderTasks() {
  const list = document.getElementById("task-list");
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


function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

document.getElementById("add-btn").addEventListener("click", () => {
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


renderTasks();