// Add an event listener to the parent container
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
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://localhost:7286/api/Chats/Upload?Username=' + encodeURIComponent(username) + '&Chatusername=' + encodeURIComponent(chatusername), true);
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
    fetch('https://localhost:7286/api/Chats/Message', {
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