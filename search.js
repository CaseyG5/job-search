import dotenv from 'dotenv';
dotenv.config();

const SEARCH_URL = 'https://data.usajobs.gov/api/search?Keyword=javascript&LocationName=Boston%20Massachusetts&Radius=75&SortField=opendate&ResultsPerPage=10&Page=1';
const HOST = 'data.usajobs.gov';
const MY_EMAIL = process.env.MY_EMAIL;
const API_KEY = process.env.API_KEY;

const searchForm = document.getElementById('search-form');
const searchBox = document.getElementById('search-box');
//const searchBtn = document.getElementById('search-btn');
let searchTerms = "";
let NEW_SEARCH_URL

let myJobsData = {};                  // JSON object
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
            myJobsData = formatJobsData( json["SearchResult"]["SearchResultItems"] );
            numJobsReturned = myJobsData.length;
            console.log( myJobsData );
        });

};