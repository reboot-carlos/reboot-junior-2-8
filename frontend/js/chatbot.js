/* ============================================================
   CHATBOT - Logique principale du chatbot
   ============================================================ */

const SERVER_URL = document.getElementById('config').dataset.serverUrl || 'http://localhost:8000';
let messageId = 0;

/**
 * Ajoute un message au chat
 */
function addMessage(type, content) {
  const container = document.getElementById('chatMessages');
  const message = document.createElement('div');
  const id = `msg-${++messageId}`;

  message.id = id;
  message.className = `message ${type}`;
  message.innerHTML = content;

  container.appendChild(message);
  container.scrollTop = container.scrollHeight;

  // Ajouter à l'historique (pas pendant le chargement d'une conversation)
  if (currentConversationId && !isLoadingConversation) {
    addMessageToConversation(type, content);
  }

  return id;
}

/**
 * Supprime un message du chat
 */
function removeMessage(id) {
  const msg = document.getElementById(id);
  if (msg) msg.remove();
}

/**
 * Ajoute un message de chargement
 */
function addLoadingMessage() {
  const container = document.getElementById('chatMessages');
  const message = document.createElement('div');
  const id = `msg-${++messageId}`;

  message.id = id;
  message.className = 'message bot loading';
  message.innerHTML = `
    <div class="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;

  container.appendChild(message);
  container.scrollTop = container.scrollHeight;

  return id;
}

/**
 * Envoie un message au serveur et reçoit la réponse
 */
async function sendMessage(event) {
  event.preventDefault();

  const input = document.getElementById('messageInput');
  const text = input.value.trim();

  if (!text) return;

  // Créer une nouvelle conversation si nécessaire
  if (!currentConversationId) {
    createNewConversation();
  }

  // Ajouter le message de l'utilisateur
  addMessage('user', escapeHtml(text));
  input.value = '';

  // Désactiver l'input pendant le chargement
  const sendBtn = document.querySelector('.btn-send');
  sendBtn.disabled = true;

  // Afficher le message de chargement
  const loadingId = addLoadingMessage();

  try {
    if (!isOnline()) {
      removeMessage(loadingId);
      addMessage('bot', 'Erreur : Pas de connexion internet 😔');
      sendBtn.disabled = false;
      return;
    }

    // Appel API
    const response = await fetch(`${SERVER_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texte: text,
        personality: currentPersonality,
        function: currentFunction,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      removeMessage(loadingId);
      const errorMsg = data.reponse || data.detail || 'Erreur serveur';
      addMessage('bot', `Erreur : ${escapeHtml(errorMsg)} 🔑`);
      sendBtn.disabled = false;
      return;
    }

    // Afficher la réponse (escapeHtml protège contre l'injection)
    removeMessage(loadingId);
    addMessage('bot', escapeHtml(data.reponse || 'Pas de réponse du serveur'));

  } catch (error) {
    removeMessage(loadingId);
    console.error('Erreur:', error);
    addMessage('bot', `Erreur de connexion : ${error.message} 😔`);
  } finally {
    sendBtn.disabled = false;
    document.getElementById('messageInput').focus();
  }
}

/**
 * Affiche les suggestions
 */
function displaySuggestions(suggestions = []) {
  const container = document.getElementById('chatSuggestions');

  if (suggestions.length === 0) {
    suggestions = [
      '👋 Bonjour',
      '🤖 Qui es-tu ?',
      '❓ Aide',
    ];
  }

  container.innerHTML = '';

  suggestions.forEach(text => {
    const btn = document.createElement('button');
    btn.className = 'suggestion-btn';
    btn.textContent = text;
    btn.onclick = () => {
      const input = document.getElementById('messageInput');
      input.value = text.replace(/^\S+\s/, '');
      sendMessage({ preventDefault: () => {} });
    };
    container.appendChild(btn);
  });
}
