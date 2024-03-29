document.addEventListener('DOMContentLoaded', function () {
    GetProfile();
    GetChats();
    processQueryString();
    ColorTheme();
});
document.getElementById('InputType').addEventListener('keypress', function (e) {
    // Check if the pressed key is Enter (keycode 13)
    if (e.keyCode === 13) {
        // Check if the target of the event is an input element with a specific class or other identifying criteria
        if (e.target.tagName === 'INPUT' && e.target.classList.contains('tyn-chat-form-input')) {
            // Call your message handling function with the message
            message(e.target.value,e.target.value);
        }
    }
});

// Function to read the query string parameter and call another function
function processQueryString() {
    // Function to get the value of a parameter from the query string
    function getQueryStringParameter(parameter) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(parameter);
    }
    // Get the 'Booti' value from the query string
    const queryStringParam = getQueryStringParameter('Chat');

    // Check if the parameter exists before calling the function
    if (queryStringParam !== null) {
        LoadChatFromQuery(queryStringParam)
    } else {
        console.log("Query parameter 'Booti' not found.");
        // Handle the case where the parameter is not present
    }
}

document.addEventListener('change', function (event) {
    var target = event.target;
    if (target.classList.contains('file-upload')) {
        var files = target.files;
        var formData = new FormData();

        for (var i = 0; i < files.length; i++) {
            formData.append('myFiles[]', files[i]);
        }

        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const chatusername = localStorage.getItem('chatusername');
        const baseurl = localStorage.getItem('baseurl');
        var xhr = new XMLHttpRequest();
        xhr.open('POST', baseurl + 'api/Chats/Upload?Username=' + encodeURIComponent(username) + '&Chatusername=' + encodeURIComponent(chatusername), true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var responseData = JSON.parse(xhr.responseText);
                var files = responseData.files;
                let chatReply = document.querySelector('#tynReply');
                let chatBody = document.querySelector('#tynChatBody');

                let chatBubble = "";
                files.forEach(function (file) {
                    chatBubble += file;
                });

                let outgoingWraper = `
                <div class="tyn-reply-item outgoing">
                <div class="tyn-reply-group"></div>
                </div>
                `
                // Find the first element with the specified class
                var itemList = document.querySelector(".tyn-reply-item");
                // Check if the element exists
                if (itemList) {
                    // Element with the class exists
                    if (!chatReply.querySelector('.tyn-reply-item').classList.contains('outgoing')) {
                        responseData !== "" && chatReply.insertAdjacentHTML("afterbegin", outgoingWraper);
                        responseData !== "" && chatReply.querySelector('.tyn-reply-item .tyn-reply-group').insertAdjacentHTML("beforeend", chatBubble);
                    } else {
                        responseData !== "" && chatReply.querySelector('.tyn-reply-item .tyn-reply-group').insertAdjacentHTML("beforeend", chatBubble);
                    }
                } else {
                    responseData !== "" && chatReply.insertAdjacentHTML("afterbegin", outgoingWraper);
                    responseData !== "" && chatReply.querySelector('.tyn-reply-item .tyn-reply-group').insertAdjacentHTML("beforeend", chatBubble);
                }

                let simpleBody = SimpleBar.instances.get(document.querySelector('#tynChatBody'));
                let height = chatBody.querySelector('.simplebar-content > *').scrollHeight;
                simpleBody.getScrollElement().scrollTop = height;

                answer("","");
            }
        };
        xhr.onerror = function () {
            console.log('Error occurred during the request.');
        };

        xhr.send(formData);
    }
});

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

function GetProfile() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const baseurl = localStorage.getItem('baseurl');
    const apiUrl = baseurl + 'api/Profile/GetProfile';

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
            document.getElementById("Profilepicturemodal").src = baseurl + "api/Files/GetProfilePicture?imageName=" + data.picture;
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

