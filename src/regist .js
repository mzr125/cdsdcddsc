export function getRegistrationForm() {
    return `
      <form class="mui-form" id="registration-form">
        <div class="mui-textfield mui-textfield--float-label">
          <input type="email" id="email" required>
          <label for="email">Email</label>
        </div>
        <div class="mui-textfield mui-textfield--float-label">
          <input type="password" id="password" required>
          <label for="password">Пароль</label>
        </div>
        <button
          type="submit"
          class="mui-btn mui-btn--raised mui-btn--primary"
        >
          Зарегистрироваться
        </button>
      </form>
    `;
  }
  export function registerWithEmailAndPassword(email, password) {
    const apiKey = 'AIzaSyDIwdXP5VEbTh2z8iuw4cKftPCCieqja2U';
    return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
      method: 'POST',
      body: JSON.stringify({
        email, password,
        returnSecureToken: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => data.idToken);
  }
  function openRegistrationModal() {
    createModal('Регистрация', getRegistrationForm());
    document
      .getElementById('registration-form')
      .addEventListener('submit', registrationFormHandler, { once: true });
  }
  
  function registrationFormHandler(event) {
    event.preventDefault();
  
    const btn = event.target.querySelector('button');
    const email = event.target.querySelector('#email').value;
    const password = event.target.querySelector('#password').value;
  
    btn.disabled = true;
    registerWithEmailAndPassword(email, password)
      .then(Question.fetch)
      .then(renderModalAfterAuth)
      .then(() => btn.disabled = false);
  }
  

  document.getElementById('registration-btn').addEventListener('click', openRegistrationModal);