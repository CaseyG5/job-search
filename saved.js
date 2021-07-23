let numSavedJobs;
let rowID;
let jobData;
const savedCount = document.getElementById("saved-count");
const savedJobsList = document.getElementById("saved-jobs-list");


// @TODO: use try/catch block
numSavedJobs = localStorage.getItem("savedJobsQty") | 0;

for(let i = 0; i < numSavedJobs; i++) {
    let newTableRow = document.createElement("tr");
    rowID = localStorage.getItem(`${i}`);                        // get the original job row ID
    jobData = localStorage.getItem(`row${rowID}`);              // get the HTML for that table row
    newTableRow.innerHTML = jobData;
    savedJobsList.appendChild(newTableRow);
}
if(numSavedJobs !== 0) savedCount.innerText = `Showing your ${numSavedJobs} saved job(s)`;
