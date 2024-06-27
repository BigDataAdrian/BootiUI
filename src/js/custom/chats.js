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
        if (e.target.tagName.toLowerCase() === 'input' && e.target.classList.contains('tyn-chat-form-input')) {
            var inputValue = e.target.value;
            var inputtext = e.target.value;
            if (e.target.type.toLowerCase() == "password") {
                inputtext = "************"
            }
            message(inputValue, inputtext);
        }
        else if (e.target.tagName.toLowerCase() === 'textarea') {
            // Check if shift key is also pressed along with Enter
            if (e.shiftKey) {
                var inputValue = e.target.value;
                var inputtext = e.target.value;
                message(inputValue, inputtext);
                e.preventDefault();
            }
        }
    }
});
function printScrollPosition() {
    var container = document.getElementById("tynChatBody");
    var scrollPosition = container.scrollTop;
    if (scrollPosition === 0) {
        History();
    }
}
// Function to read the query string parameter and call another function
function processQueryString() {
    // Function to get the value of a parameter from the query string
    function getQueryStringParameter(parameter) {
        const urlParams = new URLSearchParams(window.location.search);
        // Check for parameter in lowercase and uppercase
        const lowerCaseParam = urlParams.get(parameter.toLowerCase());
        const upperCaseParam = urlParams.get(parameter.toUpperCase());
        // Return the parameter value if found, otherwise return null
        return lowerCaseParam || upperCaseParam;
    }
    // Get the 'Booti' value from the query string
    const queryStringParam = getQueryStringParameter('Chat');

    // Check if the parameter exists before calling the function
    if (queryStringParam !== null) {
        LoadChatFromQuery(queryStringParam)
    } else {
        console.log("Query parameters not found.");
        // Handle the case where the parameter is not present
    }
}

document.addEventListener('change', function (event) {
    var target = event.target;
    if (target.classList.contains('file-upload')) {
        showAndEnableTypingEffect();
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
                `;
                let oldHeight = chatBody.scrollHeight;
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

                let newHeight = chatReply.scrollHeight;

                // Calculate height of newly inserted content
                let insertedHeight = newHeight - oldHeight;

                // Adjust scroll position to maintain relative position
                chatBody.scrollTop += insertedHeight;
                hideAndDisableTypingEffect();
                answer("", "");
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
                return response.json(); // Parse the response JSON
                // You can handle the response data here if needed
            } else {
                // Request failed
                console.error("Failed to post data");
            }
        })
        .then(data => {
            // Update the <span> elements with the response data
            document.getElementById("Email").textContent = data.username;
            document.getElementById("Name").textContent = data.name;
            if (data.picture == null) {
                document.getElementById("Profilepicturemodal").src = "images/robot.png";
            } else {
                document.getElementById("Profilepicturemodal").src = baseurl + "api/Files/GetProfilePicture?imageName=" + data.picture;
            }

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

            const divElement = document.getElementById("InputType");
            const chatHelper = document.getElementById('Helper');
            const hint = document.getElementById('Hint')
            const send = document.getElementById('send');
           
            // Set the new HTML content using innerHTML
            divElement.innerHTML = data.input;
            chatHelper.innerHTML = data.helper;
            send.innerHTML = data.send;
            hint.innerHTML = data.hint;
            var chatSearchDiv = document.getElementById('tynChatSearch');
            if (data.hint !== "" && data.hint !== null) {
                hint.innerHTML = data.hint;
                chatSearchDiv.classList.add('active');
            } else {
                chatSearchDiv.classList.remove('active');
            }

            chatReply.innerHTML = "";
            localStorage.setItem('last', data.last);
            let oldHeight = chatBody.scrollHeight;
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
                }

                if (message.origin == 2) {
                    let text = message.message;
                    var srcValue = imgElement.getAttribute("src");
                    let chatAvatar = `<div class="tyn-reply-avatar">
                        <div class="tyn-media tyn-circle">
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
                }
            });
            let newHeight = chatReply.scrollHeight;

            // Calculate height of newly inserted content
            let insertedHeight = newHeight - oldHeight;

            // Adjust scroll position to maintain relative position
            chatBody.scrollTop += insertedHeight;
            // Get the element by its ID

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
        message(inputValue, inputValue);
    } else if (inputElement.tagName.toLowerCase() === 'input') {
        // It's an input, get the value
        var inputValue = inputElement.value;
        var inputtext = inputElement.value;
        if (inputElement.type.toLowerCase() == "password") {
            inputtext = "************"
        }
        message(inputValue, inputtext);
    } else if (inputElement.tagName.toLowerCase() === 'table') {
        // inputElement.style = "";

        // Remove inline styles from table cells (td and th)
        // var cells = inputElement.querySelectorAll("td, th");
        // cells.forEach(function (cell) {
        //     cell.style = "";
        // });

        // Remove <style> tags within the table
        // var styleTags = inputElement.querySelectorAll("style");
        // styleTags.forEach(function (styleTag) {
        //     styleTag.parentNode.removeChild(styleTag);
        // });
        const tableBody = document.querySelector('#Message tbody');
        const rows = tableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const input = row.querySelector('input[name="name"]');
            const select = row.querySelector('select[name="name"]');
            const textarea = row.querySelector('textarea[name="name"]');
            if (input) {
                const inputValue = input.value;
                input.outerHTML = inputValue; // Replace the input element with its value
            }

            if (select) {
                const selectValue = select.options[select.selectedIndex].value;
                select.outerHTML = selectValue; // Replace the select element with its selected value
            }
            if (textarea) {
                const textareaValue = textarea.value;
                textarea.outerHTML = textareaValue; // Replace the textarea element with its value
            }
        });

        // Get the updated HTML content of the table
        const updatedTableHTML = document.querySelector('#Message').outerHTML;
        Message = updatedTableHTML.replace(" id=\"Message\"", "");//Tabla
        const chatInputDiv = document.getElementById("InputType");
        chatInputDiv.innerHTML = "";
        message(Message, Message);
    }
}

