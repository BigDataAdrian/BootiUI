// Define and call the function when the DOMContentLoaded event is fired
document.addEventListener('DOMContentLoaded', function () {
    //localStorage.setItem('baseurl', 'https://booti.website/');
    localStorage.setItem('baseurl', 'https://localhost:7286/');
    console.log(localStorage.getItem('baseurl'));
});

document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const baseurl = localStorage.getItem('baseurl');
    const Email = document.getElementById('username').value;
    const Password = document.getElementById('password').value;
    const apiUrl = baseurl + 'api/Authenticator/Login';
    // Create the URL with query parameters 
    const url = new URL(apiUrl);
    url.searchParams.append('Username', Email);
    url.searchParams.append('Password', Password);
    // Send the GET request
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                return response.text().then((errorText) => {
                    throw new Error(errorText);
                });
            }
            return response.json(); // Assuming your API returns JSON

        })
        .then((data) => {
            // Handle the response data
            localStorage.setItem('token', data.token); // Store the token in localStorage
            localStorage.setItem('username', data.username); // Store the username in localStorage
            const redirectUrl = localStorage.getItem('redirectUrl');
            if (redirectUrl) {
                // Clear the stored URL after using it
                localStorage.removeItem('redirectUrl');
                window.location.href = redirectUrl;
            } else {
                // If no stored URL, redirect to a default page
                window.location.href = 'index.html';
            }
        })
        .catch((error) => {

            swal("Error", "" + error, "error");
        });
});

function handleCredentialResponse(response) {
    decodeJwtResponse(response.credential);
}

function decodeJwtResponse(data) {
    signIn(parseJwt(data))
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
// Callback function for successful sign-in
function signIn(googleUser) {
    const baseurl = localStorage.getItem('baseurl');
    // API endpoint URL
    const apiUrl = baseurl + 'api/Authenticator/Google';

    // Make a POST request using fetch
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Add any additional headers if needed
        },
        body: JSON.stringify(googleUser),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Assuming your API returns JSON
        })
        .then(data => {
            // Handle the response data
            localStorage.setItem('token', data.token); // Store the token in localStorage
            localStorage.setItem('username', data.username); // Store the username in localStorage
            const redirectUrl = localStorage.getItem('redirectUrl');
            if (redirectUrl) {
                // Clear the stored URL after using it
                localStorage.removeItem('redirectUrl');
                window.location.href = redirectUrl;
            } else {
                // If no stored URL, redirect to a default page
                window.location.href = 'index.html';
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}