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
                document.getElementById('search').addEventListener('keyup', function () {
                    filterChats();
                });
                GetChats();
            }
        }
    }
    LoadColorTheme();
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


function filterChats() {
    var chatFilterInput = document.getElementById('search');
    var chatContainer = document.getElementById('Chats');
    var filterText = chatFilterInput.value.toLowerCase();

    // Get all chat items with class "tyn-aside-item"
    var chatItems = chatContainer.querySelectorAll('.tyn-aside-item');

    chatItems.forEach(function (chatItem) {
        var chatName = chatItem.querySelector('.name').textContent.toLowerCase();
        var chatContent = chatItem.querySelector('.content').textContent.toLowerCase();

        // Check if the name or content contains the filter text
        if (chatName.includes(filterText) || chatContent.includes(filterText)) {
            chatItem.style.display = 'block'; // Show the chat item
        } else {
            chatItem.style.display = 'none'; // Hide the chat item
        }
    });
}
function GetChats() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const baseurl = localStorage.getItem('baseurl');
    const apiUrl = baseurl + 'api/Contacts/LoadChats';
    const authToken = token;

    const data = {
        Username: username
    };

    // Send a POST request to the API
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}` // Include the token in the 'Authorization' header
        }
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
                listItem.classList.add("tyn-aside-item", "js-toggle-main", item.active);
                // Get the parent <ul> element by its ID
                const parentElement = document.getElementById("Chats");
                //preparate route
                const Picture = baseurl + "api/Files/GetChatProfilePicture?imageName=" + item.picture;
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
                    </div>
                `;

                // Append the generated list item to the parent element
                parentElement.appendChild(listItem);
                //Load data if active
                // if (item.active == "active") {
                //     LoadChat(item.username);
                // }
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
    const baseurl = localStorage.getItem('baseurl');
    const apiUrl = baseurl + 'api/Contacts/GetChat';

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
            //reset main chat window
            // Get the element by its ID
            var element = document.getElementById("tynMain");

            // Make the element visible by setting its display style to "block"
            element.style.display = "block";
            // Load the Chatname value into the span
            document.getElementById("Chatheader").textContent = data.title;
            document.getElementById("Chatdescription").textContent = data.description;
            document.getElementById("Chatusernameheader").textContent = '@' + data.username;
            const Picture = baseurl + "api/Files/GetChatProfilePicture?imageName=" + data.profilePicture;
            document.getElementById("Chatpictureheader").src = Picture;
            const Cover = baseurl + "api/Files/GetChatCoverPicture?imageName=" + data.backPicture;
            document.getElementById("Chatpicturecover").src =Cover;
            document.getElementById('facebook').href = data.facebook;
            document.getElementById('twitter').href = data.twitter;
            document.getElementById('instagram').href = data.instagram;
            document.getElementById('tiktok').href = data.tiktok;
            document.getElementById("Phone").textContent = data.phone;
            document.getElementById("City").textContent = data.city;
            document.getElementById("Email").textContent = data.email;

            localStorage.setItem('chatusername', Chatusername); // Store the token in localStorage

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function LoadColorTheme(){
    const savedColor = localStorage.getItem('selectedColor');
    if (savedColor) {
      const root = document.documentElement;
      root.style.setProperty('--bs-primary', savedColor);
    }
}