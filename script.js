import * as chrono from "https://esm.sh/chrono-node@2.7.3";
// DOM Elements
// Toggle buttons
const secMenu = document.querySelector(".nav-sec-menu");
const minimizeBtn = document.querySelector(".nav-minimize");
const moreMenu = document.querySelector(".nav-main-more");
const Themes = document.querySelectorAll(".theme-option");
const sortTaskBtn = document.querySelector(".sort-list");
const closeTaskBtn = document.querySelector(".close-button button");
const addTaskBtn = document.querySelector(".add-task button");

// Navigation elements
const iniFav = document.querySelector(".aside-star-icon");

const sortOptions = document.querySelector(".sort-list-options");
const rightSideBar = document.querySelector(".right-sidebar");
const navMoreOptions = document.querySelector(".nav-main-more-options");
const TaskTitle = document.querySelectorAll(".task-title");

// Incomplete Task List
const incoTaskList = document.querySelector(".inco-tasks");
const incoTaskChekbox = document.querySelector("#inco-checkbox");
// Completed Task List
const CompetTaskList = document.querySelector(".completed-tasks");
const competTask = document.querySelector(".completed-task");
const compTaskChekbox = document.querySelectorAll(".comp-checkbox");
const compTaskTitle = document.querySelector(".completed-task-title");

//input task
const taskInput = document.querySelectorAll(".add-task input");

//Global Variables
let dateSelected = null;
let oldvalues = [];

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
initStarButtons();
toggleStarButtons();
addDateByAside();
initOldValues();
toggleAsideOptions();
//Just space

//initital Star setup
function initStarButtons() {
  iniFav.addEventListener("click", () => {
    iniFav.classList.toggle("active");
  });

  return iniFav.classList.contains("active");
}

