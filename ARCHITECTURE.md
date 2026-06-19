# 🏗️ Architecture Technique de SnakeIA

Document technique pour le jury expliquant l'architecture professionnelle du projet.

## 📐 Vue d'Ensemble

```
┌─────────────────────────────────────────────────────┐
│                   UTILISATEUR FINAL                 │
├─────────────────────────────────────────────────────┤
│                  NAVIGATEUR WEB                     │
├─────────────────────────────────────────────────────┤
│         FRONTEND (HTML/CSS/JavaScript)              │
│  - Interface responsive (Desktop/Tablet/Mobile)     │
│  - Gestion d'état côté client                       │
│  - Historique local (localStorage)                  │
├─────────────────────────────────────────────────────┤
│              API REST (FastAPI)                     │
│  - Endpoint /api/chat                              │
│  - Gestion des requêtes                            │
│  - Traitement du langage naturel                   │
├─────────────────────────────────────────────────────┤
│          BASE DE CONNAISSANCES                      │
│  - Réponses structurées par personnalité            │
│  - Système de matching par mots-clés               │
│  - Extensible pour l'IA avancée                    │
└─────────────────────────────────────────────────────┘
```

## 📁 Arborescence Complète

```
snakeIA/
│
├── 📂 frontend/
│   ├── 📂 assets/
│   │   ├── motif.svg (design de fond)
│   │   ├── images/ (images du projet)
│   │   └── fonts/ (polices personnalisées)
│   │
│   ├── 📂 css/
│   │   ├── variables.css (550 lignes)
│   │   │   └─ Design system complet
│   │   │   └─ Thèmes pour 5 personnalités
│   │   │   └─ Palettes de couleurs
│   │   │
│   │   ├── layout.css (350 lignes)
│   │   │   └─ Grid layout (sidebar + content)
│   │   │   └─ Header professionnel
│   │   │   └─ Zone chat avec scrollbar personnalisée
│   │   │   └─ Formulaire input + bouton
│   │   │
│   │   ├── sidebar.css (300 lignes)
│   │   │   └─ Sidebar 280px coulissante
│   │   │   └─ 3 onglets (Historique, Perso, Fonctions)
│   │   │   └─ Cartes interactives
│   │   │
│   │   ├── chatbot.css (150 lignes)
│   │   │   └─ Styles des messages
│   │   │   └─ Animations (typing, bounce)
│   │   │   └─ Formatage du texte riche
│   │   │
│   │   └── responsive.css (400 lignes)
│   │       └─ Breakpoints: 1440px, 1024px, 768px, 480px
│   │       └─ Layout mobile (sidebar cachée)
│   │       └─ Media queries complètes
│   │
│   ├── 📂 js/
│   │   ├── utils.js (120 lignes)
│   │   │   ├─ saveToLocalStorage()
│   │   │   ├─ getFromLocalStorage()
│   │   │   ├─ generateId()
│   │   │   ├─ formatDate()
│   │   │   └─ Fonctions utilitaires
│   │   │
│   │   ├── personality.js (250 lignes)
│   │   │   ├─ PERSONALITIES{} - 5 personnalités
│   │   │   ├─ FUNCTIONS{} - 2 rôles
│   │   │   ├─ changePersonality()
│   │   │   ├─ changeFunction()
│   │   │   ├─ applyTheme()
│   │   │   └─ Gestion thèmes dynamiques
│   │   │
│   │   ├── history.js (280 lignes)
│   │   │   ├─ conversations[] - Historique local
│   │   │   ├─ createNewConversation()
│   │   │   ├─ loadConversation()
│   │   │   ├─ deleteConversation()
│   │   │   ├─ clearHistory()
│   │   │   └─ exportConversations()
│   │   │
│   │   ├── sidebar.js (150 lignes)
│   │   │   ├─ toggleSidebar()
│   │   │   ├─ switchTab()
│   │   │   ├─ initSidebar()
│   │   │   └─ Gestion de la sidebar
│   │   │
│   │   ├── chatbot.js (200 lignes)
│   │   │   ├─ addMessage()
│   │   │   ├─ sendMessage()
│   │   │   ├─ addLoadingMessage()
│   │   │   ├─ displaySuggestions()
│   │   │   └─ Logique du chat
│   │   │
│   │   └── main.js (100 lignes)
│   │       ├─ initializeApp()
│   │       ├─ attachEventListeners()
│   │       └─ Orchestration globale
│   │
│   ├── index.html (260 lignes)
│   │   ├─ Sidebar avec 3 onglets
│   │   ├─ Header avec badge personnalité
│   │   ├─ Zone chat + suggestions
│   │   ├─ Input formulaire
│   │   └─ Scripts organisés
│   │
│   └── landing.html (existant)
│       └─ Page d'accueil professionnelle
│
├── 📂 backend/
│   ├── main.py (200 lignes)
│   │   ├─ FastAPI application
│   │   ├─ Route GET /
│   │   ├─ Route GET /health
│   │   ├─ Route POST /api/chat
│   │   ├─ Route GET /api/personalities
│   │   ├─ CORS middleware
│   │   └─ Gestion des erreurs
│   │
│   ├── requirements.txt
│   │   ├─ fastapi==0.104.1
│   │   ├─ uvicorn==0.24.0
│   │   ├─ pydantic==2.5.0
│   │   └─ python-dotenv==1.0.0
│   │
│   ├── Dockerfile
│   │   └─ Image Python 3.11-slim
│   │   └─ Port 8000
│   │
│   └── config.py (future)
│       └─ Configuration centralisée
│
├── 📄 README.md
│   ├─ Guide utilisateur complet
│   ├─ Structure du projet
│   ├─ Installation
│   ├─ Configuration
│   ├─ Endpoints API
│   └─ Stack technique
│
├── 📄 DEPLOYMENT.md
│   ├─ Déploiement local
│   ├─ Déploiement production
│   ├─ Sécurité
│   ├─ Monitoring
│   └─ Troubleshooting
│
├── 📄 ARCHITECTURE.md (ce fichier)
│   └─ Vue technique complète
│
├── .env.example
│   ├─ SERVER_PORT=8000
│   ├─ DEBUG=false
│   └─ Variables d'environnement
│
├── .gitignore
│   ├─ Exclusions Python
│   ├─ Exclusions Node
│   └─ Fichiers sensibles
│
└── docker-compose.yml
    ├─ Service frontend (Nginx)
    ├─ Service backend (FastAPI)
    ├─ Networking
    └─ Health checks
```

