document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registration-form');

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get form input values
        const username = document.getElementById('username').value;
        const email = document.getElementById('email-address').value;
        const password = document.getElementById('password').value;
        const repeatPassword = document.getElementById('repeat-password').value;
        const privacyAgreeCheckbox = document.getElementById('privacy-term-agree');

        // Check if the passwords match
        if (password !== repeatPassword) {
            alert('Las contraseñas no coinciden.');
            return; // Don't submit the form
        }

        // Check if the privacy agreement checkbox is checked
        if (!privacyAgreeCheckbox.checked) {
            alert('Debes aceptar los términos y condiciones de privacidad.');
            return; // Don't submit the form
        }

        // Create an object to send in the POST request
        const data = {
            username: username,
            email: email,
            password: password,
        };

        // Make an HTTP POST request to your backend API.
        const baseurl = localStorage.getItem('baseurl');
        fetch(baseurl + 'api/Register/register', {
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
                console.error('Registration failed');
            }
        })
        .catch(error => {
            // Handle network errors or other issues
            console.error('Error:', error);
        });
    });
});
