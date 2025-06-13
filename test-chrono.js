// import * as chrono from "https://esm.sh/chrono-node@2.7.3";

// const input = document.querySelector("#input");

// const dateKeywords = [
//   "by",
//   "at",
//   "before",
//   "after",
//   "until",
//   "on",
//   "no later than",
//   "from",
//   "to",
//   "through",
//   "between",
//   "around",
//   "about",
//   "next",
//   "this",
//   "last",
// ];

// function cleanExtraPhrases(text) {
//   console.log(dateKeywords.join("|"));
//   const regex = new RegExp(`\\b(${dateKeywords.join("|")})\\b`, "gi");
//   return text
//     .replace(regex, "")
//     .replace(/\s{2,}/g, " ")
//     .trim();
// }

// input.addEventListener("keydown", (e) => {
//   if (e.key !== "Enter") return;

//   const raw = input.value.trim();
//   if (!raw) return console.warn("Input is empty");

//   const results = chrono.parse(raw);
//   let task = raw;

//   // Remove date parts
//   console.log(raw.replace(results[0].text, "").trim());
//   task = raw.replace(results[0].text, "").trim();

//   // Remove any leftover date-related phrases
//   task = cleanExtraPhrases(task);

//   const date = results[0]?.start?.date() ?? null;

//   console.log("Task:", task);
//   console.log("Due Date:", date);

//   input.value = "";
// });
ratio();
ratio();
function ratio() {
  const Checkbox = document.querySelectorAll(".input");
  Checkbox.forEach((box) => {
    box.addEventListener("click", () => {
      console.log("clicked");
    });
  });
}
