# 🚀 Guide de Déploiement SnakeIA

Guide complet pour déployer SnakeIA en production.

## 📋 Prérequis

- Docker et Docker Compose installés
- Port 80 et 8000 disponibles
- Connexion internet
- (Optionnel) Serveur dédié pour la production

## 🏠 Déploiement Local

### 1. Préparation

```bash
# Cloner ou télécharger le projet
cd snakeIA

# Créer le fichier .env
cp .env.example .env

# Éditer .env si nécessaire
nano .env
```

### 2. Avec Docker (Recommandé)

```bash
# Lancer les conteneurs
docker-compose up -d

# Vérifier l'état
docker-compose ps

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

L'application sera accessible sur :
- Frontend : http://localhost
- Backend : http://localhost:8000
- Documentation API : http://localhost:8000/docs

### 3. Sans Docker

#### Backend
```bash
# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r backend/requirements.txt

# Lancer le serveur
cd backend
python main.py
```

#### Frontend
```bash
# Servir les fichiers statiques
python -m http.server 8080 --directory frontend
```

## 🌐 Déploiement en Production

### Option 1 : Sur un VPS (Linode, DigitalOcean, AWS)

#### 1. Configuration du Serveur

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Installer Docker Compose
sudo apt install -y docker-compose

# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker $USER
```

#### 2. Déployer le Projet

```bash
# Cloner le projet
git clone <repo-url> snakeIA
cd snakeIA

# Configurer .env pour la production
cp .env.example .env
nano .env

# Mise à jour .env pour la production
# - DEBUG=false
# - VITE_API_URL=https://ton-domaine.com
# - API_KEY=une-clé-sécurisée
```

#### 3. Configuration SSL (HTTPS)

```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenir un certificat
sudo certbot certonly --standalone -d ton-domaine.com
```

#### 4. Lancer les Services

```bash
# Démarrer les conteneurs
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Vérifier le statut
docker-compose ps

# Voir les logs
docker-compose logs -f
```

### Option 2 : Sur Vercel/Netlify (Frontend Uniquement)

```bash
# Déployer le frontend sur Vercel
# 1. Pusher sur GitHub
git push origin main

# 2. Se connecter à Vercel
# 3. Importer le repository
# 4. Configurer les variables d'environnement
# 5. Déployer

# Backend doit rester sur un serveur VPS
```

### Option 3 : Sur Heroku

```bash
# Installer Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Se connecter
heroku login

# Créer une application
heroku create snakeIA

# Déployer
git push heroku main

# Voir les logs
heroku logs --tail
```

## 🔐 Sécurité en Production

### 1. Variables d'Environnement

```bash
# .env en production DOIT contenir :
DEBUG=false
API_KEY=<une-clé-très-sécurisée>
CORS_ORIGINS=https://ton-domaine.com
```

### 2. HTTPS/SSL

```bash
# Vérifier que le certificat est valide
sudo certbot certificates

# Renouvellement automatique
sudo systemctl enable certbot.timer
```

### 3. Firewall

```bash
# Configurer UFW
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### 4. Backups

```bash
# Script de backup automatique
#!/bin/bash
docker-compose exec backend python -c "import shutil; shutil.copytree('database', 'backups/database-$(date +%Y%m%d)')"
```

## 📊 Monitoring

### Vérifier la Santé

```bash
# Tester l'API
curl http://localhost:8000/health

# Vérifier le frontend
curl http://localhost

# Logs en temps réel
docker-compose logs -f
```

### Métriques Importantes

- Disponibilité du service : 99.9%
- Temps de réponse API : < 200ms
- Utilisation CPU/RAM

## 🔄 Mise à Jour

```bash
# Mettre à jour le code
git pull origin main

# Redémarrer les services
docker-compose up -d --build

# Vérifier
docker-compose ps
```

## 🆘 Troubleshooting

### Le frontend ne se charge pas

```bash
# Vérifier les logs nginx
docker-compose logs frontend

# Reconstruire
docker-compose up -d --build frontend
```

### L'API ne répond pas

```bash
# Vérifier les logs backend
docker-compose logs backend

# Redémarrer
docker-compose restart backend
```

### Problèmes de CORS

```bash
# Vérifier la configuration .env
cat .env | grep CORS

# Ajouter ton domaine à CORS_ORIGINS
```

## 📈 Performance

### Optimisations

1. **Frontend**
   - Minifier CSS/JS
   - Compresser les images
   - Utiliser un CDN

2. **Backend**
   - Cacher les réponses
   - Optimiser les requêtes BD
   - Utiliser Redis si nécessaire

3. **Infrastructure**
   - Load balancing
   - Autoscaling
   - CDN global

## 📞 Support pour le Jury

### Informations Utiles

- **URL Application** : https://snakeIA.com
- **URL Documentation** : https://snakeIA.com/docs
- **Status Page** : https://snakeIA.statuspage.io

### Contact

Email : support@snakeIA.com  
Issues : https://github.com/username/snakeIA/issues

---

**Dernière mise à jour** : 2026-06-18
