/* ============================================================
   UTILS - Fonctions utilitaires
   ============================================================ */

/**
 * Sauvegarde une donnée dans localStorage
 */
function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Erreur localStorage:', error);
  }
}

/**
 * Récupère une donnée de localStorage
 */
function getFromLocalStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Erreur localStorage:', error);
    return defaultValue;
  }
}

/**
 * Générer un ID unique
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Formate une date
 */
function formatDate(date) {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Formate la date d'une conversation
 */
function formatConversationDate(date) {
  const d = new Date(date);
  const today = new Date();

  if (d.toDateString() === today.toDateString()) {
    return `Aujourd'hui ${formatDate(d)}`;
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) {
    return `Hier ${formatDate(d)}`;
  }

  return d.toLocaleDateString('fr-FR');
}

/**
 * Échappe les caractères HTML
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Vérifie si la connexion internet est disponible
 */
function isOnline() {
  return navigator.onLine;
}