## 🔄 Flux de Données

### 1. Initialisation
```
Page Load → initializeApp() → Charger personnalité/historique → Afficher UI
```

### 2. Envoi de Message
```
Utilisateur tape → Frontend valide → Envoi POST /api/chat → 
Backend traite → Réponse JSON → UI affiche → Sauvegarde historique
```

### 3. Changement Personnalité
```
Click sur personnalité → changePersonality() → 
applyTheme() + Mettre à jour header → Mettre à jour message bienvenue
```

### 4. Historique
```
Nouveau message → addMessageToConversation() → Sauvegarde localStorage →
updateHistoryList() → Affiche dans sidebar
```

## 🎨 Système de Design

### Variables CSS

**Espacements:**
- xs: 0.25rem | sm: 0.5rem | md: 1rem | lg: 1.5rem | xl: 2rem | 2xl: 3rem

**Typographie:**
- xs: 0.65rem | sm: 0.85rem | base: 1rem | lg: 1.25rem | xl: 1.5rem | 2xl: 2rem

**Transitions:**
- fast: 0.2s | normal: 0.3s | slow: 0.5s

**Couleurs par Personnalité:**

| Personnalité | Primary | Dark | Thème CSS |
|---|---|---|---|
| Anaconda (défaut) | #daa520 | #20c997 | aucun |
| Cobra | #ef4444 | #1f2937 | theme-cobra |
| Python | #4a90d9 | #1e3a8a | theme-python |
| Vipère | #9333ea | #1e1b4b | theme-vipere |
| Couleuvre | #fbbf24 | #92400e | theme-couleuvre |

## 📱 Responsive Design

| Écran | Breakpoint | Comportement |
|---|---|---|
| Desktop | 1024px+ | Sidebar fixe 280px |
| Tablette | 768px-1024px | Sidebar coulissante |
| Mobile | <768px | Sidebar cachée par défaut |
| Petit mobile | <480px | Layout compact |

## 🗄️ Stockage Local

```javascript
localStorage:
├─ conversations: Historique JSON complet
├─ personality: Personnalité actuelle (anaconda)
├─ function: Fonction actuelle (discussion)
├─ sidebarOpen: État sidebar (true/false)
└─ activeSidebarTab: Onglet actif (history/personality/function)
```

## 🔌 API Endpoints

```
GET  /                    → Info app
GET  /health              → Vérification santé
POST /api/chat            → Message → Réponse
GET  /api/personalities   → Liste personnalités
```

### Schema POST /api/chat

**Request:**
```json
{
  "texte": "Bonjour",
  "personality": "anaconda",
  "function": "discussion"
}
```

**Response:**
```json
{
  "reponse": "Bonjour... Comment puis-je t'aider ?"
}
```

## 🛠️ Stack Technique

### Frontend
- **HTML5** : Structure sémantique
- **CSS3** : Grid layout, Flexbox, Animations
- **JavaScript (Vanilla)** : Aucune dépendance
- **LocalStorage** : Persistance côté client

### Backend
- **Python 3.11** : Langage
- **FastAPI** : Framework web moderne
- **Pydantic** : Validation des données
- **Uvicorn** : Serveur ASGI
- **Docker** : Conteneurisation

### DevOps
- **Docker** : Conteneurisation
- **Docker Compose** : Orchestration locale
- **Nginx** : Reverse proxy + static files
- **Git** : Versioning

## 📊 Métriques de Code

```
Frontend:
- index.html: 260 lignes
- CSS total: 1,200 lignes (variables, layout, sidebar, chatbot, responsive)
- JavaScript total: 1,200 lignes (modulaire en 6 fichiers)

Backend:
- main.py: 200 lignes
- Hautement maintenable et extensible

Total: ~2,850 lignes de code
```

## 🚀 Extensibilité Future

### Phase 2
- [ ] Authentification utilisateurs
- [ ] Base de données MongoDB/PostgreSQL
- [ ] Intégration Claude API
- [ ] Système de plugins

### Phase 3
- [ ] Machine Learning
- [ ] Analytics
- [ ] Multi-langue
- [ ] Mobile app native

## 🎓 Pour le Jury

### Points Forts
1. **Architecture Professionnelle** : Séparation concerns, modulaire
2. **Code Propre** : Naming conventions, organisation logique
3. **Documentation** : README, DEPLOYMENT, ARCHITECTURE complets
4. **Responsive** : Fonctionne sur tous les écrans
5. **Sans Dépendances** : Frontend en vanilla JS
6. **Prêt Production** : Docker, environnement, healthchecks

### Apprentissages
- Architecture web moderne
- Gestion d'état client
- Communication API REST
- Design System
- Responsive design
- DevOps basique

---

**Créé par** : Un collégien passionné par l'IA  
**Date** : 2026-06-18  
**Version** : 1.0.0 - Production Ready
