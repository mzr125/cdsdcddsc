export class Question {
  static create(question) {
    return fetch('https://podcast-app-15663.firebaseio.com/questions.json', {
      method: 'POST',
      body: JSON.stringify(question),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(response => {
        question.id = response.name;
        addToLocalStorage(question);
        return question;
      })
      .then(() => Question.renderList());
  }

  static fetch(token) {
    if (!token) {
      return Promise.resolve('<p class="error">У вас нет токена</p>');
    }
    return fetch(`https://podcast-app-15663.firebaseio.com/questions.json?auth=${token}`)
      .then(response => response.json())
      .then(response => {
        if (response && response.error) {
          return `<p class="error">${response.error}</p>`;
        }

        const questions = response ? Object.keys(response).map(key => ({
          ...response[key],
          id: key
        })) : [];

        renderList(questions);
        return questions;
      });
  }

  static delete(id, token) {
    if (!token) {
      return Promise.resolve('<p class="error">У вас нет токена</p>');
    }

    return fetch(`https://podcast-app-15663.firebaseio.com/questions/${id}.json?auth=${token}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        removeFromLocalStorage(id);
        return id;
      })
      .then(() => Question.renderList())
      .catch(error => console.error('Error deleting question:', error));
  }

  static renderList() {
    const questions = getQuestionsFromLocalStorage();

    const html = questions.length
      ? questions.map(toCard).join('')
      : `<div class="mui--text-headline">Вы пока ничего не спрашивали</div>`;

    const list = document.getElementById('list');
    list.innerHTML = html;
  }

  static listToHTML(questions) {
    return questions.length
      ? `<ol>${questions.map(q => `<li>${q.text}</li>`).join('')}</ol>`
      : '<p>Вопросов пока нет</p>';
  }
}

function addToLocalStorage(question) {
  const all = getQuestionsFromLocalStorage();
  all.push(question);
  localStorage.setItem('questions', JSON.stringify(all));
}

function removeFromLocalStorage(id) {
  const all = getQuestionsFromLocalStorage();
  const updatedQuestions = all.filter(question => question.id !== id);
  localStorage.setItem('questions', JSON.stringify(updatedQuestions));
}

function getQuestionsFromLocalStorage() {
  return JSON.parse(localStorage.getItem('questions') || '[]');
}

function toCard(question) {
  
  return `
    <div class="mui--text-black-54">
      ${new Date(question.date).toLocaleDateString()}
      ${new Date(question.date).toLocaleTimeString()}
    </div>
    <div>${question.text}</div>
    <button onclick="deleteQuestion('${question.id}')">Delete</button>
    <br>
  `;
}





window.deleteQuestion = function(id) {
  const token = 'your_user_token'; 
  Question.delete(id, token);
};
