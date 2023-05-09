// fetch data from the login page
document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const data = {
    username: username,
    password: password,
  };

  const errorMessageElement = document.getElementById("error-message");

  fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
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
});
