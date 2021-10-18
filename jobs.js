//import { MY_EMAIL, API_KEY } from 'babel-plugin-dotenv';
const SEARCH_URL = 'https://data.usajobs.gov/api/search?Keyword=Engineer&LocationName=Boston%20Massachusetts&Radius=25&SortField=opendate&ResultsPerPage=20&Page=1';
const HOST = 'data.usajobs.gov';
//const myEmail = '';
//const apiKey = '';    
const init = {
  method: 'GET',
  // 'GET' is the default so this line is not required
  headers: {
    "Host": HOST,
    "User-Agent": myEmail,
    "Authorization-Key": apiKey
  }
};
let jobsData = []; // array of job objects

let numJobsReturned = 0;
let newRowEntry = {}; // DOM object

let numJobsDisplayed = 0;
const jobsList = document.getElementById("jobs-list"); // Table body

const entryCount = document.getElementById("entry-count"); // Span for # of jobs displayed

let qtySavedJobs = 0; // Fetch jobs data via the API using a URL

const promise = fetch(SEARCH_URL, init).then(resp => resp.json()).then(data => {
  jobsData = formatJobsData(data["SearchResult"]["SearchResultItems"]);
  numJobsReturned = jobsData.length;
  displayJobs(0, 10);
});
/**
 *
 * @param jsonObj
 * @returns {*[]}
 */

function formatJobsData(jsonObj) {
  // create an array of job objects with only the relevant data
  let jobsArr = [];
  jsonObj.forEach(item => {
    const thisJob = item["MatchedObjectDescriptor"]; // simplify

    const newJob = {};
    newJob["jobID"] = item["MatchedObjectId"]; // (number as a string)

    newJob["jobURL"] = thisJob["ApplyURI"][0];
    newJob["jobTitle"] = thisJob["PositionTitle"];
    newJob["jobCategory"] = thisJob["JobCategory"][0]["Name"];
    newJob["companyName"] = thisJob["OrganizationName"];
    newJob["jobLocation"] = thisJob["PositionLocationDisplay"];
    let payRate = String(thisJob["PositionRemuneration"][0]["MinimumRange"]); // (number as a string)

    newJob["payRate"] = payRate.substr(0, payRate.length - 2); // remove ".0"

    newJob["jobType"] = thisJob["PositionSchedule"][0]["Name"];
    let postDate = String(thisJob["PublicationStartDate"]); // "YYYY-MM-DD"

    newJob["jobPostDate"] = postDate;
    newJob["postDateFormatted"] = String(new Date(postDate.replaceAll('-', '/') // "YYYY/MM/DD" to avoid 1 day off
    )).substr(4, 11); // Omit day of week

    let closingDate = String(thisJob["ApplicationCloseDate"]);
    newJob["closeDateFormatted"] = String(new Date(closingDate.replaceAll('-', '/'))).substr(4, 11);
    newJob["sent"] = false;
    jobsArr.push(newJob);
  });
  return jobsArr;
} // take starting job and how many to display
// append the rows of jobs data to table

/**
 *
 * @param from
 * @param howMany
 */


function displayJobs(from, howMany) {
  const upto = from + howMany <= numJobsReturned ? from + howMany : numJobsReturned;

  for (let k = from; k < upto; k++) {
    createRow(jobsData[k]);
    numJobsDisplayed++;
  } // update table row entry count


  entryCount.innerText = `${numJobsDisplayed}`;
} // function displayFiltered( jobsArr ) {
//     jobsArr.forEach( job => {
//         createRow( job );
//         numJobsDisplayed++;
//     })
//     entryCount.innerText = `${numJobsDisplayed}`;
// }


function createRow(job) {
  newRowEntry = document.createElement('tr');
  newRowEntry.id = `${job.jobID}`;
  newRowEntry.innerHTML = `<td><a href="${job.jobURL}" class="text-blue-700 underline">${job.jobTitle}</a></td> 
                <td>${job.companyName}</td>
                <td>${job.jobLocation}</td>
                <td>$${job.payRate}</td>
                <td>${job.jobType}</td>
                <td>${job.jobCategory}</td>
                <td>${job.postDateFormatted}</td>
                <td>${job.closeDateFormatted}</td>
                <td id="star${job.jobID}" class="text-center"><i class="material-icons">star_border</i></td>
                <td class="text-center"><a href="mailto:?&subject=Here's%20a%20job%20for%you&body=${job.jobURL}" class="share"><i class="material-icons visited:text-green-600">send</i></a></td>`;
  jobsList.appendChild(newRowEntry);
  const starCell = document.getElementById(`star${job.jobID}`);
  starCell.addEventListener('click', () => {
    // if that job doesn't already exist in local storage, then update icon and save job
    // @TODO: Does "" == null?  In case job is saved, deleted, and saved again
    if (localStorage.getItem(job.jobID) == null) {
      starCell.innerHTML = "<i class=\"material-icons text-yellow-500\">star</i>";
      saveJob(job.jobID, document.getElementById(`${job.jobID}`));
    } // else {
    //     starCell.innerHTML = "<i class=\"material-icons\">star_border</i>";
    // }

  });
}

function saveJob(jobNumber, rowObj) {
  // try to save that job data & update # of jobs saved
  try {
    qtySavedJobs = Number(localStorage.getItem("savedJobsQty")) | 0;
    console.log("next saved job index: " + qtySavedJobs);
    localStorage.setItem(`${qtySavedJobs}`, jobNumber); // e.g. "0"             : "609237100"

    localStorage.setItem(jobNumber, `${rowObj.innerHTML}`); //  e.g. "609237100"     : "<td>JS Programmer</td>...<td> *star icon* </td>"

    console.log("saving job " + jobNumber);
    qtySavedJobs++;
    localStorage.setItem("savedJobsQty", `${qtySavedJobs}`); // e.g. "savedJobsQty"  : "1"
  } catch (e) {
    console.log("saving failed: " + e);
  }
} //////////  Alternative method
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
