// import dotenv from './node_modules/dotenv';
// dotenv.config();

const SEARCH_URL = 'https://data.usajobs.gov/api/search?Keyword=Engineer&LocationName=Boston%20Massachusetts&Radius=25&SortField=opendate&ResultsPerPage=20&Page=1';
const HOST = 'data.usajobs.gov';
// const MY_EMAIL = process.env.MY_EMAIL;
// const API_KEY = process.env.API_KEY;
const MY_EMAIL = 'tonewardbound@gmail.com';
const API_KEY = 'm5CBAwSG9/nJutxR02TA4Hxx7nSfILFkGmeD1Rc74nM=';
const init = {
    method: 'GET',          // 'GET' is the default so this line is not required
    headers: {
        "Host": HOST,
        "User-Agent": MY_EMAIL,
        "Authorization-Key": API_KEY
    }
};

let jobsData = {};                  // JSON object
let numJobsReturned = 0;
let newRowEntry = {};               // DOM object
let numJobsDisplayed = 0;
let numSavedJobs = 0;

const jobsList = document.getElementById("jobs-list");          // Table body
const entryCount = document.getElementById("entry-count");      // Span for # of jobs displayed
const showAllForm = document.getElementById("form-show-all");
const showAllBtn = document.getElementById("show-all");




// Fetch jobs data via the API using a URL
const promise = fetch(SEARCH_URL, init)
    .then( resp => resp.json() )
    .then( data => {
        jobsData = formatJobsData( data["SearchResult"]["SearchResultItems"] );
        numJobsReturned = jobsData.length
        // console.log(promise);
        console.log(numJobsReturned);
        // console.log(jobsData);
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
            enableFilters();
            console.log( filterByCategory("General Engineering") );
        }
    });
}

/**
 *
 * @param jsonObj
 * @returns {*[]}
 */
function formatJobsData( jsonObj ) {
    // create an array of job objects with only the relevant data
    let jobsArr = [];
    jsonObj.forEach( item => {
        const thisJob = item["MatchedObjectDescriptor"];                            // simplify
        const newJob = { };

        newJob["jobID"] = item["MatchedObjectId"];                                // (number as a string)
        newJob["jobURL"] = thisJob["ApplyURI"][0];
        newJob["jobTitle"] = thisJob["PositionTitle"];
        newJob["jobCategory"] = thisJob["JobCategory"][0]["Name"];
        newJob["companyName"] = thisJob["OrganizationName"];
        newJob["jobLocation"] = thisJob["PositionLocationDisplay"];

        let payRate = String(thisJob["PositionRemuneration"][0]["MinimumRange"]);   // (number as a string)
        newJob["payRate"] = payRate.substr(0, payRate.length - 2);                // remove ".0"
        newJob["jobType"] = thisJob["PositionSchedule"][0]["Name"];

        let postDate = String( thisJob["PublicationStartDate"] );           // "YYYY-MM-DD"
        newJob["jobPostDate"] = postDate;
        newJob["postDateFormatted"] = String(
            new Date( postDate.replaceAll('-', '/')     // "YYYY/MM/DD" to avoid 1 day off
            )
        ).substr(4, 11);                                             // Omit day of week

        let closingDate = String( thisJob["ApplicationCloseDate"] );
        newJob["closeDateFormatted"] = String(
            new Date( closingDate.replaceAll('-', '/')
            )
        ).substr(4, 11);

        newJob["visible"] = true;
        newJob["sent"] = false;

        jobsArr.push(newJob);
    })
    return jobsArr;
}


// take starting job and how many to display
// append the rows of jobs data to table
// @TODO: refactor idea - to create all job table rows then use displayJobs to unhide them
/**
 * @param from
 * @param howMany
 */
function displayFirst10( ) {

    // take the lesser of:  the total # of jobs returned ...and... ith job we wish to see
    // const upto = numJobsReturned < (from + howMany) ? numJobsReturned : (from + howMany) ;

    for (let k = 0; k < 10; k++) {
        createRow( jobsData[k] );
        numJobsDisplayed++;
    }
    // update table row entry count
    entryCount.innerText = `the ${numJobsDisplayed} most recent`;
}

function displayJobs( jobsArr ) {

    jobsArr.forEach( job => {
        createRow( job );
        numJobsDisplayed++;
    })

    }
    // update table row entry count
    entryCount.innerText = `the ${numJobsDisplayed} most recent`;
}

function createRow( jobObj ) {
    newRowEntry = document.createElement('tr');
    newRowEntry.id = `${jobObj.jobID}`;
    console.log("jobID = " + `${jobObj.jobID}`);
    newRowEntry.innerHTML = `<td><a href="${jobObj.jobURL}" class="text-blue-700 underline">${jobObj.jobTitle}</a></td> 
                <td>${jobObj.companyName}</td>
                <td>${jobObj.jobLocation}</td>
                <td id="salary${jobObj.jobID}">$${jobObj.payRate}</td>
                <td>${jobObj.jobType}</td>
                <td>${jobObj.jobCategory}</td>
                <td>${jobObj.postDateFormatted}</td>
                <td>${jobObj.closeDateFormatted}</td>
                <td id="star${jobObj.jobID}"><i class="material-icons">star_border</i></td>
                <td id="share${jobObj.jobID}"><i class="material-icons">send</i></td>`;
    jobsList.appendChild(newRowEntry);

    const starCell = document.getElementById(`star${jobObj.jobID}`);
    const shareCell = document.getElementById(`share${jobObj.jobID}`);

    starCell.addEventListener('click', () => {
        // if that job doesn't already exist in local storage, then update icon and save job
                                                                        // @TODO: Does "" == null?  In case job is saved, deleted, and saved again
        if(localStorage.getItem(jobObj.jobID) == null) {
            starCell.innerHTML = "<i class=\"material-icons text-yellow-500\">star</i>";
            saveJob( jobObj.jobID, newRowEntry );
        }
        // else {
        //     starCell.innerHTML = "<i class=\"material-icons\">star_border</i>";
        // }
    });

    shareCell.addEventListener( 'click', () => {
        //const emailAddress = prompt("Where would you like to send this job?");
        window.open( `mailto:?&subject=Here's%20a%20job%20for%you&body=${jobObj.jobURL}`, '_blank')

        if( !jobObj.sent ) {
            shareCell.innerHTML = "<i class=\"material-icons text-green-600\">send</i>";
            jobObj.sent = true;
        }
    });
}

function saveJob( jobNumber, rowObj  ) {

    // try to save that job data & update # of jobs saved
    try {
        localStorage.setItem(`${numSavedJobs}`, jobNumber);        // e.g. "0"             : "609237100"
        numSavedJobs++;                                            // e.g. 1
        localStorage.setItem(jobNumber, `${rowObj.innerHTML}`);   //  e.g. "609237100"     : "<td>JS Programmer</td>...<td> *star icon* </td>"
        localStorage.setItem("savedJobsQty", `${numSavedJobs}`);   // e.g. "savedJobsQty"  : "1"
    } catch(e) {
        console.log("saving failed: " + e);
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

/*
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
        new Date( jobPostDate.replaceAll('-', '/')     // "YYYY/MM/DD" to avoid 1 day off
        )
    ).substr(4, 11);                                             // Omit day of week

    const closingDate = String( thisJob["ApplicationCloseDate"] );
    const closeDateFormatted = String(
        new Date( closingDate.replaceAll('-', '/')
        )
    ).substr(4, 11);

 */