function GetChats() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const baseurl = localStorage.getItem('baseurl');
    const apiUrl = baseurl + 'api/Chats/LoadChats';

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
                listItem.classList.add("tyn-aside-item", "js-toggle-main", item.active);
                listItem.id = "Chat_" + item.username;
                listItem.onclick = function () {
                    LoadChat(item.username);
                };
                // Get the parent <ul> element by its ID
                const parentElement = document.getElementById("Chats");
                //preparate route

                const Picture = baseurl + "api/Files/GetChatProfilePicture?imageName=" + item.picture;
                // Create the inner HTML structure
                var Certified = "";
                if (item.certified == 1) {
                    Certified = `<div class="indicator varified">
                    <!-- check-circle-fill -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg>
                    </div>`
                }
                listItem.innerHTML = `
                    <div class="tyn-media-group">
                        <div class="tyn-media tyn-size-lg">
                            <img src="${Picture}" alt="">
                        </div>
                        <div class="tyn-media-col">
                            <div class="tyn-media-row">
                                <h6 class="name">${item.title}</h6>
                                ${Certified}
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
                const urlParams = new URLSearchParams(window.location.search);
                var ValidateQuery = urlParams.get('Chat');
                if (item.active == "active" && ValidateQuery == null) {
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
    const baseurl = localStorage.getItem('baseurl');
    const apiUrl = baseurl + 'api/Chats/GetChat';

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
            let elm = document.querySelectorAll('.js-toggle-main');
            if (elm) {
                elm.forEach(item => {
                    item.classList.remove('active')
                    item.classList.add('inactive');
                })
            }

            // Retrieve the element by ID
            const retrievedElement = document.getElementById("Chat_" + Chatusername);

            // Check if the element is found before trying to add classes
            if (retrievedElement) {
                // Add the same classes to the element
                retrievedElement.classList.add("tyn-aside-item", "js-toggle-main", 'active');
            }
            // Get the element by its ID

            // Load the Chatname value into the span
            document.getElementById("Chatheader").textContent = data.title;
            document.getElementById("Chatusernameheader").textContent = data.username;
            document.getElementById("Chatpictureheader").src = baseurl + "api/Files/GetChatProfilePicture?imageName=" + data.profilePicture;
            document.getElementById("Chatpictureinlineheader").src = baseurl + "api/Files/GetChatProfilePicture?imageName=" + data.profilePicture;

            document.getElementById("Chatprofile").textContent = data.title;
            document.getElementById("Chatusernameprofile").textContent = data.username;
            document.getElementById("Chatpictureprofile").src = baseurl + "api/Files/GetChatProfilePicture?imageName=" + data.profilePicture;
            document.getElementById("Chatpictureinlineprofile").src = baseurl + "api/Files/GetChatCoverPicture?imageName=" + data.coverPicture;

            var imgElement = document.getElementById("Chatpictureinlineheader");
            localStorage.setItem('chatusername', Chatusername); // Store the token in localStorage
            // History
            let chatBody = document.querySelector('#tynChatBody');
            let chatReply = document.querySelector('#tynReply');

            chatReply.innerHTML = "";

            data.history.forEach(message => {
                var uuid = generateUUID();
                if (message.origin == 1) {
                    let getInput = message.message;
                    let chatBubble = getInput;
                    let outgoingWraper = `
                        <div id="${uuid}" class="tyn-reply-item outgoing">
                          <div class="tyn-reply-group"></div>
                        </div>
                        `
                    // Find the first element with the specified class
                    var itemList = document.querySelector(".tyn-reply-item");
                    // Check if the element exists
                    if (itemList) {
                        // Element with the class exists
                        if (!chatReply.querySelector('.tyn-reply-item').classList.contains('outgoing')) {
                            getInput !== "" && chatReply.insertAdjacentHTML("afterbegin", outgoingWraper);
                            getInput !== "" && chatReply.querySelector('.tyn-reply-item .tyn-reply-group').insertAdjacentHTML("beforeend", chatBubble);
                        } else {
                            getInput !== "" && chatReply.querySelector('.tyn-reply-item .tyn-reply-group').insertAdjacentHTML("beforeend", chatBubble);
                        }
                    } else {
                        getInput !== "" && chatReply.insertAdjacentHTML("afterbegin", outgoingWraper);
                        getInput !== "" && chatReply.querySelector('.tyn-reply-item .tyn-reply-group').insertAdjacentHTML("beforeend", chatBubble);
                    }

                    let simpleBody = SimpleBar.instances.get(document.querySelector('#tynChatBody'));
                    let height = chatBody.querySelector('.simplebar-content > *').scrollHeight;
                    simpleBody.getScrollElement().scrollTop = height;
                }

                if (message.origin == 2) {
                    let text = message.message;
                    var srcValue = imgElement.getAttribute("src");
                    let chatAvatar = `<div class="tyn-reply-avatar">
                        <div class="tyn-media tyn-size-md tyn-circle">
                            <img src="${srcValue}" alt="">
                        </div>
                    </div>
                    `
                    let chatBubble = text;
                    let inputEntry = '';

                    let incominggWraper = `
                    <div id="${uuid}" class="tyn-reply-item incoming">
                        ${chatAvatar}
                    <div class="tyn-reply-group"></div>
                    </div>
                    `;
                    // Find the first element with the specified class
                    var itemList = document.querySelector(".tyn-reply-item");
                    // Check if the element exists
                    if (itemList) {
                        // Element with the class exists
                        if (!chatReply.querySelector('.tyn-reply-item').classList.contains('incoming')) {
                            text !== "" && chatReply.insertAdjacentHTML("afterbegin", incominggWraper);
                            text !== "" && chatReply.querySelector('.tyn-reply-item .tyn-reply-group').insertAdjacentHTML("beforeend", chatBubble);
                        } else {
                            text !== "" && chatReply.querySelector('.tyn-reply-item .tyn-reply-group').insertAdjacentHTML("beforeend", chatBubble);
                        }
                    } else {
                        text !== "" && chatReply.insertAdjacentHTML("afterbegin", incominggWraper);
                        text !== "" && chatReply.querySelector('.tyn-reply-item .tyn-reply-group').insertAdjacentHTML("beforeend", chatBubble);
                    }

                    let simpleBody = SimpleBar.instances.get(document.querySelector('#tynChatBody'));
                    let height = chatBody.querySelector('.simplebar-content > *').scrollHeight;
                    simpleBody.getScrollElement().scrollTop = height;
                }
            });

            // Get the element by its ID
            const divElement = document.getElementById("InputType");
            const chatHelper = document.getElementById('Helper');
            // Set the new HTML content using innerHTML
            divElement.innerHTML = data.input;
            chatHelper.innerHTML = data.helper;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function UploadClick() {
    var fileInput = document.querySelector('#file-upload-button');
    fileInput.click(); // Trigger the click event on the file input
}

function sendinput() {
    // Get the element by ID
    var inputElement = document.getElementById("Message");

    // Check if the element is a textarea
    if (inputElement.tagName.toLowerCase() === 'textarea') {
        // It's a textarea, get the value
        var inputValue = inputElement.value;
        message(inputValue,inputValue);
    } else if (inputElement.tagName.toLowerCase() === 'input') {
        // It's an input, get the value
        var inputValue = inputElement.value;

        message(inputValue,inputValue);
    }
}

function SendSelect(selectElement) {
    // Get the selected option value
    var selectedValue = selectElement.options[selectElement.selectedIndex].value;
    var selectedText = selectElement.options[selectElement.selectedIndex].text;
    // Do something with the selected value (e.g., log it)
    message(selectedValue,selectedText);
}

function message(value, text) {

    var uuid = generateUUID();
    // Get the div with the id "tynChatInput"
    const chatInputDiv = document.getElementById("InputType");

    // Get all form elements inside the div
    const formElements = chatInputDiv.querySelectorAll("input, select, button");

    // Disable each form element
    formElements.forEach((element) => {
        element.disabled = true;
    });

    // Get the specific element by its id
    const inputElement = document.getElementById("general");

    // Disable the element
    if (inputElement) {
        inputElement.disabled = true;
    }

    let chatReply = document.querySelector('#tynReply');
    let chatBody = document.querySelector('#tynChatBody');

    let getInput = text;
    let chatBubble = `
        <div id="${uuid}" class="tyn-reply-bubble">
            <div class="tyn-reply-text">
                ${getInput}
            </div>
        </div>
        `;
    let outgoingWraper = `
        <div  class="tyn-reply-item outgoing">
          <div class="tyn-reply-group"></div>
        </div>
        `
    // Find the first element with the specified class
    var itemList = document.querySelector(".tyn-reply-item");
    // Check if the element exists
    if (itemList) {
        // Element with the class exists
        if (!chatReply.querySelector('.tyn-reply-item').classList.contains('outgoing')) {
            getInput !== "" && chatReply.insertAdjacentHTML("afterbegin", outgoingWraper);
            getInput !== "" && chatReply.querySelector('.tyn-reply-item .tyn-reply-group').insertAdjacentHTML("beforeend", chatBubble);
        } else {
            getInput !== "" && chatReply.querySelector('.tyn-reply-item .tyn-reply-group').insertAdjacentHTML("beforeend", chatBubble);
        }
    } else {
        getInput !== "" && chatReply.insertAdjacentHTML("afterbegin", outgoingWraper);
        getInput !== "" && chatReply.querySelector('.tyn-reply-item .tyn-reply-group').insertAdjacentHTML("beforeend", chatBubble);
    }

    const Scroll = document.getElementById(uuid);
    Scroll.scrollIntoView({ behavior: "smooth" });

    // let simpleBody = SimpleBar.instances.get(document.querySelector('#tynChatBody'));
    // let height = chatBody.querySelector('.simplebar-content > *').scrollHeight;
    // simpleBody.getScrollElement().scrollTop = height;

    answer(value, getInput);
}

function generateUUID() {
    // Generate a random UUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function answer(value,text) {
    showAndEnableTypingEffect();
    let chatReply = document.querySelector('#tynReply');
    let chatBody = document.querySelector('#tynChatBody');
    // Find the img element by its id
    var imgElement = document.getElementById("Chatpictureinlineheader");
    var srcValue = imgElement.getAttribute("src");
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const chatusername = localStorage.getItem('chatusername');

    let chatAvatar = `<div class="tyn-reply-avatar">
        <div class="tyn-media tyn-size-md tyn-circle">
            <img src="${srcValue}" alt="">
        </div>
    </div>
    `
    let chatBubble = '';
    let inputEntry = '';
    let helper = '';
    let LastId = '';
    //post
    // Define the data you want to send as the request body
    const requestData = {
        Value: value,
        Message: text,
        Username: username,
        Chatusername: chatusername,
        Parameters: []
    };
    // Obtaining the query parameters from the current URL
    const queryParams = new URLSearchParams(window.location.search);

    // Iterating over the query parameters and populating the Parameters list
    for (const [key, value] of queryParams.entries()) {
        // Creating a Querys object for each parameter-value pair
        const queryObject = {
            Parameter: key,
            Value: value
        };

        // Adding the queryObject to the Parameters list
        requestData.Parameters.push(queryObject);
    }
    // Make an HTTP POST request to the endpoint
    const baseurl = localStorage.getItem('baseurl');
    fetch(baseurl + 'api/Chats/Message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token, // If you have authorization in place
        },
        body: JSON.stringify(requestData)
    })
        .then(response => {
            if (response.ok) {
                // HTTP status code 200 indicates success
                return response.json();
            } else {
                // Handle non-200 status codes (e.g., 500 for server error)
                throw new Error('Request failed with status: ' + response.status);
            }
        })
        .then(data => {
            //validate answers
            data.answer.forEach(answer => {
                // Access properties of each answer object
                chatBubble += answer;
            });
            inputEntry = data.input;
            helper = data.helper;
            LastId = data.scrollId;
        })
        .finally(() => {
            hideAndDisableTypingEffect();
            // Get the element by its ID
            const divElement = document.getElementById("InputType");
            // Set the new HTML content using innerHTML
            divElement.classList.add('hide');
            // After the transition duration, update the content and remove the class
            setTimeout(() => {
                // Get the element by its ID
                const chatHelper = document.getElementById('Helper');
                chatHelper.innerHTML = helper;
                divElement.innerHTML = inputEntry;
                divElement.classList.remove('hide');
                // Find the input and textarea elements within the div
                const inputElement = divElement.querySelector("input[type='text']");
                const textareaElement = divElement.querySelector("textarea");

                // Check if the input element was found
                if (inputElement) {
                    // Set focus to the input element
                    inputElement.focus();
                } else if (textareaElement) {
                    // If there is no input, check if a textarea element exists and set focus to it
                    textareaElement.focus();
                }

                var uuid = generateUUID();
                let incominggWraper = `
                <div id="${uuid}" class="tyn-reply-item incoming">
                    ${chatAvatar}
                <div class="tyn-reply-group"></div>
                </div>
                `
                if (!chatReply.querySelector('.tyn-reply-item').classList.contains('incoming')) {
                    chatReply.insertAdjacentHTML("afterbegin", incominggWraper);
                    chatReply.querySelector('.tyn-reply-item .tyn-reply-group').insertAdjacentHTML("beforeend", chatBubble);
                } else {
                    chatReply.querySelector('.tyn-reply-item .tyn-reply-group').insertAdjacentHTML("beforeend", chatBubble);
                }
                const Scroll = document.getElementById(LastId);
                Scroll.scrollIntoView({ behavior: "smooth" });
            }, 250);




        })
        .catch(error => {
            // Handle any errors that occurred during the fetch or processing
            console.error('Error:', error);
        });
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

function LoadChatFromQuery(chatusername) {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const baseurl = localStorage.getItem('baseurl');
    const requestData = {
        Username: username,
        Chatusername: chatusername
    };

    fetch(baseurl + 'api/Chats/AddNewChat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token, // If you have authorization in place
        },
        body: JSON.stringify(requestData)
    })
        .then(response => {
            if (response.ok) {
                // HTTP status code 200 indicates success
                if (response.status == 207) {
                    return response.text().then((errorText) => {
                        swal("Error", "" + errorText, "error");
                    });

                } else {
                    return response.json();
                }
            } else {
                // Handle non-200 status codes (e.g., 500 for server error)

                throw new Error('Request failed with status: ' + response.status);
            }
        })
        .then(item => {
            if (item.exist == 0) {

                let elm = document.querySelectorAll('.js-toggle-main');
                if (elm) {
                    elm.forEach(item => {
                        item.classList.remove('active')
                        item.classList.add('inactive');
                    })
                }

                const listItem = document.createElement("li");
                listItem.classList.add("tyn-aside-item", "js-toggle-main", "active");
                listItem.id = "Chat_" + item.username;
                listItem.onclick = function () {
                    LoadChat(item.username); // Replace 'booti' with the desired value or use item.active if applicable
                };
                // Get the parent <ul> element by its ID
                const parentElement = document.getElementById("Chats");
                //preparate route
                const Picture = baseurl + "api/Files/GetChatProfilePicture?imageName=" + item.picture;
                // Create the inner HTML structure
                listItem.innerHTML = `
                    <div class="tyn-media-group">
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
            }
            LoadChat(item.username);
            const tynmainElement = document.getElementById('tynMain');

            // Check if the element exists
            if (tynmainElement) {
                // Add a new attribute to the 'style' property
                tynmainElement.classList.add('main-shown');
                // Replace 'your-css-property' with the actual CSS property you want to add,
            }
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch or processing
            console.error('Error:', error);
        });
}

