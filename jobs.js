
// Use API to fetch jobs data posted in past 24 hours
// provided jobs are presorted by date, take first or last 10 jobs
// append 10 rows of jobs data to table
// update entry count to 10
// set event listeners for "show all" button, date input, and "update" button
// also set event listener for star icons if possible on dynamically created table data
// for "show all" button, append remaining jobs of our fetched data to table
// update entry count
// for "update" button, if selected date is not today, grab selected date and fetch jobs within 48 hour window prior
// update entry count
// for "add to favorites" star, push that job onto the array/JSON and save that data & jobQty to localStorage











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
