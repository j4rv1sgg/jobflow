console.log("JobFlow content script running 🚀");

// LinkedIn job title
const jobTitle = document.querySelector("h1.t-24.t-bold.inline a")?.innerText;

if (jobTitle) {
  console.log("Job Title:", jobTitle);

}
