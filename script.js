import * as chrono from "https://esm.sh/chrono-node@2.7.3";
// DOM Elements
// Toggle buttons
const secMenu = document.querySelector(".nav-sec-menu");
const minimizeBtn = document.querySelector(".nav-minimize");
const moreMenu = document.querySelector(".nav-main-more");
const addTaskBtn = document.querySelector("add-task button");
const Themes = document.querySelectorAll(".theme-option");
const sortTaskBtn = document.querySelector(".sort-list");
// Navigation elements

const sortOptions = document.querySelector(".sort-list-options");
const navMoreOptions = document.querySelector(".nav-main-more-options");
const TaskTitle = document.querySelectorAll(".task-title");
// Incomplete Task List
const incoTaskList = document.querySelector(".inco-tasks");
const incoTask = document.querySelectorAll(".inco-task");
const incoTaskChekbox = document.querySelector("#inco-checkbox");
// Completed Task List
const CompetTaskList = document.querySelector(".completed-tasks");
const competTask = document.querySelector(".completed-task");
const compTaskChekbox = document.querySelectorAll(".comp-checkbox");
const compTaskTitle = document.querySelector(".completed-task-title");

//input task
const taskInput = document.querySelector(".add-task input");

//Global Variables
const taskDate = ""; // Empty by default

const dateKeywords = [
  "by",
  "at",
  "before",
  "after",
  "until",
  "on",
  "no later than",
  "from",
  "to",
  "through",
  "between",
  "around",
  "about",
  "next",
  "this",
  "last",
];

//Initial Setup
touggleCheckbox();
toggleStarButtons();

//Just space
document.addEventListener("keypress", (event) => {
  if (event.key === " ") {
    taskInput.focus(); // Focus on the task input when space is pressed
  }
});

//Star setup
// For all star buttons, hide them initially
function toggleStarButtons() {
  const favBtn = document.querySelectorAll(".fav-star");

  favBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.closest(".task").getAttribute("index");
      btn.classList.toggle("active");
      updateFavTasks(index, btn.classList.contains("active"));

      if (btn.classList.contains("active")) {
        btn.setAttribute("title", "Remove from favorites");
        btn.style.fill = "gold";
        btn.style.stroke = "none";
      } else {
        btn.style.fill = "none";
        btn.style.stroke = "white";
        btn.setAttribute("title", "Add to favorites");
      }
    });
  });
}
//More Menu
moreMenu.addEventListener("click", () => {
  navMoreOptions.classList.toggle("active");
  navMoreOptions.classList.toggle("inactive");
});
document.addEventListener("click", (event) => {
  if (
    !moreMenu.contains(event.target) &&
    !navMoreOptions.contains(event.target)
  ) {
    //if the click is outside the more menu and its options it hides the option

    navMoreOptions.classList.add("inactive");
    navMoreOptions.classList.remove("active");
  }
});

//Sort Task Lists
sortTaskBtn.addEventListener("mouseover", () => {
  sortOptions.classList.add("active");
  sortOptions.classList.remove("inactive");
});
sortTaskBtn.addEventListener("mouseleave", () => {
  sortOptions.classList.add("inactive");
  sortOptions.classList.remove("active");
});
Themes.forEach((theme) => {
  theme.addEventListener("click", () => {
    let currentColor =
      JSON.parse(localStorage.getItem("currentColor")) || "#f87171";
    let newColor = theme.getAttribute("data-theme");
    console.log(newColor);
    document.documentElement.style.setProperty("--primary", newColor);
    currentColor = newColor;
    localStorage.setItem("currentColor", JSON.stringify(currentColor));
  });
});

//When touggle Checked
function touggleCheckbox() {
  const taskChekbox = document.querySelectorAll(".checkbox");

  taskChekbox.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const taskContainer = checkbox.closest(".task");
      const taskTitle = taskContainer.querySelector(".task-title");
      const index = taskContainer.getAttribute("index");
      const taskText = index;
      console.log(taskText);

      updateTaskCompletionStatus(taskText, checkbox.checked);

      if (checkbox.checked) {
        if (taskTitle) {
          taskTitle.classList.add("completed-task-title");
          taskTitle.classList.remove("inco-task-title");
        }
        CompetTaskList.appendChild(taskContainer);
      } else {
        if (taskTitle) {
          taskTitle.classList.add("inco-task-title");

          taskTitle.classList.remove("completed-task-title");
        }
        incoTaskList.appendChild(taskContainer);
      }
    });
  });
}

