/* ============================================================
   SIDEBAR - Gestion de la sidebar
   ============================================================ */

let sidebarOpen = getFromLocalStorage('sidebarOpen', true);

/**
 * Bascule l'état de la sidebar (ouvert/fermé)
 */
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const arrow = document.getElementById('sidebarArrow');
  sidebarOpen = !sidebarOpen;
  saveToLocalStorage('sidebarOpen', sidebarOpen);

  if (sidebarOpen) {
    sidebar.classList.remove('closed');
    sidebar.classList.add('open');
    arrow.textContent = '◀';
  } else {
    sidebar.classList.add('closed');
    sidebar.classList.remove('open');
    arrow.textContent = '▶';
  }
}

/**
 * Change l'onglet actif de la sidebar
 */
function switchTab(tabName) {
  // Mettre à jour les onglets
  const tabs = document.querySelectorAll('.sidebar-tab');
  tabs.forEach(tab => {
    tab.classList.remove('active');
    if (tab.dataset.tab === tabName) {
      tab.classList.add('active');
    }
  });

  // Mettre à jour les sections
  const sections = document.querySelectorAll('.sidebar-section');
  sections.forEach(section => {
    section.classList.remove('active');
    if (section.dataset.section === tabName) {
      section.classList.add('active');
    }
  });

  // Sauvegarder l'onglet actif
  saveToLocalStorage('activeSidebarTab', tabName);
}

/**
 * Initialise la sidebar
 */
function initSidebar() {
  // Initialiser les cartes de personnalités et fonctions
  initPersonalityCards();
  initFunctionCards();

  // Restaurer l'état de la sidebar
  const sidebar = document.querySelector('.sidebar');
  const arrow = document.getElementById('sidebarArrow');
  if (!sidebarOpen) {
    sidebar.classList.add('closed');
    arrow.textContent = '▶';
  } else {
    arrow.textContent = '◀';
  }

  // Restaurer l'onglet actif
  const activeTab = getFromLocalStorage('activeSidebarTab', 'history');
  switchTab(activeTab);

  // Mettre à jour l'historique
  updateHistoryList();

  // Ajouter l'événement de clic en dehors de la sidebar pour la fermer sur mobile
  document.addEventListener('click', (e) => {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.btn-sidebar-toggle');

    if (
      window.innerWidth <= 768 &&
      sidebarOpen &&
      !sidebar.contains(e.target) &&
      !toggleBtn.contains(e.target)
    ) {
      toggleSidebar();
    }
  });
}

/**
 * Crée une nouvelle conversation depuis la sidebar
 */
function newConversationFromSidebar() {
  createNewConversation();
  switchTab('history');
}
