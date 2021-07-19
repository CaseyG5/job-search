let numSavedJobs;
let jobsListData;
const savedCount = document.getElementById("saved-count");
const savedJobsList = document.getElementById("saved-jobs-list");

numSavedJobs = localStorage.getItem("myJobsQty");
savedCount.innerText = `${numSavedJobs}`;

jobsListData = localStorage.getItem("mySavedJobs");

for(job in jobsData) {
    let newTableRow = document.createElement("tr");
    newTableRow.innerHTML = ("<td><a href=\"\" class=\"text-blue-700 underline\">`${job.title}`</a>&nbsp; &nbsp;</td> " +
        "<td>`${job.companyName}`</td>" +
        "<td>`${job.location}` &nbsp;</td>" +
        "<td>`${job.payRate}`</td>\n" +
        "<td>`${job.type}`</td>" +
        "<td>`${job.remote}`</td>" +
        "<td>`${job.postAge}` ago &nbsp;</td> " +
        "<td><i class=\"material-icons text-yellow-500\">star</i></td>");
    savedJobsList.appendChild(newTableRow);
}


