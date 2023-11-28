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
        const baseurl = localStorage.getItem('baseurl');
        fetch(baseurl+ 'api/Register/forgot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (response.ok) {
                alert("Se envio un correo con el link de recuperacion");
                window.location.reload();
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
