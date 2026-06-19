/* ============================================================
   MAIN - Initialisation et orchestration
   ============================================================ */

/**
 * Initialise l'application au chargement
 */
function initializeApp() {
  // Initialiser la sidebar
  initSidebar();

  // Appliquer le thème et le header SANS déclencher resetChat
  applyTheme(currentPersonality);
  const p = PERSONALITIES[currentPersonality];
  document.getElementById('headerEmoji').textContent = p.emoji;
  document.getElementById('headerName').textContent = p.name;
  document.getElementById('headerMode').textContent = FUNCTIONS[currentFunction].name;
  initPersonalityCards();
  initFunctionCards();

  // Charger la conversation existante ou en créer une nouvelle
  const savedId = currentConversationId;
  const exists = savedId && conversations.find(c => c.id === savedId);
  if (exists) {
    loadConversation(savedId);
  } else {
    currentConversationId = null;
    createNewConversation();
  }

  // Afficher les suggestions
  displaySuggestions();

  // Attacher les événements
  attachEventListeners();

  console.log('✅ SnakeIA initialized successfully');
}

/**
 * Attache les événements globaux
 */
function attachEventListeners() {
  // Input - Entrée pour envoyer
  const input = document.getElementById('messageInput');
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.querySelector('.btn-send').click();
    }
  });

  // Online/Offline
  window.addEventListener('online', () => {
    console.log('✅ Connexion rétablie');
  });

  window.addEventListener('offline', () => {
    console.log('⚠️ Connexion perdue');
  });

  // Beforeunload (optionnel : avertir avant de quitter)
  // window.addEventListener('beforeunload', (e) => {
  //   e.preventDefault();
  //   e.returnValue = '';
  // });
}

/**
 * Arrête l'application proprement
 */
function cleanupApp() {
  // Sauvegarder l'état actuel
  saveToLocalStorage('currentConversation', currentConversationId);
  saveToLocalStorage('sidebarOpen', sidebarOpen);
  console.log('✅ SnakeIA cleanup completed');
}

// Lancer l'application quand le DOM est chargé
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Nettoyer avant de quitter
window.addEventListener('beforeunload', cleanupApp);

// Gestion des erreurs non interceptées
window.addEventListener('error', (e) => {
  console.error('❌ Erreur globale:', e.error);
  addMessage('bot', 'Une erreur inattendue s\'est produite. Veuillez recharger la page.');
});

// Gestion des promesses rejetées
window.addEventListener('unhandledrejection', (e) => {
  console.error('❌ Promise rejetée:', e.reason);
  addMessage('bot', 'Une erreur est survenue. Veuillez réessayer.');
});
