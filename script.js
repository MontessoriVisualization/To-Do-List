import * as chrono from "https://esm.sh/chrono-node@2.7.3";
// DOM Elementsy
// Toggle buttons
const secMenu = document.querySelector(".nav-sec-menu");
const minimizeBtn = document.querySelector(".nav-minimize");
const moreMenu = document.querySelector(".nav-main-more");
const Themes = document.querySelectorAll(".theme-option");
const sortTaskBtn = document.querySelector(".sort-list");
const closeTaskBtn = document.querySelector(".close-button button");
const addTaskBtn = document.querySelector(".add-task button");
const myDayOPtion = document.querySelector(".option-myday");
const dateTimeTrigger = document.getElementById("time-trigger");
const dateTimeInput = document.getElementById("realTimeInput");
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
let day = "";
let base64Url = [];

let time = "9:00 PM"; // Default time
let repeatOption = ""; // New variable to track repeat option

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
addTitle();
touggleCheckbox();
initStarButtons();
toggleStarButtons();
addToMyDay();
initOldValues();
toggleAsideOptions();
assignDateToOption();

//initital Star setup
function initStarButtons() {
  iniFav.addEventListener("click", () => {
    iniFav.classList.toggle("active");
  });

  return iniFav.classList.contains("active");
}

function addTitle() {
  const mainContainer = document.querySelectorAll(".task-option");
  mainContainer.forEach((container) => {
    const title = container.querySelector(".option-text").textContent;
    container.setAttribute("title", title);
  });
}

