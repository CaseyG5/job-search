let numSavedJobs;
let jobID;
const savedText = document.getElementById("saved-text");
const savedJobsList = document.getElementById("saved-jobs-list");


// @TODO: use try/catch block for reading from file
numSavedJobs = Number( localStorage.getItem("savedJobsQty") ) | 0;

for(let i = 0; i < numSavedJobs; i++) {
    let newTableRow = document.createElement("tr");
    jobID = localStorage.getItem(`${i}`);                                   // get the original job row ID
    newTableRow.innerHTML = localStorage.getItem(jobID);            // get the HTML for that table row
    savedJobsList.appendChild(newTableRow);
}
if(numSavedJobs !== 0) savedText.innerText = `Showing your ${numSavedJobs} saved job(s)`;


// localStorage.setItem(`${numSavedJobs}`, jobNumber);        // e.g. "0"             : "609237100"
// numSavedJobs++;
// localStorage.setItem(jobNumber, `${rowObj.innerHTML}`);   //  e.g. "609237100"     : "<td>JS Programmer</td>...<td> *star icon* </td>"