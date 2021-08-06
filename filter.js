const categoryPopup = document.getElementById("category-select");
const dateInput = document.getElementById("date-input");
const updateForm = document.getElementById("form-update");
const updateBtn = document.getElementById('change-date');
const salaryBtn = document.getElementById("filter-salary");
const salaryInput = document.getElementById("salary-input");
//const distanceCzechbox = document.getElementById("distance-option");
//const distanceInput = document.getElementById("distance-input");
//const zipInput = document.getElementById("zip-code");
let dateChanged = false;
let filteredJobs = [];              // subset array of table rows in HTML


// EVENT LISTENERS: category filter pop-up menu, date selector, change date button, and salary filter checkbox
dateInput.addEventListener('change', () => {
    dateChanged = true;
});

updateForm.addEventListener('submit', (event) => {          // @TODO: add jobs back to table if date further in past
    event.preventDefault();

    // if selected date is not today, grab selected date and filter jobs
    if(dateChanged) {
        filterByDate( String(dateInput.value) );        // "YYYY-MM-DD"
    }
    numJobsDisplayed = filteredJobs.length;
    entryCount.innerText = `${numJobsDisplayed}`;
    //disableShowAll();
});

categoryPopup.addEventListener('change', () => {
    if(categoryPopup.value === "") return;
    filteredJobs = filterByCategory( categoryPopup.value );
    entryCount.innerText = `${numJobsDisplayed}`;
});

salaryBtn.addEventListener( 'click', () => {
    if( Number(salaryInput.value) > 41999 ) {        // job must compensate at least $42k
        filteredJobs = filterBySalary( Number(salaryInput.value) );
        // clearTable();
        // displayFiltered( filteredJobs );
        entryCount.innerText = `${numJobsDisplayed}`;
    }
});


function filterByDate( dateSelected ) {

    for(let j = numJobsDisplayed - 1; j > -1; j--) {                // start at the oldest and work forward in time
        if(filteredJobs[j]["jobPostDate"] < dateSelected) {            // if job's post date precedes the selected date
            removeRow( filteredJobs.pop() );                                     // delete the job
        }
        else break;                 // if chosen date is behind the oldest job shown then stop filtering
    }
    dateChanged = false;
}

function filterBySalary( minSalary ) {
     return filteredJobs.filter( job => {                     // return a subset array
         if( ( Number(job.payRate) < minSalary) ) {     // ensure payRate and minSalary are both numbers
             removeRow( job );
             numJobsDisplayed--;
         }
         else return job;
     });
}

function filterByCategory( category ) {
    return filteredJobs.filter( job => {
        if( job.jobCategory != category ) {
            console.log(job.jobCategory + " != ? " + category);
            console.log(job.jobCategory != category);
            removeRow(job);
            numJobsDisplayed--;
        }
        else return job;
    });
}

function removeRow( job ) {
    console.log("attempting to remove a row");
    const row = document.getElementById( job.jobID );
    row.innerHTML = "";
    row.remove();
    console.log("row should be removed");
}

function disableShowAll() {
    showAllBtn.disabled = true;
    showAllBtn.classList.remove('text-black');
    showAllBtn.classList.add('text-gray-400');
}

function enableFilters() {
    categoryPopup.disabled = false;

    updateBtn.disabled = false;
    updateBtn.classList.remove('text-gray-400');
    updateBtn.classList.add('text-black');

    salaryBtn.disabled = false;
    salaryBtn.classList.remove('text-gray-400');
    salaryBtn.classList.add('text-black');
}