function ColorTheme() {
    const root = document.documentElement;
    const colorInput = document.getElementById('Primary-Color');

    // Load the previously selected color from local storage
    const savedColor = localStorage.getItem('selectedColor');

    // Set the input color to the last selected color or a default color
    colorInput.value = savedColor || '#2563eb';

    // Set the --bs-primary CSS variable to the selected color
    root.style.setProperty('--bs-primary', colorInput.value);

    // Add an input event listener to the color input
    colorInput.addEventListener('input', function () {
        // Get the selected color value from the input
        const selectedColor = colorInput.value;

        // Change the value of --bs-primary to the selected color
        root.style.setProperty('--bs-primary', selectedColor);

        // Save the selected color to local storage
        localStorage.setItem('selectedColor', selectedColor);
    });
}

function ScrollOnLoadMedia() {
    const parentDiv = document.getElementById("tynReply");

    // Get the last child element
    const firstChildElement = parentDiv.firstElementChild;

    // Read the id of the last child element
    const firstChildId = firstChildElement.id;
    const targetDiv = document.getElementById(firstChildId);

    targetDiv.scrollIntoView({ behavior: "smooth" });
}

function showAndEnableTypingEffect() {
    var processingElement = document.getElementById('Processing');
    processingElement.classList.remove('hidden');
    processingElement.classList.add('typing');
}

function hideAndDisableTypingEffect() {
    var processingElement = document.getElementById('Processing');
    processingElement.classList.remove('typing');
    processingElement.classList.add('hidden');
}