function SendSelect(selectElement) {
    // Get the selected option value
    var selectedValue = selectElement.options[selectElement.selectedIndex].value;
    var selectedText = selectElement.options[selectElement.selectedIndex].text;
    // Do something with the selected value (e.g., log it)
    message(selectedValue, selectedText);
}
let isExecuting = false;
function message(value, text) {

    if (isExecuting) {
        console.log("Function is already running. Please wait.");
        return;
    }

    var messageDiv = document.getElementById("Message");
    if (messageDiv) {
        if (messageDiv.tagName === "INPUT" || messageDiv.tagName === "TEXTAREA") {
            messageDiv.value = '';
        }
    }

    // Set the flag to true to indicate that the function is executing
    isExecuting = true;
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
                ${getInput.replace(/\n/g, "<br>")}
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

function answer(value, text) {
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
        <div class="tyn-media tyn-circle">
            <img src="${srcValue}" alt="">
        </div>
    </div>
    `
    let chatBubble = '';
    let inputEntry = '';
    let hint = '';
    let helper = '';
    let LastId = '';
    let send = '';
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
            send = data.send;
            hint = data.hint;
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
                const divhint = document.getElementById('Hint')
                divhint.innerHTML = hint;
                var chatSearchDiv = document.getElementById('tynChatSearch');
                if (hint !== "" && hint !== null) {
                    chatSearchDiv.classList.add('active');
                } else {
                    chatSearchDiv.classList.remove('active');
                }

                divElement.classList.remove('hide');
                // Find the input and textarea elements within the div
                const inputElement = divElement.querySelector("input");
                const textareaElement = divElement.querySelector("textarea");

                var SendButton = document.getElementById("Send");
                SendButton.innerHTML = send;
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
                isExecuting = false;
            }, 250);
            const currentDivCount = chatReply.children.length;

            // If the total count exceeds the maximum, remove the oldest divs
            if (currentDivCount > 40) {
                const removeCount = currentDivCount - 40;
                for (let i = 0; i < removeCount; i++) {
                    chatReply.removeChild(chatReply.lastElementChild);
                }
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

function History() {
    showAndEnableTypingEffect();
    const last = localStorage.getItem('last');
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const chatusername = localStorage.getItem('chatusername');
    // Define the data you want to send as the request body
    const requestData = {
        Last: last,
        Username: username,
        Chatusername: chatusername
    };
    // Make an HTTP POST request to the endpoint
    const baseurl = localStorage.getItem('baseurl');
    fetch(baseurl + 'api/Chats/GetHistory', {
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
            hideAndDisableTypingEffect();
            // History
            var imgElement = document.getElementById("Chatpictureinlineheader");
            let chatReply = document.querySelector('#tynReply');
            let chatBody = document.querySelector('#tynChatBody');
            localStorage.setItem('last', data.last);
            // Get current height of the chat body
            let oldHeight = chatBody.scrollHeight;

            data.listMessages.forEach(message => {
                var uuid = generateUUID();
                if (message.origin == 1) {
                    let getInput = message.message;
                    let chatBubble = getInput;
                    let outgoingWrapper = `
                        <div id="${uuid}" class="tyn-reply-item outgoing">
                            <div class="tyn-reply-group">
                            ${chatBubble}
                            </div>
                        </div>
                    `;
                    // Append new message at the end of the chat body
                    chatReply.insertAdjacentHTML("beforeend", outgoingWrapper);
                }

                if (message.origin == 2) {
                    let text = message.message;
                    let srcValue = imgElement.getAttribute("src");
                    let chatAvatar = `<div class="tyn-reply-avatar">
                        <div class="tyn-media tyn-circle">
                            <img src="${srcValue}" alt="">
                        </div>
                    </div>`;

                    let incomingWrapper = `
                        <div id="${uuid}" class="tyn-reply-item incoming">
                        ${chatAvatar}
                        <div class="tyn-reply-group">
                        ${text}
                        </div>
                       
                        </div>`;
                    chatReply.insertAdjacentHTML("beforeend", incomingWrapper);
                }
            });
            // Get current height of the chat body

            // Calculate new height of the chat body
            let newHeight = chatBody.scrollHeight;

            // Calculate height of newly inserted content
            let insertedHeight = newHeight - oldHeight;

            // Adjust scroll position to maintain relative position
            chatBody.scrollTop = insertedHeight;
        })
        .finally(() => {

        })
        .catch(error => {
            // Handle any errors that occurred during the fetch or processing
            console.error('Error:', error);
        });
}
function toggleColor(toggleId) {
    var checkbox = document.getElementById(toggleId);
    var label = document.querySelector('label[for=' + toggleId + ']');

    if (checkbox.checked) {
        label.style.backgroundColor = 'var(--bs-primary)';
        label.style.color = 'white';
    } else {
        label.style.backgroundColor = 'var(--form-input-bg)';

        label.style.color = 'var(--button-color)';
    }
}
function getCheckedCheckboxes() {
    var checkboxes = document.querySelectorAll('.toggle-button');
    var checkedCheckboxes = [];
    
    checkboxes.forEach(function(checkbox) {
      if (checkbox.checked) {
        checkedCheckboxes.push(checkbox.id);
      }
    });

    console.log('Checked Checkboxes:', checkedCheckboxes);
    // You can return the array or use it as needed
    return checkedCheckboxes;
  }