//Current Date and Time
function getCurrentDate() {
  const currentDate = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };
  return currentDate.toLocaleDateString(undefined, options);
  // Format the date as "Month Day, Year"
}

//Add Task
taskInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter" && taskInput.value.trim() !== "") {
    const newTask = document.createElement("div");
    let title = taskInput.value.trim();
    const results = chrono.parse(title); // Parse the input using chrono
    let task = title;
    let Duedate = null;
    var id = new Date().getTime(); // Generate a unique ID based on the current timestamp
    if (results.length != 0) {
      task = title.replace(results[0].text, "").trim();
      task = cleanExtraPhrases(task);
      const display = results[0]?.start?.date(); // ⇒ Date | undefined
      Duedate = display?.toString().replace(/\sGMT.*$/, "");
    }

    const taskDate = getCurrentDate(); // Get the current date
    addTaskValues(newTask, task, id, Duedate);

    touggleCheckbox();
    toggleStarButtons();
    addValuesToLocalStorage(task, taskDate, id, Duedate); // Add values to local storage
    taskInput.value = ""; // Clear the input field after adding the task
  }
  // Reapply the checkbox toggle functionality to the new task
});
//ADD values to new tasks
function addTaskValues(newTask, title, id, taskDate) {
  newTask.classList.add("task");
  newTask.setAttribute("index", id);
  newTask.classList.add("inco-task");
  newTask.innerHTML = `
              <div style="display: flex; align-items: center;">

               <input type="checkbox" name="" class="inco-checkbox checkbox">
                <div class="task-info">
                <span class="task-title inco-task-title">${title}</span>
                ${
                  taskDate
                    ? ` 
                <span class="task-date"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-icon lucide-calendar"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                ${taskDate}
                </span>
                `
                    : ""
                }
                
            </div>
        
        </div>

            
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="fav-star lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a.53.53 0 0 0 .399.29 2.123 2.123 0 0 0 1.196.87l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
        `;
  incoTaskList.appendChild(newTask);
}

//Add values to local storage
function addValuesToLocalStorage(title, date, id, Duedate) {
  const task = {
    id: id, // Unique ID based on current timestamp
    title: title,
    date: date,
    Duedate: Duedate,
    fav: false,
    completed: false, // Default status for new tasks
  };
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskCompletionStatus(title, isCompleted) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Find the task by title and update its completed status
  const updatedTasks = tasks.map((task) => {
    if (task.id == title) {
      return { ...task, completed: isCompleted };
    }
    return task;
  });

  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}
//update fav
function updateFavTasks(index, isFav) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Find the task by index and update its fav status
  const updatedTasks = tasks.map((task) => {
    if (task.id == index) {
      return { ...task, fav: isFav };
    }
    return task;
  });

  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

// Load tasks from local storage on page load

window.addEventListener("DOMContentLoaded", () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const currentColor = JSON.parse(localStorage.getItem("currentColor")) || [];
  document.documentElement.style.setProperty("--primary", currentColor);

  console.log(currentColor);
  tasks.forEach((task) => {
    const newTask = document.createElement("div");

    addTaskValues(newTask, task.title, task.id, task.Duedate);
    const checkbox = newTask.querySelector(".checkbox");
    // If the task is completed, mark it as such
    const favStar = newTask.querySelector(".fav-star");
    if (task.fav) {
      favStar.setAttribute("title", "Remove from favorites");
      favStar.style.fill = "gold";
      favStar.style.stroke = "none";
    } else {
      favStar.setAttribute("title", "Add to favorites");
      favStar.style.fill = "none";
      favStar.style.stroke = "white";
    }
    if (task.completed) {
      checkbox.checked = true;
      const taskTitle = newTask.querySelector(".task-title");
      if (taskTitle) {
        taskTitle.classList.add("completed-task-title");
        taskTitle.classList.remove("inco-task-title");
      }
      CompetTaskList.appendChild(newTask);
    } else {
      incoTaskList.appendChild(newTask);
    }
  });
  touggleCheckbox();
  toggleStarButtons();
});

// Function to clean extra phrases from the task input
function cleanExtraPhrases(text) {
  console.log(dateKeywords.join("|"));

  const regex = new RegExp(`\\b(${dateKeywords.join("|")})\\b`, "gi");
  return text
    .replace(regex, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}
