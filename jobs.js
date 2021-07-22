const SEARCH_URL = 'https://data.usajobs.gov/api/search?Keyword=Software%20Engineer&LocationName=Boston%20Massachusetts&Radius=75&SortField=opendate&ResultsPerPage=20&Page=1';
const HOST = 'data.usajobs.gov';
const MY_EMAIL = 'tonewardbound@gmail.com';
const API_KEY = 'm5CBAwSG9/nJutxR02TA4Hxx7nSfILFkGmeD1Rc74nM=';
let jobsData = {};
let numJobsReturned = 0;
let savedJobs = [];
let numSavedJobs = 0;

// Use API to fetch jobs data for latest 10 or more jobs
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
        main();
});


function main() {

    let newRowEntry;
    const jobsList = document.getElementById("jobs-list");          // Table body
    const entryCount = document.getElementById("entry-count");      // Span for # of jobs displayed
    const showAllForm = document.getElementById("form-show-all");
    const dateInput = document.getElementById("date-input");
    const updateForm = document.getElementById("form-update");

    let dateChanged = false;
    const todaysDate = new Date();
    let chosenDate;
    const MSEC_per_DAY = 3600 * 24000;
    let dateLastChecked;


    DisplayJobs(0, 10);


    showAllForm.addEventListener('submit', (event) => {
        event.preventDefault();                           // prevent submit button & form from jumping the gun

        // append remaining jobs of our fetched data to table
        if(numJobsReturned > Number(entryCount.innerText) ) {
            DisplayJobs(10, numJobsReturned);
            // update entry count
            entryCount.innerText = numJobsReturned;
        }
    });

    dateInput.addEventListener('change', () => {
        dateChanged = true;
    });

    updateForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // if selected date is not today, grab selected date and fetch jobs within 48 hour window prior
        // (if today is selected do nothing)
        if(dateChanged) {
            // clear table
            jobsList.innerHTML = "";

            // grab chosen date, as a string, then use it to create a Date object
            chosenDate = String(dateInput.value);                   // "YYYY-MM-DD"
            chosenDate.replace('-', '/');       // "YYYY/MM/DD" to avoid 1 day off
            const pastDate = new Date(chosenDate);

            let days = ( todaysDate - pastDate ) / MSEC_per_DAY;    // convert milliseconds to days
            console.log( Math.floor(days) );                      // round down to integer

            // construct new URL
            const SEARCH_BY_DATE_URL = `https://data.usajobs.gov/api/search?Keyword=Web%20Developer&LocationName=Boston%20Massachusetts&Radius=75&DatePosted=${days}&SortField=opendate&ResultsPerPage=20&Page=1`;

            fetch(SEARCH_BY_DATE_URL, {
                method: 'GET',
                headers: {
                    "Host": HOST,
                    "User-Agent": MY_EMAIL,
                    "Authorization-Key": API_KEY
                }
            })
            .then(resp => resp.json() )
            .then(data => {
                    jobsData = data;
                    numJobsReturned = jobsData.length;
                    DisplayJobs(0, numJobsReturned);
                    // reset change
                    dateChanged = false;
            });
        }
    });


    // take starting job and how many to display
    // append the rows of jobs data to table
    function DisplayJobs(from, howMany) {
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
            const jobPostDate = String(
                new Date(
                    String(thisJob["PublicationStartDate"]).replace('-', '/')
                )
            ).substr(4, 11);

            newRowEntry = document.createElement('tr');
            newRowEntry.innerHTML = `<td><a href="${jobURL}" class="text-blue-700 underline">${jobTitle}</a>&nbsp; &nbsp;</td> 
                <td>${companyName}</td>
                <td>${jobLocation} &nbsp;</td>
                <td>$${payRate}</td>
                <td>${jobType}</td>
                <td>${jobPostDate} &nbsp;</td>
                <td>?</td>
                <td id="s${i}"><i class="material-icons">star_border</i></td>`;
            jobsList.appendChild(newRowEntry);

            const temp = document.getElementById(`s${i}`);
            temp.addEventListener('click', () => {
                if(temp.innerHTML === "<i class=\"material-icons\">star_border</i>") {
                    temp.innerHTML = "<i class=\"material-icons text-yellow-500\">star</i>";
                }
                else {
                    temp.innerHTML = "<i class=\"material-icons\">star_border</i>";
                }

                // push that job onto the array/JSON and save that data & jobQty to localStorage

                //localStorage.setItem("mySavedJobs", savedJobs);
                //localStorage.setItem("myJobsQty", numSavedJobs);
            })
        }
        // update table row entry count
        entryCount.innerText = upto;
    }
}


//

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


/*let USER_IP_ADDR;

fetch('https://api.ipify.org/?format=json')
    .then( resp => resp.json() )
    .then( data => {
        console.log( data + '\n' + data.ip );
        USER_IP_ADDR = data.ip;
        console.log(USER_IP_ADDR);
    } );


let ipDiv = document.getElementById('show-ip');
ipDiv.innerHTML = `<span>${USER_IP_ADDR}</span>`;*/
