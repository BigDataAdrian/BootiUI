// Define and call the function when the DOMContentLoaded event is fired
document.addEventListener('DOMContentLoaded', function() {
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
    url.searchParams.append('Email', Email);
    url.searchParams.append('Password', Password);
    alert(url);
    // Send the GET request
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Handle the response data
            localStorage.setItem('token', data.token); // Store the token in localStorage
            localStorage.setItem('username', data.username); // Store the username in localStorage
            window.location.href = 'index.html';
        })
        .catch((error) => {
            // Handle any errors, e.g., show an error message
            console.error('Error:', error + " " + apiUrl);
            alert(error);
        });
});