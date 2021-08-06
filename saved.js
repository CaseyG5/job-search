let mySavedJobs;
let jobID;
const savedText = document.getElementById("saved-text");
const savedJobsList = document.getElementById("saved-jobs-list");


// @TODO: use try/catch block for reading from file
mySavedJobs = Number( localStorage.getItem("savedJobsQty") ) | 0;

for(let i = 0; i < mySavedJobs; i++) {
    let newTableRow = document.createElement("tr");
    jobID = localStorage.getItem(`${i}`);                       // get the job ID #
    newTableRow.innerHTML = localStorage.getItem(jobID);            // get the table row HTML for that job
    savedJobsList.appendChild(newTableRow);
}
if(mySavedJobs !== 0) savedText.innerText = `Showing your ${mySavedJobs} saved job(s)`;