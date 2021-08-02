const SEARCH_URL = 'https://data.usajobs.gov/api/search?Keyword=javascript&LocationName=Boston%20Massachusetts&Radius=75&SortField=opendate&ResultsPerPage=10&Page=1';
const HOST = 'data.usajobs.gov';
const MY_EMAIL = 'tonewardbound@gmail.com';
const API_KEY = 'm5CBAwSG9/nJutxR02TA4Hxx7nSfILFkGmeD1Rc74nM=';

const searchForm = document.getElementById('search-form');
const searchBox = document.getElementById('search-box');
const searchBtn = document.getElementById('search-btn');
let searchTerms = "";
let NEW_SEARCH_URL

let jobsData = {};                  // JSON object
let numJobsReturned = 0;

searchForm.addEventListener( 'submit', (event) => {
    event.preventDefault();

    if (searchBox.value) {           // ensure search field is not empty
        searchTerms = searchBox.value;
        searchTerms.replaceAll(' ', '%20');     // format spaces for search engine
        searchBox.value = "";
        NEW_SEARCH_URL = `https://data.usajobs.gov/api/search?Keyword=${searchTerms}&SortField=opendate&ResultsPerPage=10&Page=1`;

        getJobs( NEW_SEARCH_URL );
    }
});

const getJobs = async ( API_URL ) => {

    await fetch(API_URL, {
        headers: {
            "Host": HOST,
            "User-Agent": MY_EMAIL,
            "Authorization-Key": API_KEY
        }
    }).then(resp => resp.json())
        .then(json => {
            jobsData = json["SearchResult"]["SearchResultItems"];
            numJobsReturned = jobsData.length;
            //displayJobs(0, 10);
            console.log( jobsData[0] )
        });

};