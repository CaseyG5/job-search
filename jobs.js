const SEARCH_URL = 'https://data.usajobs.gov/api/search?Keyword=Software%20Engineer&LocationName=Boston%20Massachusetts&Radius=75&SortField=opendate&ResultsPerPage=20&Page=1';
const HOST = 'data.usajobs.gov';
const MY_EMAIL = DERAIL;
const API_KEY = SKI_SLOPE;

const jobsList = document.getElementById("jobs-list");          // Table body
const entryCount = document.getElementById("entry-count");      // Span for # of jobs displayed
const showAllForm = document.getElementById("form-show-all");
const showAllBtn = document.getElementById("show-all");
const dateInput = document.getElementById("date-input");
const updateForm = document.getElementById("form-update");
let chosenDate;
let dateChanged = false;

let jobsData = {};
let numJobsReturned = 0;
let numJobsDisplayed = 0;
let newRowEntry;
let numSavedJobs = 0;


// Use API with a search URL to fetch jobs data
fetch(SEARCH_URL, {
    method: 'GET',
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
            showAllBtn.setAttribute('value', 'disabled');
            showAllBtn.disabled = true;
            showAllBtn.classList.remove('text-black');
            showAllBtn.classList.add('text-gray-400');
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

            for(let i = numJobsDisplayed - 1; i > -1; i--) {
                const thisJobsDate = document.getElementById(`date${i}`).innerText;
                if(thisJobsDate < chosenDate) {                                     // @TODO: reverse logic
                    const row = document.getElementById(`row${i}`);
                    row.innerHTML = "";
                    row.classList.add('hidden');
                    numJobsDisplayed--;
                }
                else break;
            }
            entryCount.innerText = `the ${numJobsDisplayed} most recent`;
            dateChanged = false;
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

    for (let i = from; i < upto; i++) {
        const thisJob = jobsData[i]["MatchedObjectDescriptor"];
        const jobURL = thisJob["ApplyURI"][0];
        const jobTitle = thisJob["PositionTitle"];
        const companyName = thisJob["OrganizationName"];
        const jobLocation = thisJob["PositionLocationDisplay"];
        let payRate = String(thisJob["PositionRemuneration"][0]["MinimumRange"]);
        payRate = payRate.substr(0, payRate.length - 2);
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
        newRowEntry.id = `row${i}`;
        newRowEntry.innerHTML = `<td><a href="${jobURL}" class="text-blue-700 underline">${jobTitle}</a></td> 
                <td>${companyName}</td>
                <td>${jobLocation}</td>
                <td>$${payRate}</td>
                <td>${jobType}</td>
                <td>${postDateFormatted}</td>
                <td>${closeDateFormatted}</td>
                <td id="star${i}"><i class="material-icons">star_border</i></td>
                <td id="date${i}" class="hidden">${jobPostDate}</td>`;
        jobsList.appendChild(newRowEntry);

        const temp = document.getElementById(`star${i}`);
        temp.addEventListener('click', () => {
            if(temp.innerHTML === "<i class=\"material-icons\">star_border</i>") {
                temp.innerHTML = "<i class=\"material-icons text-yellow-500\">star</i>";
                saveJob( document.getElementById(`row${i}`), i );
            }
            else {
                temp.innerHTML = "<i class=\"material-icons\">star_border</i>";
            }

        });
        numJobsDisplayed++;
    }
    // update table row entry count
    entryCount.innerText = `the ${numJobsDisplayed} most recent`;
}

function saveJob( rowObj, rowID ) {
    console.log("attempting to save a job ;-)");
    // push that job onto the array/JSON and save that data & jobQty to localStorage
    try {
        localStorage.setItem(`${numSavedJobs}`, `${rowID}`);        // e.g. "0" : "5"
        numSavedJobs++;
        localStorage.setItem(`row${rowID}`, `${rowObj.innerHTML}`);   //  e.g. "row5" : "<td>JS Programmer</td>...<td> *star icon* </td>"
        localStorage.setItem("savedJobsQty", `${numSavedJobs}`);
    } catch(e) {
        console.log("saving failed. sorry dude: " + e);
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

