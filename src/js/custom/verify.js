document.addEventListener('DOMContentLoaded', function () {
    function getQueryStringParameter(parameter) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(parameter);
    }
    // Get the 'Token' value from the query string
    const queryStringParam = getQueryStringParameter('Token');

    // Check if the parameter exists before calling the function
    if (queryStringParam !== null) {
        Verify(queryStringParam);
    } else {
        console.log("Query parameter 'Token' not found.");
        // Handle the case where the parameter is not present
    }
});

function Verify(Token){
    //Load history and chat information
    const baseurl = localStorage.getItem('baseurl');
    const apiUrl = baseurl + 'api/Authenticator/Verify';

    const requestOptions = {
        method: 'GET',
    };

    fetch(apiUrl + `?Token=${Token}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.text());
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("Title").textContent = data.title;
            document.getElementById("Message").innerHTML  = data.message
        })
        .catch(data => {
            document.getElementById("Title").textContent = data.title;
            document.getElementById("Message").innerHTML  = data.message
        });
}