/* ============================================================
   PERSONALITY - Gestion des personnalités
   ============================================================ */

const PERSONALITIES = {
  anaconda: {
    name: 'Anaconda',
    emoji: '🟢',
    description: 'Calme et posé',
    message: `Bonjour... Prends le temps de bien formuler ta question, et je prendrai le temps de bien te répondre. Pas de stress, on a tout notre temps. 🌿`,
    theme: '',
  },
  cobra: {
    name: 'Cobra',
    emoji: '🐍',
    description: 'Colérique et direct',
    message: `Ha ! T'as intérêt à avoir une bonne question ! Crache ton truc, je suis direct et sans détour. Je vais t'dire ce que je pense, point. 🔥`,
    theme: 'theme-cobra',
  },
  python: {
    name: 'Python',
    emoji: '🐲',
    description: 'Intelligent et logique',
    message: `Bienvenue ! Je suis Python, une IA logique et structurée. Je vais analyser tes questions avec précision et te fournir des réponses réfléchies. Posons le problème clairement. 🧠`,
    theme: 'theme-python',
  },
  vipere: {
    name: 'Vipère',
    emoji: '⚡',
    description: 'Excité et énergique',
    message: `OUIII LET'S GOOOOO!!! Je suis trop excité de discuter avec toi!!! Pose tes questions, partage tes idées, c'est gonna be AMAZING!!! 🚀✨`,
    theme: 'theme-vipere',
  },
  couleuvre: {
    name: 'Couleuvre',
    emoji: '😄',
    description: 'Drôle et amusant',
    message: `Yo yo yo! Bienvenue! Prépare-toi pour une conversation pleine d'humour et de blagues! On va bien rigoler ensemble, c'est promis! 😂`,
    theme: 'theme-couleuvre',
  },
};

const FUNCTIONS = {
  discussion: {
    name: 'Discussion',
    emoji: '💬',
    description: 'Mode discussion libre',
  },
  reflexion: {
    name: 'Réflexion',
    emoji: '🧠',
    description: 'Mode réflexion profonde',
  },
};

let currentPersonality = getFromLocalStorage('personality', 'anaconda');
let currentFunction = getFromLocalStorage('function', 'discussion');

/**
 * Change la personnalité actuelle
 */
function changePersonality(personality) {
  if (!PERSONALITIES[personality]) {
    console.error('Personnalité inconnue:', personality);
    return;
  }

  currentPersonality = personality;
  currentConversationId = null;  // Réinitialiser la conversation
  saveToLocalStorage('personality', personality);
  saveToLocalStorage('currentConversation', null);

  // Mettre à jour le header
  const p = PERSONALITIES[personality];
  document.getElementById('headerEmoji').textContent = p.emoji;
  document.getElementById('headerName').textContent = p.name;

  // Mettre à jour le thème
  applyTheme(personality);

  // Mettre à jour la sidebar
  initPersonalityCards();

  // Réinitialiser le chat et afficher le message de bienvenue
  resetChat();

  // Mise à jour visuelle
  const cards = document.querySelectorAll('.personality-card');
  cards.forEach(card => card.classList.remove('active'));
  const activeCard = document.querySelector(
    `.personality-card[data-personality="${personality}"]`
  );
  if (activeCard) {
    activeCard.classList.add('active');
  }
}

/**
 * Change la fonction actuelle
 */
function changeFunction(func) {
  if (!FUNCTIONS[func]) {
    console.error('Fonction inconnue:', func);
    return;
  }

  currentFunction = func;
  saveToLocalStorage('function', func);

  // Mettre à jour le header
  document.getElementById('headerMode').textContent = FUNCTIONS[func].name;

  // Mise à jour visuelle
  const cards = document.querySelectorAll('.function-card');
  cards.forEach(card => card.classList.remove('active'));
  const activeCard = document.querySelector(
    `.function-card[data-function="${func}"]`
  );
  if (activeCard) {
    activeCard.classList.add('active');
  }
}

/**
 * Applique le thème de la personnalité
 */
function applyTheme(personality) {
  const root = document.documentElement;

  // Supprimer les anciens thèmes
  root.classList.remove('theme-cobra', 'theme-python', 'theme-vipere', 'theme-couleuvre');

  // Appliquer le nouveau thème
  const themeClass = PERSONALITIES[personality].theme;
  if (themeClass && themeClass.startsWith('theme-')) {
    root.classList.add(themeClass);
  }
}

/**
 * Initialise les cartes de personnalités dans la sidebar
 */
function initPersonalityCards() {
  const container = document.getElementById('personalityGrid');
  container.innerHTML = '';

  Object.entries(PERSONALITIES).forEach(([key, p]) => {
    const card = document.createElement('div');
    card.className = `personality-card ${key === currentPersonality ? 'active' : ''}`;
    card.dataset.personality = key;
    card.onclick = () => changePersonality(key);
    card.innerHTML = `
      <span class="personality-emoji">${p.emoji}</span>
      <span class="personality-name">${p.name}</span>
      <span class="personality-desc">${p.description}</span>
    `;
    container.appendChild(card);
  });
}


/**
 * Initialise les cartes de fonctions dans la sidebar
 */
function initFunctionCards() {
  const container = document.getElementById('functionList');
  container.innerHTML = '';

  Object.entries(FUNCTIONS).forEach(([key, f]) => {
    const card = document.createElement('div');
    card.className = `function-card ${key === currentFunction ? 'active' : ''}`;
    card.dataset.function = key;
    card.onclick = () => changeFunction(key);
    card.innerHTML = `
      <span class="function-emoji">${f.emoji}</span>
      <span class="function-name">${f.name}</span>
    `;
    container.appendChild(card);
  });
}