//check if the star button is active
function isStarButtonActive(input) {
  if (input.closest(".right-sidebar")) {
    return iniFav.classList.contains("active");
  } else {
    return false; // If not in the right sidebar, return false
  }
}
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
document.addEventListener("click", (e) => {
  if (e.key === " ") {
    taskInput.focus(); // Focus on the task input when space is pressed
  }
  if (!moreMenu.contains(e.target) && !navMoreOptions.contains(e.target)) {
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
//toggle aside options
function toggleAsideOptions() {
  const asideOption = document.querySelectorAll(".option-item");

  asideOption.forEach((option) => {
    option.onclick = () => {
      const otherOption = option.querySelector(".task-options-more");
      if (
        otherOption.classList.contains("active") ||
        otherOption.classList.contains("inactive")
      ) {
        console.log("toggled");
        otherOption.classList.toggle("active");
        otherOption.classList.toggle("inactive");
        closeAsideOptions(otherOption, option);
      }
    };
  });
}

function closeAsideOptions(otherOption, option) {
  document.addEventListener("click", (e) => {
    if (
      !otherOption.contains(e.target) &&
      !option.contains(e.target) &&
      otherOption.classList.contains("active")
    ) {
      otherOption.classList.add("inactive");
      otherOption.classList.remove("active");
    }
  });
}
//Current Date and Time
function getCurrentDate() {
  const currentDate = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };
  return currentDate.toLocaleDateString(undefined, options);
  // Format the date as "Month Day, Year"
}
// Toggle Side Menu
addTaskBtn.addEventListener("click", () => {
  rightSideBar.style.display = "block"; // Show the sidebar when the button is clicked
});
// Close Task List
closeTaskBtn.addEventListener("click", () => {
  rightSideBar.style.display = "none"; // Show the sidebar when the button is clicked
});

//Add Task
taskInput.forEach((input) => {
  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter" && input.value.trim() !== "") {
      const newTask = document.createElement("div");
      let title = input.value.trim();
      const results = chrono.parse(title); // Parse the input using chrono

      let task = title;
      let Duedate = null;
      const currentFav = isStarButtonActive(input); // Check if the star button is active
      console.log(currentFav);

      var id = new Date().getTime(); // Generate a unique ID based on the current timestamp
      if (results.length != 0) {
        task = title.replace(results[0].text, "").trim();
        task = cleanExtraPhrases(task);
        const display = results[0]?.start?.date(); // ⇒ Date | undefined
        Duedate = display?.toString().replace(/\sGMT.*$/, "");
      } else if (dateSelected !== null) {
        Duedate = dateSelected;
        console.log(Duedate);
        dateSelected = null;
      }
      const taskDate = getCurrentDate(); // Get the current date
      addTaskValues(newTask, task, id, Duedate, currentFav); // Add values to the new task

      touggleCheckbox();
      toggleStarButtons();
      addValuesToLocalStorage(task, taskDate, id, Duedate, currentFav);
      // Add values to local storage

      input.value = ""; // Clear the input field after adding the task
    }
  });
  // Reapply the checkbox toggle functionality to the new task
});
//ADD values to new tasks
function addTaskValues(newTask, title, id, taskDate, currentFav) {
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

            
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="
       ${
         currentFav ? "active" : ""
       } fav-star lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a.53.53 0 0 0 .399.29 2.123 2.123 0 0 0 1.196.87l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
        `;
  incoTaskList.appendChild(newTask);
}

//Add values to local storage
function addValuesToLocalStorage(title, date, id, Duedate, currentFav) {
  const task = {
    id: id, // Unique ID based on current timestamp
    title: title,
    date: date,
    Duedate: Duedate,
    fav: currentFav,
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
//initilie old values
function initOldValues() {
  const taskOptions = document.querySelectorAll(".task-option");
  taskOptions.forEach((option) => {
    const allMainContainer = option.closest(".task-option");

    const allTitle = allMainContainer.querySelector(".option-text").textContent;
    oldvalues.push({
      content: allMainContainer.innerHTML,
      title: allTitle,
    });
  });
}
console.log(chrono.parse("next Friday at 3pm"));
console.log(chrono.parseDate("next Friday at 3pm").getDay());
// aside date options

function addDateByAside() {
  const dateTaskOption = document.querySelectorAll(".date-option");

  dateTaskOption.forEach((option) => {
    option.addEventListener("click", () => {
      const mainContainer = option.closest(".task-option");
      let content = option.querySelector(".date-title").textContent;
      const title = mainContainer.querySelector(".option-text").textContent;
      console.log(content);
      mainContainer.setAttribute("title", title);

      dateSelected = chrono
        .parseDate(content)
        ?.toString()
        .replace(/\sGMT.*$/, "");

      console.log(oldvalues);
      mainContainer.innerHTML = `<div class="changed-option" style="  display: flex;
  justify-content: space-between;
  padding:16px;
  align-items: center;
  color: var(--primary);">
            <span class="option-text" style ="  color: var(--primary);">${dateSelected}</span>
            <svg class="lucide" viewBox="0 0 24 24" width="21px" height="21px" xmlns="http://www.w3.org/2000/svg">
              <path d="m18 6-12 12"></path>
              <path d="m6 6 12 12"></path>
            </svg>
       
          </div>`;
      removeDateByAside();
    });
  });
}
function removeDateByAside() {
  const remChangedOption = document.querySelectorAll(".changed-option svg");
  remChangedOption.forEach((option) => {
    option.onclick = () => {
      const mainContainer = option.closest(".task-option");
      const title = mainContainer.getAttribute("title");
      oldvalues.map((oldValue) => {
        if (oldValue.title === title) {
          mainContainer.innerHTML = oldValue.content;
          toggleAsideOptions();
          addDateByAside();
        }
      });
    };
  });
}

//Assigning date to date-option
function assignDateToOption() {
  const dateOption = document.querySelectorAll(".date-option");
  dateOption.forEach((option) => {
    const content = option.querySelector(".date-title").textContent;
    const dateContainer = option.querySelector(".main-date");

    const parsedDate = chrono.parseDate(content);
    // const parsedDate = chrono.parseDate("next Friday");

    // Format parts
    const day = parsedDate.getDate(); // e.g., 21
    const time = parsedDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }); // e.g., "3:00 PM"

    dateContainer.innerHTML = `
      <span class="date-day">${day}</span>
      <span class="date-time">${time}</span>
    `;
  });
}
assignDateToOption();
