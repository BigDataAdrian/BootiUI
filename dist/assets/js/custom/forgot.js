document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('forgot-form');

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get form input values
        const email = document.getElementById('email-address').value;

        // Create an object to send in the POST request
        const data = {
            email: email,
        };

        // Make an HTTP POST request to your backend API.
        fetch('https://localhost:7286/api/Register/forgot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (response.ok) {
                // Registration was successful, you can handle the response here
            } else {
                // Handle registration errors
                console.error('Forgot failed');
            }
        })
        .catch(error => {
            // Handle network errors or other issues
            console.error('Error:', error);
        });
    });
});
