// fetch data from the register page
document.getElementById('editProfileForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const fName = document.getElementById('fName').value;
    const lName = document.getElementById('lName').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const gender = document.getElementById('gender').value;
    const role = document.getElementById('role').value;
    const phone = document.getElementById('phone').value;
  
    const data = {
      fName: fName,
      lName: lName,
      username: username,
      password: password,
      gender: gender,
      role: role,
      phone: phone
    };
  
    const errorMessageElement = document.getElementById("error-message");
  
  
    fetch('/uset/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        window.location.href = data.redirectUrl;
      } else {
        // Handle unsuccessful login
        throw new Error(data.error);
      }
    })
    .catch((error) => {
      console.error(error);
      // Show an error message
      errorMessageElement.textContent = error.message;
    });

    var bootstrapModal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
    bootstrapModal.hide();
  });
  