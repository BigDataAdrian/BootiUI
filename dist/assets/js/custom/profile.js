document
  .getElementById("profile-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    //const selectElement = document.getElementById("SelectType");
    // Get the selected value
    const email = document.getElementById("Email");
    const name = document.getElementById("Name");
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const baseurl = localStorage.getItem("baseurl");
    const apiUrl = baseurl + "api/Chats/SelectType";

    const requestData = {
      Username: username,
      Name: name,
      Email: email,
      Phone: phone,
    };

    // Make the fetch request
    fetch(apiUrl, {
      method: "PATCH", // or 'GET', 'PUT', etc. depending on your API
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          // HTTP status code 200 indicates success
          return response.json();
        } else {
          // Handle non-200 status codes (e.g., 500 for server error)
          throw new Error("Request failed with status: " + response.status);
        }
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  });


document
  .getElementById("password-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    //const selectElement = document.getElementById("SelectType");
    // Get the selected value
    const password1 = document.getElementById("pass1");
    const password2 = document.getElementById("pass2");
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const baseurl = localStorage.getItem("baseurl");
    const apiUrl = baseurl + "api/Chats/SelectType";

    const requestData = {
      username:username,
      password: password1,
      validation: password2,
    };

    // Make the fetch request
    fetch(apiUrl, {
      method: "PATCH", // or 'GET', 'PUT', etc. depending on your API
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          // HTTP status code 200 indicates success
          return response.json();
        } else {
          // Handle non-200 status codes (e.g., 500 for server error)
          throw new Error("Request failed with status: " + response.status);
        }
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  });

  
function GetProfile() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const baseurl = localStorage.getItem("baseurl");
  const apiUrl = baseurl + "api/Profile/GetProfile";

  const headers = new Headers({
    Authorization: `Bearer ${token}`,
  });

  const requestOptions = {
    method: "GET",
    headers: headers,
  };

  fetch(apiUrl + `?Username=${username}`, requestOptions)
    .then((response) => {
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
    .then((data) => {
      // Update the <span> elements with the response data
      document.getElementById("Email").textContent = data.email;
      document.getElementById("Name").textContent = data.name;
      document.getElementById("Profilepicture").src =
        "images/Profiles/" + data.email + "/Profile/" + data.picture;
      //document.getElementById("Profilepicturemodal").src = "images/Profiles/" + data.email + "/Profile/" + data.picture;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}