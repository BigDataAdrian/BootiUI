document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
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
                GetProfile();
                GetChats();
                document.getElementById('search').addEventListener('keyup', function () {
                    filterChats();
                });
            }
        }
    }
});

// Add a click event listener to the logout button
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', function () {
        // Remove the token from localStorage when the user logs out
        localStorage.removeItem('token');

        // Redirect to the login page or perform other logout actions
        window.location.href = 'login.html';
    });
}

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(atob(base64));
    } catch (e) {
        return null; // Invalid token
    }
}