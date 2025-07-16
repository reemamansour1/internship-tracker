document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        alert('Logged in!');
        window.location.href = 'internship-form.html'; // redirect to form page
      } else {
        alert(data.error);
      }
    });
  }

  if (signupForm) {
      if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value;
      const username = document.getElementById('signup-username').value;
      const password = document.getElementById('signup-password').value;

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password })
      });

      const data = await res.json();
      if (res.ok) {
        alert('User created! Please log in.');
        signupForm.reset(); // clear the form
      } else {
        alert(data.error);
      }
    });
  }
  }
});
