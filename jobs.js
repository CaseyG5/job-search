import dotenv from 'dotenv';
dotenv.config();

const SEARCH_URL = 'https://data.usajobs.gov/api/search?Keyword=javascript&LocationName=Boston%20Massachusetts&Radius=75&SortField=opendate&ResultsPerPage=10&Page=1';
const HOST = 'data.usajobs.gov';
const MY_EMAIL = process.env.MY_EMAIL;
const API_KEY = process.env.API_KEY;

let jobsData = {};                  // JSON object
let numJobsReturned = 0;
let newRowEntry = {};               // DOM object
let numJobsDisplayed = 0;
let numSavedJobs = 0;

const jobsList = document.getElementById("jobs-list");          // Table body
const entryCount = document.getElementById("entry-count");      // Span for # of jobs displayed
const showAllForm = document.getElementById("form-show-all");
const showAllBtn = document.getElementById("show-all");
const dateInput = document.getElementById("date-input");
const updateForm = document.getElementById("form-update");
let chosenDate;
let dateChanged = false;

// Fetch jobs data via the API using a URL
fetch(SEARCH_URL, {
    method: 'GET',          // 'GET' is the default so this line is not required
    headers: {
        "Host": HOST,
        "User-Agent": MY_EMAIL,
        "Authorization-Key": API_KEY
    }
}).then(resp => resp.json())
    .then(data => {
        jobsData = data["SearchResult"]["SearchResultItems"];
        numJobsReturned = jobsData.length;
        displayJobs(0, 10);
});

main();

/////////////////////////////////////////////////////////////////////////

function main() {

    showAllForm.addEventListener('submit', (event) => {
        event.preventDefault();                           // prevent submit button & form from jumping the gun

        // append remaining jobs of our fetched data to table
        if(numJobsReturned > numJobsDisplayed ) {
            displayJobs(10, numJobsReturned);
            // update entry count
            entryCount.innerText = `all ${numJobsReturned} posted`;
            disableShowAll();
        }
    });

    dateInput.addEventListener('change', () => {
        dateChanged = true;
    });

    updateForm.addEventListener('submit', (event) => {          // @TODO: add jobs back to table if date further in past
        event.preventDefault();

        // if selected date is not today, grab selected date and fetch jobs within 48 hour window prior
        // (if today is selected do nothing)
        if(dateChanged) {
            // grab chosen date as a string
            chosenDate = String(dateInput.value);                                   // "YYYY-MM-DD"

            for(let j = numJobsDisplayed - 1; j > -1; j--) {
                const thisJobsDate = document.getElementById(`date${j}`).innerText;
                if(thisJobsDate > chosenDate) {    // if chosen date is behind the oldest job shown then stop filtering
                    break;
                }
                removeRow(j);
            }
            entryCount.innerText = `the ${numJobsDisplayed} most recent`;
            dateChanged = false;
            disableShowAll();
        }
    });
}

// take starting job and how many to display
// append the rows of jobs data to table
// @TODO: refactor to create all job table rows then use displayJobs to unhide them
/**
 * @param from
 * @param howMany
 */
function displayJobs(from, howMany) {
    // take the lesser of:  the total # of jobs returned ...and... ith job we wish to see
    const upto = numJobsReturned < (from + howMany) ? numJobsReturned : (from + howMany) ;

    for (let k = from; k < upto; k++) {
        createRow(k);
        numJobsDisplayed++;
    }
    // update table row entry count
    entryCount.innerText = `the ${numJobsDisplayed} most recent`;
}


