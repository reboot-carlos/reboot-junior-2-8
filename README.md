# SnakeIA - Chatbot Intelligent Professionnel

Un chatbot moderne et intelligent avec multiple personnalités, décliné en 5 thèmes distincts. Construisez avec une architecture professionnelle et scalable.

## 🎯 Caractéristiques

- **5 Personnalités Uniques** : Anaconda (calme), Cobra (direct), Python (logique), Vipère (énergique), Couleuvre (drôle)
- **2 Modes de Fonctionnement** : Discussion libre et Réflexion profonde
- **Historique des Conversations** : Sauvegarde automatique avec navigation facile
- **Design Professionnel** : Interface moderne et responsive
- **Architecture Modulaire** : Code organisé et maintenable
- **Thèmes Dynamiques** : Les couleurs changent selon la personnalité
- **Sidebar Intuitive** : Accès rapide aux personnalités et historique

## 📁 Structure du Projet

```
snakeIA/
├── frontend/
│   ├── assets/
│   │   ├── motif.svg
│   │   ├── images/
│   │   └── fonts/
│   ├── css/
│   │   ├── variables.css       # Design system et variables
│   │   ├── layout.css           # Layout principal
│   │   ├── chatbot.css          # Styles du chatbot
│   │   ├── sidebar.css          # Styles de la sidebar
│   │   └── responsive.css       # Responsive et media queries
│   ├── js/
│   │   ├── utils.js             # Fonctions utilitaires
│   │   ├── personality.js       # Gestion des personnalités
│   │   ├── history.js           # Gestion de l'historique
│   │   ├── sidebar.js           # Gestion de la sidebar
│   │   ├── chatbot.js           # Logique du chatbot
│   │   └── main.js              # Initialisation
│   ├── index.html               # Page principale
│   └── landing.html             # Landing page
├── backend/
│   ├── main.py                  # Application FastAPI
│   ├── config.py                # Configuration
│   ├── requirements.txt          # Dépendances Python
│   └── .env.example             # Variables d'environnement
├── docker-compose.yml           # Configuration Docker
├── .gitignore                   # Fichiers à ignorer
├── .env.example                 # Variables d'environnement
└── README.md                    # Ce fichier
```

## 🚀 Démarrage Rapide

### Sans Docker

#### Frontend
1. Placez le dossier `frontend/` sur un serveur web
2. Assurez-vous que le backend est accessible à `http://localhost:8000`

#### Backend
1. Installez les dépendances :
```bash
pip install -r backend/requirements.txt
```

2. Créez un fichier `.env` :
```bash
cp .env.example .env
```

3. Lancez le serveur :
```bash
cd backend
python main.py
```

### Avec Docker

```bash
docker-compose up
```

## 🎨 Architecture Design

### Système de Couleurs

- **Anaconda (Defaut)** : Vert doré (#daa520) + Vert menthe (#20c997)
- **Cobra** : Rouge (#ef4444) + Gris foncé (#1f2937)
- **Python** : Bleu (#4a90d9) + Bleu foncé (#1e3a8a)
- **Vipère** : Violet (#9333ea) + Noir bleuté (#1e1b4b)
- **Couleuvre** : Jaune (#fbbf24) + Marron (#92400e)

### Composants

#### Header
- Badge de personnalité avec emoji
- Nom et mode actuels
- Boutons d'actions

#### Sidebar (280px)
- **Onglet Historique** : Liste des conversations
- **Onglet Personnalités** : Sélection des 5 personnalités
- **Onglet Fonctions** : Choix Discussion/Réflexion

#### Zone Chat
- Zone d'affichage des messages
- Suggestions rapides
- Input + bouton envoyer

## 🔧 Configuration

### Variables d'Environnement

```env
# Backend
SERVER_PORT=8000
DEBUG=false
API_KEY=your_api_key_here

# Frontend
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=SnakeIA
```

## 💾 Stockage Local

L'application utilise `localStorage` pour :
- Conversations actives (`conversations`)
- Personnalité sélectionnée (`personality`)
- Fonction sélectionnée (`function`)
- État de la sidebar (`sidebarOpen`)

## 📱 Responsivité

- **Desktop** : Sidebar fixe 280px + contenu principal
- **Tablette** : Sidebar coulissante
- **Mobile** : Sidebar cachée par défaut

## 🔗 API Endpoints

### POST `/api/chat`
Envoie un message et reçoit une réponse

**Payload :**
```json
{
  "texte": "Bonjour",
  "personality": "anaconda",
  "function": "discussion"
}
```

**Réponse :**
```json
{
  "reponse": "Bonjour... Prends le temps..."
}
```

## 🛠️ Technologies

- **Frontend** : HTML5, CSS3, JavaScript (Vanilla)
- **Backend** : Python, FastAPI
- **Stockage** : LocalStorage (client), Base de données (serveur optionnelle)
- **Déploiement** : Docker, Docker Compose

## 📋 Checklist de Déploiement

- [ ] Mettre à jour `SERVER_URL` dans le code
- [ ] Configurer les variables d'environnement
- [ ] Tester l'API
- [ ] Vérifier les permissions CORS
- [ ] Tester sur mobile
- [ ] Minifier CSS/JS pour la production
- [ ] Ajouter SSL/HTTPS
- [ ] Configurer les sauvegardes

## 🐛 Debugging

### Console Navigateur
```javascript
// Voir les conversations
console.log(getFromLocalStorage('conversations'));

// Réinitialiser l'app
localStorage.clear();
location.reload();
```

### Serveur Backend
```bash
# Logs détaillés
python main.py --debug
```

## 📝 Licencing & Crédits

Créé par un collégien passionné par l'IA pour un jury de formation.

## 📞 Support

Pour toute question ou bug, consultez la documentation ou contactez le développeur.

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2026-06-18
