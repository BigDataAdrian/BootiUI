document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (!token) {
        // No token found, redirect to the login page
        window.location.href = 'login.html';
    } else {
        // Token exists, let's validate it
        const tokenData = parseJwt(token); // A function to parse JWT tokens

        if (tokenData && tokenData.exp) {
            const tokenExpirationTimestamp = tokenData.exp * 1000; // Convert seconds to milliseconds
            const currentTimestamp = Date.now();

            if (currentTimestamp > tokenExpirationTimestamp) {
                // Token has expired, redirect to the login page
                window.location.href = 'login.html';
            } else {
                // Token is valid, proceed to load your index.html
                GetProfile(token,username);
            }
        }
    }
});

function GetProfile(token,username) {
    // Replace 'YOUR_API_ENDPOINT' with the actual endpoint of your API
    const apiUrl = 'https://localhost:7286/api/Profile/LoadProfile';

    // Replace 'YOUR_AUTH_TOKEN' with the actual token you want to send for validation
    const authToken = token;

    // Create a JSON object with the data you want to send
    const data = {
        Email: username
    };

    // Send a POST request to the API
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}` // Include the token in the 'Authorization' header
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            // Request was successful
            console.log("Data posted successfully");
            // You can handle the response data here if needed
        } else {
            // Request failed
            console.error("Failed to post data");
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}