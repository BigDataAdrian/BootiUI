document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-contact');
    searchInput.addEventListener('input', handleInput);
    GetProfile();
    GetChats();
    processQueryString();

    function handleInput() {
        const inputValue = searchInput.value.trim();
        if (inputValue === '') {
            // Clear suggestions if input is empty
            const parentElement = document.getElementById("suggestions-container");
            parentElement.innerHTML = "";
            return;
        }

        // Fetch data from your .NET Core API
        const token = localStorage.getItem('token');
        const headers = new Headers({
            'Authorization': `Bearer ${token}`
        });

        const requestOptions = {
            method: 'GET',
            headers: headers,
        };

        // Make a GET request to your .NET Core API endpoint
        const baseurl = localStorage.getItem('baseurl');
        fetch(baseurl + `api/Contacts/GetChats?search=${inputValue}`, requestOptions)
            .then(response => response.json())
            .then((data) => {
                const parentElement = document.getElementById("suggestions-container");
                parentElement.innerHTML = "";
                data.forEach(item => {
                    // Create the list item element
                    const listItem = document.createElement("li");
                    listItem.classList.add("tyn-aside-item", "js-toggle-main", item.active);
                    // Get the parent <ul> element by its ID
                    const parentElement = document.getElementById("suggestions-container");
                    parentElement.innerHTML = "";
                    //preparate route
                    const Picture = baseurl + "api/Files/GetChatProfilePicture?imageName=" + item.picture;

                    // Create the inner HTML structure
                    listItem.innerHTML = `
                    <div class="tyn-media-group" onclick="LoadChatFromModal('${item.username}')">
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
                })
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    //load slider
    var rangeInput = document.getElementById('Slider_size');
    // Add an event listener to the range input for the 'input' event
    rangeInput.addEventListener('input', function () {
        var outputDiv = document.getElementById('SelectorInput');
        // Read the value of the range slider
        var sliderValue = rangeInput.value;

        // Set the value as the height of the output div
        outputDiv.style.maxHeight = sliderValue + 'px';
    });

    // Add an event listener to the range input for the 'change' event
    rangeInput.addEventListener('change', function () {
        // Read the value of the range slider and save it
        savedValue = rangeInput.value;
        SliderChange(savedValue);
        // Optional: Use the savedValue variable elsewhere in your script or application.
    });
});
document.getElementById('InputType').addEventListener('keypress', function (e) {
    // Check if the pressed key is Enter (keycode 13)
    if (e.keyCode === 13) {
        // Check if the target of the event is an input element with a specific class or other identifying criteria
        if (e.target.tagName === 'INPUT' && e.target.classList.contains('tyn-chat-form-input')) {
            // Call your message handling function with the message
            message(e.target.value);
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

                answer("");
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
            document.getElementById("Profilepicture").src = baseurl + "api/Files/GetProfilePicture?imageName=" + data.picture;
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
            document.getElementById('Slider_size').value = data.slider;

            var imgElement = document.getElementById("Chatpictureinlineheader");
            localStorage.setItem('chatusername', Chatusername); // Store the token in localStorage
            // Load selector list
            const selectElement = document.getElementById("SelectType");

            // Assuming data.selector contains the value you want to select
            const valueToSelect = data.selector;

            // Loop through options to find the one with the desired value
            for (let i = 0; i < selectElement.options.length; i++) {
                if (selectElement.options[i].value === valueToSelect) {
                    // Set the selected property of the found option to true
                    selectElement.options[i].selected = true;
                    break; // Exit the loop since we found the matching option
                }
            }
            // History
            let chatBody = document.querySelector('#tynChatBody');
            let chatReply = document.querySelector('#tynReply');
            chatReply.innerHTML = "";
            data.history.forEach(message => {
                if (message.origin == 1) {
                    let getInput = message.message;
                    let chatBubble = getInput;
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
                    <div class="tyn-reply-item incoming">
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
            // Set the new HTML content using innerHTML
            divElement.innerHTML = data.input;
            // Check if the element with id 'SelectorInput' exists
            var selectorInput = document.getElementById('SelectorInput');

            if (selectorInput) {
                // If the element exists, update its style
                selectorInput.style.maxHeight = data.slider + 'px';
            }
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
        message(inputValue);
    } else if (inputElement.tagName.toLowerCase() === 'input') {
        // It's an input, get the value
        var inputValue = inputElement.value;

        message(inputValue);
    }
}

function SendSelect(selectElement) {
    // Get the selected option value
    var selectedValue = selectElement.options[selectElement.selectedIndex].value;

    // Do something with the selected value (e.g., log it)
    message(selectedValue);
}

function message(text) {

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
        <div class="tyn-reply-bubble">
            <div class="tyn-reply-text">
                ${getInput}
            </div>
        </div>
        `;
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

    answer(getInput);
}

function answer(text) {
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
    //post
    // Define the data you want to send as the request body
    const requestData = {
        Message: text,
        Username: username,
        Chatusername: chatusername
    };

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
        })
        .finally(() => {

            let incominggWraper = `
            <div class="tyn-reply-item incoming">
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

            let simpleBody = SimpleBar.instances.get(document.querySelector('#tynChatBody'));
            let height = chatBody.querySelector('.simplebar-content > *').scrollHeight;
            simpleBody.getScrollElement().scrollTop = height;

            // Get the element by its ID
            const divElement = document.getElementById("InputType");
            // Set the new HTML content using innerHTML
            divElement.innerHTML = inputEntry;
            var selectorInput = document.getElementById('SelectorInput');

            if (selectorInput) {
                // If the element exists, update its style
                var rangeInput = document.getElementById('Slider_size');
                selectorInput.style.maxHeight = rangeInput.value + 'px';
            }
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

function deleteHistory() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const chatusername = localStorage.getItem('chatusername');
    const baseurl = localStorage.getItem('baseurl');
    const apiUrl = baseurl + 'api/Chats/DeleteHistory';

    const headers = new Headers({
        'Authorization': `Bearer ${token}`
    });

    const requestOptions = {
        method: 'DELETE',
        headers: headers,
    };

    fetch(apiUrl + `?Username=${username}&Chatusername=${chatusername}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            document.getElementById("tynReply").innerHTML = '';
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function deleteChat() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const chatusername = localStorage.getItem('chatusername');
    const baseurl = localStorage.getItem('baseurl');
    const apiUrl = baseurl + 'api/Chats/DeleteChat';

    const headers = new Headers({
        'Authorization': `Bearer ${token}`
    });

    const requestOptions = {
        method: 'DELETE',
        headers: headers,
    };

    fetch(apiUrl + `?Username=${username}&Chatusername=${chatusername}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            document.getElementById("tynReply").innerHTML = '';

            // Get the element by ID
            const listItemToRemove = document.getElementById('Chat_' + chatusername);
            if (listItemToRemove) {
                listItemToRemove.remove();
            }

            // Retrieve the element by ID
            const retrievedElement = document.getElementById("Chat_booti");

            // Check if the element is found before trying to add classes
            if (retrievedElement) {
                // Add the same classes to the element
                retrievedElement.classList.add("tyn-aside-item", "js-toggle-main", 'active');
            }
            LoadChat('booti');
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function LoadChatFromModal(chatusername) {
    var modal = document.getElementById('newChat');
    var backdrop = document.querySelector('.modal-backdrop');

    modal.classList.remove('show');
    modal.style.display = 'none';

    // Remove the modal backdrop
    document.body.removeChild(backdrop);

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
                return response.json();
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
                const Picture = "images/Chats/" + item.username + "/Profile/" + item.picture
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
                return response.json();
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
                const Picture = "images/Chats/" + item.username + "/Profile/" + item.picture
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

function SelectType() {
    const selectElement = document.getElementById("SelectType");
    // Get the selected value
    const selectedValue = selectElement.value;
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const chatusername = localStorage.getItem('chatusername');
    const baseurl = localStorage.getItem('baseurl');
    const apiUrl = baseurl + "api/Chats/SelectType";

    const requestData = {
        Username: username,
        Chatusername: chatusername,
        Type: selectedValue
    };

    // Make the fetch request
    fetch(apiUrl, {
        method: 'PATCH', // or 'GET', 'PUT', etc. depending on your API
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
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
        .catch(error => {
            // Handle errors here
            console.error('Error:', error);
        });
}

function SliderChange(value) {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const chatusername = localStorage.getItem('chatusername');
    const baseurl = localStorage.getItem('baseurl');
    const apiUrl = baseurl + "api/Chats/SliderChange";

    const requestData = {
        Username: username,
        Chatusername: chatusername,
        Size: value
    };

    // Make the fetch request
    fetch(apiUrl, {
        method: 'PATCH', // or 'GET', 'PUT', etc. depending on your API
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
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
        .catch(error => {
            // Handle errors here
            console.error('Error:', error);
        });
}