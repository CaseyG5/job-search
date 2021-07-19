let USER_IP_ADDR;

fetch('https://api.ipify.org/?format=json')
    .then( resp => resp.json() )
    .then( data => {
        console.log( data + '\n' + data.ip );
        USER_IP_ADDR = data.ip;
        console.log(USER_IP_ADDR);
    } );


let ipDiv = document.getElementById('show-ip');
ipDiv.innerHTML = `<span>${USER_IP_ADDR}</span>`;
