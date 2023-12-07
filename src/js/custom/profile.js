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
    const password1 = document.getElementById("pass1").value;
    const password2 = document.getElementById("pass2").value;
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const baseurl = localStorage.getItem("baseurl");
    const apiUrl = baseurl + "api/Profile/PasswordChange";
    
    
    if (password1 == "" || password2 == "") {
     
      swal ( "Error" ,  "No debe haber ningun campo vacio" ,  "error" );
    }

    else {

      if(password1!=password2)
      {
        swal({
          title: "Advertencia",
          text: "Las contraseñas no coinciden!",
          icon: "warning",
          dangerMode: true,
        })

      }
      else{
        
           //const selectElement = document.getElementById("SelectType");
    // Get the selected value
      const requestData = {
        username: username,
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
            swal("Bien hecho!", "La contraseña se ha cambiado correctamente!", "success");
            document.getElementById("pass1").value="";
            document.getElementById("pass2").value="";
            return response.json();
          } else {
            // Handle non-200 status codes (e.g., 500 for server error)
            swal ( "Error" ,  "Ha ocurrido un error inesperado" ,  "error" );
            document.getElementById("pass1").value="";
            document.getElementById("pass2").value="";
            throw new Error("Request failed with status: " + response.status);
          }
        })
        .catch((error) => {
          // Handle errors here
          console.error("Error:", error);
        });
      }
    }
  
  });



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
    document.getElementById('Name').value = data.name;
    document.getElementById('Email').value = data.email;
    document.getElementById('user').textContent = data.name;
    document.getElementById('usercorreo').textContent = data.email;
    document.getElementById('avatarname').textContent = data.name;
    document.getElementById('avataremail').textContent = data.email;
    document.getElementById("Profilepicture").src = baseurl + "api/Files/GetProfilePicture?imageName=" + data.picture;
    document.getElementById("Avatarpicture").src = baseurl + "api/Files/GetProfilePicture?imageName=" + data.picture;
    document.getElementById("avatarpicture2").src = baseurl + "api/Files/GetProfilePicture?imageName=" + data.picture;
    document.getElementById("Profilecover").src = baseurl + "api/Files/GetCoverPicture?imageName=" + data.cover;
  })
  .catch((error) => {
    console.error("Error:", error);
  });
