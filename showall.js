const showAllForm = document.getElementById("form-show-all");
const showAllBtn = document.getElementById("show-all");

let again = false;
let fullTable = "";


main();

/////////////////////////////////////////////////////////////////////////

function main() {

    showAllForm.addEventListener('submit', (event) => {
        event.preventDefault();                           // prevent submit button & form from jumping the gun

        // append remaining jobs (if any) to table
        if(numJobsReturned > numJobsDisplayed ) {
            if( again ) {
                clearTable();
                restoreFullTable();
            }
            else {
                displayJobs(10, 10);            // 1 page of jobs at 20 jobs per page
                // update entry count
                //entryCount.innerText = `all ${numJobsReturned} posted`;
                console.log("saving full table...");
                fullTable = jobsList.innerHTML;
                //disableShowAll();
                enableFilters();
                again = true;
            }
            jobsData.forEach( job => {          // so we have a copy to work with
                filteredJobs.push( job );       // ensure a deep copy!
            });
        }
    });
}


function clearTable() {
    jobsList.innerHTML = "";            // clear table
    numJobsDisplayed = 0;
    entryCount.innerText = '0';
    filteredJobs = [];
}

function restoreFullTable() {
    jobsList.innerHTML = fullTable;
    numJobsDisplayed = numJobsReturned;
    entryCount.innerText = `${numJobsDisplayed}`;
}