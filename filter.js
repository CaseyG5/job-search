const dateInput = document.getElementById("date-input");
const updateForm = document.getElementById("form-update");
const updateBtn = document.getElementById('change-date');
const salaryCzechbox = document.getElementById("salary-option");
const salaryInput = document.getElementById("salary-input");
//const distanceCzechbox = document.getElementById("distance-option");
//const distanceInput = document.getElementById("distance-input");
//const zipInput = document.getElementById("zip-code");
let dateChanged = false;

updateBtn.disabled = true;

dateInput.addEventListener('change', () => {
    dateChanged = true;
});

updateForm.addEventListener('submit', (event) => {          // @TODO: add jobs back to table if date further in past
    event.preventDefault();

    // if selected date is not today, grab selected date and fetch jobs within 48 hour window prior
    // (if today is selected do nothing)
    if(dateChanged) {
        filterByDate( String(dateInput.value) );        // "YYYY-MM-DD"
    }

    if( salaryCzechbox.checked ) {
        filterBySalary( Number(salaryInput.value) );
    }

    entryCount.innerText = `${numJobsDisplayed}`;
    //disableShowAll();
});

function filterByDate( date ) {

    for(let j = numJobsDisplayed - 1; j > -1; j--) {
        console.log(jobsData[j].jobPostDate + " > " + date );
        console.log( (jobsData[j].jobPostDate > date) );
        if(jobsData[j].jobPostDate < date) {
            hideRow(jobsList[j]);
            numJobsDisplayed--;
        }
        else break;                 // if chosen date is behind the oldest job shown then stop filtering
    }
    dateChanged = false;
}

function filterBySalary( minSalary ) {
     jobsData.forEach( job => {
         if( ( Number(job.payRate) < minSalary)   && job.visible) {     // ensure payRate and minSalary are both numbers
             hideRow( job );
             numJobsDisplayed--;
         }
     });
}

function filterByCategory( category ) {
    const singleCategory = jobsData.filter( job => {
        if( job.jobCategory == category )
            return job;
    });
    return singleCategory;
}

function hideRow( job ) {
    const row = document.getElementById( job.jobID );
    row.classList.add('hidden');
    job.visible = false;
}

function disableShowAll() {
    showAllBtn.disabled = true;
    showAllBtn.classList.remove('text-black');
    showAllBtn.classList.add('text-gray-400');
}

function enableFilters() {
    updateBtn.disabled = false;
    updateBtn.classList.remove('text-gray-400');
    updateBtn.classList.add('text-black');
}