function createRow( i ) {
    const thisJob = jobsData[i]["MatchedObjectDescriptor"];
    const jobID = thisJob["MatchedObjectId"];                                // (number as a string)
    const jobURL = thisJob["ApplyURI"][0];
    const jobTitle = thisJob["PositionTitle"];
    const companyName = thisJob["OrganizationName"];
    const jobLocation = thisJob["PositionLocationDisplay"];
    let payRate = String(thisJob["PositionRemuneration"][0]["MinimumRange"]);   // (number as a string)
    payRate = payRate.substr(0, payRate.length - 2);                // remove ".0"
    const jobType = thisJob["PositionSchedule"][0]["Name"];

    const jobPostDate = String( thisJob["PublicationStartDate"] );           // "YYYY-MM-DD"
    const postDateFormatted = String(
        new Date( jobPostDate.replace('-', '/')     // "YYYY/MM/DD" to avoid 1 day off
        )
    ).substr(4, 11);                                             // Omit day of week

    const closingDate = String( thisJob["ApplicationCloseDate"] );
    const closeDateFormatted = String(
        new Date( closingDate.replace('-', '/')
        )
    ).substr(4, 11);

    newRowEntry = document.createElement('tr');
    newRowEntry.id = `${jobID}`;
    newRowEntry.innerHTML = `<td><a href="${jobURL}" class="text-blue-700 underline">${jobTitle}</a></td> 
                <td>${companyName}</td>
                <td>${jobLocation}</td>
                <td>$${payRate}</td>
                <td>${jobType}</td>
                <td>${postDateFormatted}</td>
                <td>${closeDateFormatted}</td>
                <td id="star${i}"><i class="material-icons">star_border</i></td>
                <td id="share${i}"><i class="material-icons">send</i></td>
                <td id="date${i}" class="hidden">${jobPostDate}</td>`;
    jobsList.appendChild(newRowEntry);

    const temp = document.getElementById(`star${i}`);
    temp.addEventListener('click', () => {
        if(temp.innerHTML === "<i class=\"material-icons\">star_border</i>") {
            temp.innerHTML = "<i class=\"material-icons text-yellow-500\">star</i>";
            saveJob( jobID, newRowEntry );
        }
        else {
            temp.innerHTML = "<i class=\"material-icons\">star_border</i>";
        }
    });
}

function removeRow( i ) {
    const row = document.getElementById(`row${i}`);
    row.innerHTML = "";
    row.classList.add('hidden');
    numJobsDisplayed--;
}

function disableShowAll() {
    // showAllBtn.setAttribute('value', 'disabled');
    showAllBtn.disabled = true;
    showAllBtn.classList.remove('text-black');
    showAllBtn.classList.add('text-gray-400');
}

function saveJob( jobNumber, rowObj  ) {
    // if that job doesn't already exist in local storage, then
    if(localStorage.getItem(jobNumber) == null) {              // Does "" == null?  In case job is saved, deleted, and saved again.

        // try to save that job data & update # of jobs saved           // @TODO: grab job row HTML by JOB ID # instead (make rowID the jobID)
        try {
            localStorage.setItem(`${numSavedJobs}`, jobNumber);        // e.g. "0"             : "609237100"
            numSavedJobs++;
            localStorage.setItem(jobNumber, `${rowObj.innerHTML}`);   //  e.g. "609237100"     : "<td>JS Programmer</td>...<td> *star icon* </td>"
            localStorage.setItem("savedJobsQty", `${numSavedJobs}`);   // e.g. "savedJobsQty"  : "1"
        } catch(e) {
            console.log("saving failed. sorry dude: " + e);
        }
    }
}


//////////  Alternative method
//
// const getJobs = async () => {
//
//     const response = await fetch(SEARCH_URL, {
//         method: 'GET',
//         headers: {
//             "Host": HOST,
//             "User-Agent": MY_EMAIL,
//             "Authorization-Key": API_KEY
//         }
//     });
//
//     jobsData = await response.json();
//     //console.log(jobsData);
// }
//
// getJobs();

//const MSEC_PER_DAY = 3600 * 24000 = (72000 + 14400) * 1000 = 86,400,000;

/*
let USER_IP_ADDR;

fetch('https://api.ipify.org/?format=json')
    .then( resp => resp.json() )
    .then( data => {
        console.log( data + '\n' + data.ip );
        USER_IP_ADDR = data.ip;
        console.log(USER_IP_ADDR);
    } );
*/

