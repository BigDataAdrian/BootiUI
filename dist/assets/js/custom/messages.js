document.addEventListener('DOMContentLoaded', function () {
    // Get a reference to the send button
    const sendButton = document.getElementById('sendButton');
  
    // Add a click event listener to the button
    sendButton.addEventListener('click', function () {
      // Your function to send the POST request here
      sendMessage();
    });
  });
  
  function sendMessage() {
    const apiUrl = 'https://your-api-endpoint.com/api/Message';
    const authToken = 'your-auth-token';
    const requestBody = {
      Text: 'Your message text',
    };
  
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Handle the response data
        console.log(data);
  
        if (data && data.Answers) {
          data.Answers.forEach((answer) => {
            console.log(answer.Text);
            // You can use answer.Text in your UI as needed
          });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  