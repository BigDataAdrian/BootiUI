document.addEventListener('DOMContentLoaded', function () {
    function getQueryStringParameter(parameter) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(parameter);
    }
    // Get the 'Token' value from the query string
    const queryStringParam = getQueryStringParameter('Token');

    // Check if the parameter exists before calling the function
    if (queryStringParam !== null) {
        localStorage.setItem('token', queryStringParam);
    } else {
        console.log("Query parameter 'Token' not found.");
        // Handle the case where the parameter is not present
    }

    const registrationForm = document.getElementById('forgot-form');

    registrationForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get form input values
        const token = localStorage.getItem('token');
        const password = document.getElementById('password').value;
        const repeat = document.getElementById('repeat').value;
        // Create an object to send in the POST request
        const data = {
            password: password,
            repeat: repeat,
            token: token
        };

        // Make an HTTP POST request to your backend API.
        const baseurl = localStorage.getItem('baseurl');
        fetch(baseurl + 'api/Register/reset', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (response.ok) {
                    alert("La contraseña se cambio correctamente");
                    // Redirect to login.html
                    window.location.href = 'login.html';
                } else {
                    // Handle registration errors
                    console.error('password failed');
                }
            })
            .catch(error => {
                // Handle network errors or other issues
                console.error('Error:', error);
            });
    });
});
