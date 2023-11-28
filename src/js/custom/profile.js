function GetProfile() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    // Replace 'YOUR_API_ENDPOINT' with the actual endpoint of your API
    const apiUrl = 'https://localhost:7286/api/Profile/GetProfile';

    // Replace 'YOUR_AUTH_TOKEN' with the actual token you want to send for validation
    const authToken = token;

    const headers = new Headers({
        'Authorization': `Bearer ${token}`
    });

    const requestOptions = {
        method: 'GET',
        headers: headers,
    };

    fetch(apiUrl + `?Username=${username}`, requestOptions)
        .then(response => {
            if (response.ok) {
                // Request was successful
                console.log("Data posted successfully");
                return response.json(); // Parse the response JSON
                // You can handle the response data here if needed
            } else {
                // Request failed
                console.error("Failed to post data");
            }
        })
        .then(data => {
            // Update the <span> elements with the response data
            document.getElementById("Email").textContent = data.email;
            document.getElementById("Name").textContent = data.name;
            document.getElementById("Profilepicture").src = "images/Profiles/" + data.email + "/Profile/" + data.picture;
            //document.getElementById("Name").textContent = data.p
            //document.getElementById("Profilepicturemodal").src = "images/Profiles/" + data.email + "/Profile/" + data.picture;
        })
        .catch(error => {
            console.error("Error:", error);
        });
}