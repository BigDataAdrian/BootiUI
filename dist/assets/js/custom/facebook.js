window.fbAsyncInit = function () {
    FB.init({
        appId: '465753732469200',
        oauth: true,
        status: true, // check login status
        cookie: true, // enable cookies to allow the server to access the session
        xfbml: true // parse XFBML
    });
};
function fb_login() {
    FB.login(function (response) {

        if (response.authResponse) {
            console.log(response); // dump complete info
            const baseurl = localStorage.getItem('baseurl');
            // API endpoint URL
            const apiUrl = baseurl + 'api/Authenticator/Facebook';

            // Make a POST request using fetch
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any additional headers if needed
                },
                body: JSON.stringify(response.authResponse),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Credenciales invalidas o usuario sin acceso");
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
                    swal("Error", "" + error, "error");
                });

        } else {
            //user hit cancel button
            console.log('User cancelled login or did not fully authorize.');

        }
    }, {
        scope: 'public_profile,email'
    });
}
(function () {
    var e = document.createElement('script');
    e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
    e.async = true;
    document.getElementById('fb-root').appendChild(e);
}());