//check if the star button is active
function isStarButtonActive(input) {
  if (input.closest(".right-sidebar")) {
    const value = iniFav.classList.contains("active");
    if (value) {
      iniFav.classList.remove("active");
    }
    return value; // Return true if the star button is active, false otherwise
  } else {
    return false; // If not in the right sidebar, return false
  }
}
function isMyDay(input) {
  if (input.closest(".right-sidebar")) {
    const myDayElement = document.querySelector(".option-myday");
    const title = myDayElement.getAttribute("title");
    const value = myDayElement.classList.contains("active");

    if (value) {
      const changedOption = myDayElement.querySelector(".changed-option");
      if (changedOption) {
        setTimeout(() => {
          reviveOldValue(myDayElement, title);
          myDayElement.classList.remove("active");
        }, 100);
      }
    }
    return value; // Return true if the My Day option is active, false otherwise
  } else {
    return false; // If not in the right sidebar, return false
  }
}
function resetToggle() {
  const mainContainer = document.querySelectorAll(".task-option");
  mainContainer.forEach((container) => {
    if (container.querySelector(".changed-option")) {
      const title = container.getAttribute("title");
      reviveOldValue(container, title);
    }
  });
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
      if (otherOption) {
        if (
          otherOption.classList.contains("active") ||
          otherOption.classList.contains("inactive")
        ) {
          console.log("toggled");
          otherOption.classList.toggle("active");
          otherOption.classList.toggle("inactive");
          closeAsideOptions(otherOption, option);
        }
        addDateByAside();
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
      const MyDay = isMyDay(input); // Check if the My Day option is selected
      var id = new Date().getTime(); // Generate a unique ID based on the current timestamp
      if (results.length != 0) {
        task = title.replace(results[0].text, "").trim();
        task = cleanExtraPhrases(task);
        const display = results[0]?.start?.date(); // ⇒ Date | undefined
        Duedate = display?.toString().replace(/\sGMT.*$/, "");
      } else if (dateSelected !== null) {
        Duedate = dateSelected;
        console.log(Duedate);
        resetToggle();
        dateSelected = null;
      }

      const taskDate = getCurrentDate(); // Get the current date
      addTaskValues(newTask, task, id, Duedate, currentFav, repeatOption); // Add values to the new task

      touggleCheckbox();
      toggleStarButtons();
      addValuesToLocalStorage(
        task,
        taskDate,
        id,
        Duedate,
        currentFav,
        MyDay,
        repeatOption,
        base64Url
      );

      repeatOption = "";
      input.value = "";
      base64Url = [];
    }
  });
  // Reapply the checkbox toggle functionality to the new task
});
//ADD values to new tasks
function addTaskValues(newTask, title, id, taskDate, currentFav, repeatoption) {
  newTask.classList.add("task");
  newTask.setAttribute("index", id);
  newTask.classList.add("inco-task");

  const repeatInfo = repeatoption
    ? `
    <span class="task-repeat"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-repeat"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>
    ${repeatoption}</span>`
    : "";
  newTask.innerHTML = `
              <div style="display: flex; align-items: center;">

               <input type="checkbox" name="" class="inco-checkbox checkbox">
                <div class="task-info">
                <span class="task-title inco-task-title">${title}</span>
                <span style='display:flex; align-items: center; gap: 8px;'>
                ${
                  taskDate
                    ? ` 
                <span class="task-date"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-icon lucide-calendar"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                               ${taskDate}
                </span>
                `
                    : ""
                }

                ${repeatInfo}
                </span>
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
function addValuesToLocalStorage(
  title,
  date,
  id,
  Duedate,
  currentFav,
  MyDay,
  repeatoption,
  base64Url
) {
  const task = {
    id: id,
    title: title,
    date: date,
    Duedate: Duedate,
    fav: currentFav,
    completed: false,
    myDay: MyDay,
    repeat: repeatoption,
    base64Url: base64Url,
  };
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Reset repeat option after saving
  repeatOption = "";
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

    addTaskValues(
      newTask,
      task.title,
      task.id,
      task.Duedate,
      task.fav,
      task.repeat
    );

    const checkbox = newTask.querySelector(".checkbox");
    // If the task is completed, mark it as such
    const favStar = newTask.querySelector(".fav-star");
    if (task.fav) {
      favStar.style.fill = "gold";
      favStar.style.stroke = "none";
    } else {
      favStar.style.fill = "none";
      favStar.style.stroke = "white";
    }

    // Add repeat indicator if task has repeat option

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

// New function to handle repeat options

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
  const taskOptions = document.querySelectorAll(".option-item");
  taskOptions.forEach((option) => {
    const allTitle = option.querySelector(".option-text").textContent;
    console.log(allTitle);
    oldvalues.push({
      content: option.outerHTML,
      title: allTitle,
    });
  });
}

function addDateByAside() {
  const dateTaskOption = document.querySelectorAll(".date-option");

  dateTaskOption.forEach((option) => {
    option.onclick = () => {
      console.log("clicked");
      const mainContainer = option.closest(".task-option");
      const title = mainContainer.getAttribute("title");
      let content = option.querySelector(".date-title").textContent;
      if (content) {
        const parsedDate = chrono.parseDate(content);

        // Format parts
        if (title == "Remind me") {
          time = "9:00 PM";
          day = parsedDate.toLocaleDateString([], {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          });
        } else if (title == "Add due date") {
          day = parsedDate.toLocaleDateString([], {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          });
        } else if (title == "Repeat") {
          // Handle repeat option selection
          repeatOption = content.trim();
        }

        dateSelected = day + " " + time;

        console.log(oldvalues);
        mainContainer.innerHTML = `<div class="changed-option" style="display: flex;
  justify-content: space-between;
width: 100%;
  padding:16px;
  align-items: center;
  color: var(--primary);">
            <span class="option-text" style ="  color: var(--primary);">${
              title == "Repeat" ? "Repeats " + repeatOption : dateSelected
            } </span>
            <svg class="lucide" viewBox="0 0 24 24" width="21px" height="21px" xmlns="http://www.w3.org/2000/svg">
              <path d="m18 6-12 12"></path>
              <path d="m6 6 12 12"></path>
            </svg>
       
          </div>`;
        removeDateByAside();
      }
    };
  });
}
//costume time

dateTimeTrigger.addEventListener("click", () => {
  dateTimeInput.focus();
  try {
    dateTimeInput.showPicker?.();
  } catch (e) {
    dateTimeInput.click();
  }
});
document.getElementById("fileInput").addEventListener("change", function () {
  const files = Array.from(this.files);
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      base64Url.push(e.target.result);
      const url = e.target.result;
      handleFiles(file, url);
    };
    reader.readAsDataURL(file);
  });
});

function handleFiles(file, url) {
  const preview = document.getElementById("file-preview");
  if (file.type.startsWith("image/")) {
    preview.classList.remove("hidden");

    const img = document.createElement("img");
    img.src = url;
    img.style.width = "100%";
    img.style.height = "auto";
    img.style.borderRadius = "8px";
    preview.appendChild(img);
  }
}

function removeDateByAside() {
  const remChangedOption = document.querySelectorAll(".changed-option svg");
  remChangedOption.forEach((option) => {
    option.onclick = (e) => {
      e.stopPropagation(); // Prevent triggering the parent click event
      const mainContainer = option.closest(".task-option");
      const title = mainContainer.getAttribute("title");

      reviveOldValue(mainContainer, title);
      if (mainContainer.classList.contains("option-myday")) {
        mainContainer.classList.remove("active");
      }
    };
  });
}
function reviveOldValue(mainContainer, title) {
  oldvalues.map((oldValue) => {
    if (oldValue.title === title) {
      mainContainer.classList.toggle("active");
      mainContainer.innerHTML = oldValue.content;
      toggleAsideOptions();
      addDateByAside();
      addToMyDay();
      assignDateToOption();
    }
  });
}
//Assigning date to date-option
function assignDateToOption() {
  const dateOption = document.querySelectorAll(".date-option");
  dateOption.forEach((option) => {
    const content = option.querySelector(".date-title").textContent;
    const dateContainer = option.querySelector(".main-date");
    const mainContainer = option.closest(".task-option");
    const title = mainContainer.getAttribute("title");
    const parsedDate = chrono.parseDate(content);

    // Format parts

    if (title == "Remind me") {
      time = "9:00 PM";
      day = "";
    } else if (title == "Add due date") {
      time = "";
      day = parsedDate.toLocaleDateString([], {
        weekday: "short",
        day: "numeric",
      });
    } else {
      day = " ";
      time = " ";
    }

    // Set default time to 9 PM

    dateContainer.innerHTML = `
      <span class="date-day">${day}</span>
      <span class="date-time">${time}</span>
    `;
  });
}

// Add to my day
function addToMyDay() {
  const mainContainer = document.querySelector(".option-myday");
  if (mainContainer) {
    mainContainer.onclick = () => {
      const title = mainContainer.getAttribute("title");

      // Only apply changes if not already changed
      if (!mainContainer.querySelector(".changed-option")) {
        mainContainer.innerHTML = `<div class="changed-option" style="
        padding:16px; display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    color: var(--primary);">
              <span class="option-text" style ="  color: var(--primary);">Added to MY Day</span>
              <svg class="lucide" viewBox="0 0 24 24" width="21px" height="21px" xmlns="http://www.w3.org/2000/svg">
                <path d="m18 6-12 12"></path>
                <path d="m6 6 12 12"></path>
              </svg>
         
            </div>`;
        mainContainer.classList.add("active");

        // Add event listener to the X icon
        const closeIcon = mainContainer.querySelector(".changed-option svg");
        if (closeIcon) {
          closeIcon.onclick = (e) => {
            e.stopPropagation(); // Prevent triggering the parent click event
            reviveOldValue(mainContainer, title);
            mainContainer.classList.remove("active");
          };
        }
      }
    };
  }
}

//Initialize sort options
initSortOptions();

//Setup sort options event listeners
function initSortOptions() {
  const sortOptionElements = document.querySelectorAll(".sort-option");

  sortOptionElements.forEach((option) => {
    option.addEventListener("click", () => {
      const sortType = option.getAttribute("data-sort");
      sortTasks(sortType);
    });
  });
}

//Sort tasks based on different criteria
function sortTasks(sortType) {
  switch (sortType) {
    case "importance":
      sortTasksByImportance();
      break;
    case "alphabetical":
      sortTasksByAlphabetical();
      break;
    case "dueDate":
      sortTasksByDueDate();
      break;
    case "date":
      sortTasksByMyDay();
      break;
    case "creationDate":
      sortTasksByCreationDate();
      break;
    default:
      break;
  }
}

//Sort tasks with favorites first
function sortTasksByImportance() {
  const incompleteTasks = Array.from(
    document.querySelectorAll(".inco-tasks .task")
  );
  const incoTasksContainer = document.querySelector(".inco-tasks");

  incompleteTasks.sort((a, b) => {
    const aIsFav = a.querySelector(".fav-star").classList.contains("active");
    const bIsFav = b.querySelector(".fav-star").classList.contains("active");

    if (aIsFav && !bIsFav) return -1;
    if (!aIsFav && bIsFav) return 1;
    return 0;
  });

  incompleteTasks.forEach((task) => {
    incoTasksContainer.appendChild(task);
  });

  const completedTasks = Array.from(
    document.querySelectorAll(".completed-tasks .task")
  );
  console.log(completedTasks);
  const completedTasksContainer = document.querySelector(".completed-tasks");

  completedTasks.sort((a, b) => {
    const aIsFav = a.querySelector(".fav-star").classList.contains("active");
    const bIsFav = b.querySelector(".fav-star").classList.contains("active");

    if (aIsFav && !bIsFav) return -1;
    if (!aIsFav && bIsFav) return 1;
    return 0;
  });

  completedTasks.forEach((task) => {
    completedTasksContainer.appendChild(task);
  });
}

//Sort tasks alphabetically by title
function sortTasksByAlphabetical() {
  sortTasksInContainer(".inco-tasks", (a, b) => {
    const aTitle = a.querySelector(".task-title").textContent.toLowerCase();
    const bTitle = b.querySelector(".task-title").textContent.toLowerCase();
    return aTitle.localeCompare(bTitle);
  });

  sortTasksInContainer(".completed-tasks", (a, b) => {
    const aTitle = a.querySelector(".task-title").textContent.toLowerCase();
    const bTitle = b.querySelector(".task-title").textContent.toLowerCase();
    return aTitle.localeCompare(bTitle);
  });
}

//Sort tasks by due date
function sortTasksByDueDate() {
  sortTasksInContainer(".inco-tasks", (a, b) => {
    const date1 = a.querySelector(".task-date");
    const date2 = b.querySelector(".task-date");

    const aDate = date1
      ? new Date(date1.textContent.trim())
      : new Date(1000000000000);
    const bDate = date2
      ? new Date(date2.textContent.trim())
      : new Date(1000000000000);

    const aValid = !isNaN(aDate.getTime());
    const bValid = !isNaN(bDate.getTime());

    if (!aValid && !bValid) return 0;
    if (!aValid) return 1;
    if (!bValid) return -1;

    return aDate - bDate;
  });

  sortTasksInContainer(".completed-tasks", (a, b) => {
    const date1 = a.querySelector(".task-date");
    const date2 = b.querySelector(".task-date");

    const aDate = date1
      ? new Date(date1.textContent.trim())
      : new Date(1000000000000);
    const bDate = date2
      ? new Date(date2.textContent.trim())
      : new Date(1000000000000);

    const aValid = !isNaN(aDate.getTime());
    const bValid = !isNaN(bDate.getTime());

    if (!aValid && !bValid) return 0;
    if (!aValid) return 1;
    if (!bValid) return -1;

    return aDate - bDate;
  });
}

//Sort tasks by "My Day" status
function sortTasksByMyDay() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  sortTasksInContainer(".inco-tasks", (a, b) => {
    const aId = a.getAttribute("index");
    const bId = b.getAttribute("index");

    const aTask = tasks.find((task) => task.id == aId);
    const bTask = tasks.find((task) => task.id == bId);

    const aInMyDay = aTask && aTask.myDay;
    const bInMyDay = bTask && bTask.myDay;

    if (aInMyDay && !bInMyDay) return -1;
    if (!aInMyDay && bInMyDay) return 1;
    return 0;
  });

  sortTasksInContainer(".completed-tasks", (a, b) => {
    const aId = a.getAttribute("index");
    const bId = b.getAttribute("index");

    const aTask = tasks.find((task) => task.id == aId);
    const bTask = tasks.find((task) => task.id == bId);

    const aInMyDay = aTask && aTask.myDay;
    const bInMyDay = bTask && bTask.myDay;

    if (aInMyDay && !bInMyDay) return -1;
    if (!aInMyDay && bInMyDay) return 1;
    return 0;
  });
}

//Sort tasks by creation date
function sortTasksByCreationDate() {
  sortTasksInContainer(".inco-tasks", (a, b) => {
    const aId = parseInt(a.getAttribute("index"));
    const bId = parseInt(b.getAttribute("index"));
    return aId - bId;
  });

  sortTasksInContainer(".completed-tasks", (a, b) => {
    const aId = parseInt(a.getAttribute("index"));
    const bId = parseInt(b.getAttribute("index"));
    return aId - bId;
  });
}

//Helper function to sort tasks in a container
function sortTasksInContainer(containerSelector, compareFunction) {
  const container = document.querySelector(containerSelector);
  const tasks = Array.from(container.querySelectorAll(".task"));

  if (tasks.length === 0) return;

  tasks.sort(compareFunction);

  tasks.forEach((task) => {
    container.appendChild(task);
  });
}

//for chose your date
