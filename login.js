const loginForm = document.getElementById('login-form');
const loginBtn = document.getElementById('login');
const username = document.getElementById('username');       // put here for simplicity instead of inside loginForm's event listener
const password = document.getElementById('password');       // put here for simplicity instead of inside loginForm's event listener
const criteriaMsg = document.getElementById('criteria');  // put here for simplicity instead of inside else, inside event listener

const eyeDiv = document.getElementById('eye-div');      // extras
const eye = document.getElementById('eye');             // extras
let visible = false;                                              // extras


loginForm.addEventListener('submit', (event) => {
    event.preventDefault();   // necessary to prevent submit button and form from jumping the gun

    if( usernameValid(username.value)  &&  passwordValid(password.value) ) {
        loginBtn.innerText = "LOGGING IN...";
        window.location.href = "dashboard.html";
    }
    else {
        // show message about username/password requirements
        criteriaMsg.classList.remove('delay-500','opacity-0');
        criteriaMsg.classList.add('opacity-100');
        // hide message upon click
        criteriaMsg.addEventListener('click', () => {
            criteriaMsg.classList.add('delay-500');
            criteriaMsg.classList.remove('opacity-100');
            criteriaMsg.classList.add('opacity-0');
        });
    }
});

// EXTRA:  toggle password visibility
eyeDiv.addEventListener('click', () => {
    if(!visible) {
        eye.innerText = "visibility";
        visible = true;
        password.setAttribute("type", "text");
    }
    else {
        eye.innerText = "visibility_off";
        visible = false;
        password.setAttribute("type", "password");
    }
});

/**
 *
 * @param username
 * @returns {boolean}
 */
function usernameValid(username) {
    return (username.length > 6);
}

/**
 *
 * @param password
 * @returns {boolean}
 */
function passwordValid(password) {
    return ( password.length > 8  &&  hasDigit(password) );
}

/**
 *
 * @param myStr
 * @returns {boolean}
 */
function hasDigit( myStr ) {
    for( let i = myStr.length - 1; i > -1; i-- ) {
        if(  Number(myStr.charAt(i)) >= 0  )
            return true;
    }
    return false;
}