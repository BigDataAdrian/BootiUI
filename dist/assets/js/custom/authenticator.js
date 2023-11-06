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
            }
        }
    }
});

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(atob(base64));
    } catch (e) {
        return null; // Invalid token
    }
}

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
            document.getElementById("Profilepicturemodal").src = "images/Profiles/" + data.email + "/Profile/" + data.picture;
        })
        .catch(error => {
            console.error("Error:", error);
        });
}
function GetChats() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    // Replace 'YOUR_API_ENDPOINT' with the actual endpoint of your API
    const apiUrl = 'https://localhost:7286/api/Chats/LoadChats';

    // Replace 'YOUR_AUTH_TOKEN' with the actual token you want to send for validation
    const authToken = token;

    // Create a JSON object with the data you want to send
    const data = {
        Username: username
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
                return response.json(); // Parse the response JSON
                // You can handle the response data here if needed
            } else {
                // Request failed
                console.error("Failed to post data");
            }
        })
        .then(data => {
            // Loop through the response data and generate HTML for each item
            data.forEach(item => {
                // Create the list item element
                const listItem = document.createElement("li");
                listItem.classList.add("tyn-aside-item", "js-toggle-main",item.active);
                // Get the parent <ul> element by its ID
                const parentElement = document.getElementById("Chats");
                //preparate route
                const Picture = "images/Chats/" + item.username + "/Profile/" + item.picture
                // Create the inner HTML structure
                listItem.innerHTML = `
                    <div class="tyn-media-group" onclick="LoadChat('${item.username}')">
                        <div class="tyn-media tyn-size-lg">
                            <img src="${Picture}" alt="">
                        </div>
                        <div class="tyn-media-col">
                            <div class="tyn-media-row">
                                <h6 class="name">${item.title}</h6>
                                <div class="indicator varified">
                                    <!-- check-circle-fill -->
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                    </svg>
                                </div>
                            </div>
                            <div class="tyn-media-row has-dot-sap">
                                <p class="content">${item.description}</p>
                                <span class="meta">@${item.username}</span>
                            </div>
                        </div>
                        <div class="tyn-media-option tyn-aside-item-option">
                            <ul class="tyn-media-option-list">
                                <li class="dropdown">
                                    <button class="btn btn-icon btn-white btn-pill dropdown-toggle" data-bs-toggle="dropdown" data-bs-offset="0,0" data-bs-auto-close="outside">
                                        <!-- three-dots -->
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                        </svg>
                                    </button>
                                    <div class="dropdown-menu dropdown-menu-end">
                                        <ul class="tyn-list-links">
                                            <li><a href="#">
                                                    <!-- check -->
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                                                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                                                    </svg>
                                                    <span>Mark as Read</span>
                                                </a></li>
                                            <li><a href="#">
                                                    <!-- bell -->
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell" viewBox="0 0 16 16">
                                                        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
                                                    </svg>
                                                    <span>Mute Notifications</span>
                                                </a></li>
                                            <li><a href="contacts.html">
                                                    <!-- person -->
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                                                    </svg>
                                                    <span>View Profile</span>
                                                </a></li>
                                            <li class="dropdown-divider"></li>
                                            <li><a href="#callingScreen" data-bs-toggle="modal">
                                                    <!-- telephone -->
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone" viewBox="0 0 16 16">
                                                        <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
                                                    </svg>
                                                    <span>Audio Call</span>
                                                </a></li>
                                            <li><a href="#videoCallingScreen" data-bs-toggle="modal">
                                                    <!-- camera-video -->
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera-video" viewBox="0 0 16 16">
                                                        <path fill-rule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z" />
                                                    </svg>
                                                    <span>Video Call</span>
                                                </a></li>
                                            <li class="dropdown-divider"></li>
                                            <li><a href="#">
                                                    <!-- file-earmark-arrow-down -->
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-arrow-down" viewBox="0 0 16 16">
                                                        <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293V6.5z" />
                                                        <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                                                    </svg>
                                                    <span>Archive</span>
                                                </a></li>
                                            <li><a href="#deleteChat" data-bs-toggle="modal">
                                                    <!-- trash -->
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                                                    </svg>
                                                    <span>Delete</span>
                                                </a></li>
                                            <li><a href="#">
                                                    <!-- exclamation-triangle -->
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                                                        <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
                                                        <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
                                                    </svg>
                                                    <span>Report</span>
                                                </a></li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                `;

                // Append the generated list item to the parent element
                parentElement.appendChild(listItem);
                //Load data if active
                if (item.active == "active"){
                    LoadChat(item.username);
                }
            });
            let elm = document.querySelectorAll('.js-toggle-main');
                if (elm) {
                    elm.forEach(item => {
                        item.addEventListener('click', (e) => {
                            let isOption = e.target.closest('.tyn-aside-item-option');
                            elm.forEach(item => {
                                !isOption && item.classList.remove('active')
                            })
                            !isOption && item.classList.add('active');
                            !isOption && document.getElementById('tynMain').classList.toggle('main-shown');
                        })
                    })
                }
        })
        .catch(error => {
            console.error("Error:", error);
        });
}
function LoadChat(Chatusername) {
    //Load history and chat information
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const apiUrl = 'https://localhost:7286/api/Chats/GetChat';

    const headers = new Headers({
        'Authorization': `Bearer ${token}`
    });

    const requestOptions = {
        method: 'GET',
        headers: headers,
    };

    fetch(apiUrl + `?Username=${username}&Chatusername=${Chatusername}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Load the Chatname value into the span
            document.getElementById("Chatheader").textContent = data.title;
            document.getElementById("Chatusernameheader").textContent = data.username;
            document.getElementById("Chatpictureheader").src = "images/Chats/" + data.username + "/Profile/" + data.profilePicture;
            document.getElementById("Chatpictureinlineheader").src = "images/Chats/" + data.username + "/Profile/" + data.profilePicture;

            document.getElementById("Chatprofile").textContent = data.title;
            document.getElementById("Chatusernameprofile").textContent = data.username;
            document.getElementById("Chatpictureprofile").src = "images/Chats/" + data.username + "/Profile/" + data.profilePicture;
            document.getElementById("Chatpictureinlineprofile").src = "images/Chats/" + data.username + "/Back/" + data.backPicture;

            localStorage.setItem('chatusername',Chatusername); // Store the token in localStorage
            // You can access other properties from the data object here
            // Example: data.Description, data.Username
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}