/* ============================================================
   HISTORY - Gestion de l'historique
   ============================================================ */

let conversations = getFromLocalStorage('conversations', []);
let currentConversationId = getFromLocalStorage('currentConversation', null);
let isLoadingConversation = false;

/**
 * Crée une nouvelle conversation
 */
function createNewConversation() {
  const id = generateId();
  const conversationNumber = conversations.length + 1;
  const conversation = {
    id,
    title: `Discussion #${conversationNumber}`,
    personality: currentPersonality,
    function: currentFunction,
    createdAt: new Date().toISOString(),
    messages: [],
  };

  conversations.push(conversation);
  saveToLocalStorage('conversations', conversations);
  currentConversationId = id;
  saveToLocalStorage('currentConversation', id);

  // Réinitialiser le chat
  resetChat();
  updateHistoryList();

  return id;
}

/**
 * Charge une conversation
 */
function loadConversation(id) {
  const conversation = conversations.find(c => c.id === id);
  if (!conversation) {
    console.error('Conversation not found:', id);
    return;
  }

  // changePersonality réinitialise currentConversationId à null,
  // donc on le restaure APRÈS
  changePersonality(conversation.personality);
  changeFunction(conversation.function);

  currentConversationId = id;
  saveToLocalStorage('currentConversation', id);

  // Afficher les messages sans les re-sauvegarder (ils existent déjà)
  const messagesContainer = document.getElementById('chatMessages');
  messagesContainer.innerHTML = '';
  isLoadingConversation = true;
  conversation.messages.forEach(msg => addMessage(msg.type, msg.content));
  isLoadingConversation = false;

  updateHistoryList();
}

/**
 * Ajoute un message à la conversation actuelle
 */
function addMessageToConversation(type, content) {
  if (!currentConversationId) {
    createNewConversation();
  }

  const conversation = conversations.find(c => c.id === currentConversationId);
  if (conversation) {
    conversation.messages.push({
      type,
      content,
      timestamp: new Date().toISOString(),
    });

    // Mettre à jour le titre si c'est la première question
    if (conversation.messages.length === 1 && type === 'user') {
      conversation.title = content.substring(0, 50) + (content.length > 50 ? '...' : '');
    }

    saveToLocalStorage('conversations', conversations);
  }
}

/**
 * Réinitialise le chat
 */
function resetChat() {
  document.getElementById('chatMessages').innerHTML = '';
  document.getElementById('messageInput').value = '';

  // Afficher le message de bienvenue
  const p = PERSONALITIES[currentPersonality];
  addMessage('bot', p.message);
}

/**
 * Supprime une conversation
 */
function deleteConversation(id) {
  conversations = conversations.filter(c => c.id !== id);
  saveToLocalStorage('conversations', conversations);

  if (currentConversationId === id) {
    currentConversationId = null;
    saveToLocalStorage('currentConversation', null);
    createNewConversation();
  }

  updateHistoryList();
}

/**
 * Efface tout l'historique
 */
function clearHistory() {
  if (confirm('Es-tu sûr de vouloir supprimer tout l\'historique ?')) {
    conversations = [];
    saveToLocalStorage('conversations', []);
    currentConversationId = null;
    saveToLocalStorage('currentConversation', null);
    createNewConversation();
    updateHistoryList();
  }
}

/**
 * Met à jour la liste d'historique dans la sidebar
 */
function updateHistoryList() {
  const container = document.getElementById('historyList');

  if (conversations.length === 0) {
    container.innerHTML = '<p class="empty-state">Aucune conversation</p>';
    return;
  }

  container.innerHTML = '';

  // Trier par date décroissante
  const sorted = [...conversations].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  sorted.forEach(conv => {
    const item = document.createElement('div');
    item.className = `history-item ${conv.id === currentConversationId ? 'active' : ''}`;
    item.onclick = () => loadConversation(conv.id);
    item.innerHTML = `
      <div style="text-align: left;">
        <div style="font-weight: 600; margin-bottom: 0.25rem;">${escapeHtml(conv.title)}</div>
        <div style="font-size: 0.75rem; opacity: 0.7;">
          ${formatConversationDate(conv.createdAt)}
        </div>
      </div>
    `;
    item.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (confirm('Supprimer cette conversation ?')) {
        deleteConversation(conv.id);
      }
    });

    container.appendChild(item);
  });
}

/**
 * Exporte les conversations en JSON
 */
function exportConversations() {
  const dataStr = JSON.stringify(conversations, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `snakeIA-conversations-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
}
