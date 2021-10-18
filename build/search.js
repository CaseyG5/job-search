//const myEmail = '';
//const apiKey = '';    

const searchForm = document.getElementById('search-form');
const searchBox = document.getElementById('search-box');
let searchTerms = "";
let NEW_SEARCH_URL;
let myJobsData = {}; // JSON object

let myNumJobsReturned = 0;
searchForm.addEventListener('submit', event => {
  event.preventDefault();

  if (searchBox.value) {
    // ensure search field is not empty
    searchTerms = searchBox.value;
    searchTerms.replaceAll(' ', '%20'); // format spaces for search engine

    searchBox.value = "";
    NEW_SEARCH_URL = `https://data.usajobs.gov/api/search?Keyword=${searchTerms}&SortField=opendate&ResultsPerPage=10&Page=1`;
    getJobs(NEW_SEARCH_URL);
  }
});

const getJobs = async API_URL => {
  await fetch(API_URL, {
    headers: {
      "Host": HOST,   // HOST constant declared in jobs.js
      "User-Agent": myEmail,
      "Authorization-Key": apiKey
    }
  }).then(resp => resp.json()).then(json => {
    myJobsData = formatJobsData(json["SearchResult"]["SearchResultItems"]);
    myNumJobsReturned = myJobsData.length;
    console.log(myNumJobsReturned + " job(s) returned");
    console.log(myJobsData);
  });
};
