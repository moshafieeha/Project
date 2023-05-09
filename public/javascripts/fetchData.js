document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const data = {
    username: username,
    password: password
  };

  fetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
});

document.getElementById('register-form').addEventListener('submit', function(e) {
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

  fetch('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
});

