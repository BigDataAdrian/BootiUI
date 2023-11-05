document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Create an object to send in the POST request
    const data = {
        username: username,
        password: password
    };

    // Send a POST request to the server
    fetch('https://localhost:7286/api/Authenticator/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // Parse the JSON response
        } else {
            throw new Error('Login failed');
        }
    })
    .then(data => {
        // Here, you receive the JWT token in the response
        const token = data.token;
        localStorage.setItem('token', token); // Store the token in localStorage
        localStorage.setItem('username', username); // Store the token in localStorage


        // Redirect the user to another page or perform additional actions
        window.location.href = 'index.html';
    })
    .catch(error => {
        console.error('Login error:', error);
        // Show an error message to the user
    });
});