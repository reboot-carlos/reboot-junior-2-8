#!/usr/bin/env bash
# ============================================================
# SnakeIA - Script de démarrage local
# Usage : ./start.sh [stop|logs|status|clean]
# ============================================================

set -euo pipefail

# ── Couleurs ────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# ── Helpers ─────────────────────────────────────────────────
info()    { echo -e "${BLUE}[INFO]${RESET}  $*"; }
success() { echo -e "${GREEN}[OK]${RESET}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${RESET}  $*"; }
error()   { echo -e "${RED}[ERROR]${RESET} $*"; }
step()    { echo -e "\n${BOLD}${CYAN}▶ $*${RESET}"; }

# ── Bannière ────────────────────────────────────────────────
print_banner() {
  echo -e "${GREEN}"
  echo "  ███████╗███╗   ██╗ █████╗ ██╗  ██╗███████╗██╗ █████╗ "
  echo "  ██╔════╝████╗  ██║██╔══██╗██║ ██╔╝██╔════╝██║██╔══██╗"
  echo "  ███████╗██╔██╗ ██║███████║█████╔╝ █████╗  ██║███████║"
  echo "  ╚════██║██║╚██╗██║██╔══██║██╔═██╗ ██╔══╝  ██║██╔══██║"
  echo "  ███████║██║ ╚████║██║  ██║██║  ██╗███████╗██║██║  ██║"
  echo "  ╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═╝"
  echo -e "${RESET}"
  echo -e "  ${BOLD}Chatbot IA local — Script de test${RESET}"
  echo -e "  ────────────────────────────────────────────────────"
  echo ""
}

# ── Commandes utilitaires ────────────────────────────────────
CMD="${1:-start}"

case "$CMD" in
  stop)
    step "Arrêt des conteneurs"
    docker compose down
    success "Conteneurs arrêtés."
    exit 0
    ;;
  logs)
    info "Affichage des logs (Ctrl+C pour quitter)"
    docker compose logs -f
    exit 0
    ;;
  status)
    step "État des conteneurs"
    docker compose ps
    exit 0
    ;;
  clean)
    step "Nettoyage complet (conteneurs + images + volumes)"
    docker compose down --rmi all --volumes --remove-orphans
    success "Nettoyage terminé."
    exit 0
    ;;
  start|"")
    ;;
  *)
    echo "Usage: $0 [start|stop|logs|status|clean]"
    exit 1
    ;;
esac

# ════════════════════════════════════════════════════════════
#  DÉMARRAGE
# ════════════════════════════════════════════════════════════

print_banner

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ── 1. Prérequis ─────────────────────────────────────────────
step "Vérification des prérequis"

if ! command -v docker &>/dev/null; then
  error "Docker n'est pas installé."
  echo "  → Installe Docker : https://docs.docker.com/get-docker/"
  exit 1
fi
success "Docker $(docker --version | cut -d' ' -f3 | tr -d ',')"

if docker compose version &>/dev/null 2>&1; then
  COMPOSE_CMD="docker compose"
elif docker-compose --version &>/dev/null 2>&1; then
  COMPOSE_CMD="docker-compose"
else
  error "Docker Compose n'est pas installé."
  echo "  → Installe Docker Compose : https://docs.docker.com/compose/install/"
  exit 1
fi
success "Docker Compose détecté ($COMPOSE_CMD)"

# ── 2. Vérifier les fichiers requis ──────────────────────────
step "Vérification des fichiers"

REQUIRED_FILES=(
  "docker-compose.yml"
  "nginx.conf"
  "frontend/index.html"
  "frontend/landing.html"
  "frontend/assets/motif.svg"
  "backend/main.py"
  "backend/requirements.txt"
  "backend/Dockerfile"
)

ALL_OK=true
for f in "${REQUIRED_FILES[@]}"; do
  if [[ -f "$f" ]]; then
    success "$f"
  else
    error "$f — MANQUANT"
    ALL_OK=false
  fi
done

if [[ "$ALL_OK" == false ]]; then
  error "Des fichiers requis sont manquants. Arrêt."
  exit 1
fi

# ── 3. Vérifier les ports libres ─────────────────────────────
step "Vérification des ports"

check_port() {
  local port=$1
  local name=$2
  if lsof -i ":$port" &>/dev/null 2>&1 || ss -tlnp "sport = :$port" 2>/dev/null | grep -q ":$port"; then
    warn "Port $port ($name) déjà utilisé — tentative de libération"
    $COMPOSE_CMD down &>/dev/null || true
  else
    success "Port $port ($name) libre"
  fi
}

check_port 80   "Frontend"
check_port 8000 "Backend API"

# ── 4. Fichier .env ──────────────────────────────────────────
step "Vérification de la configuration"

if [[ ! -f ".env" ]]; then
  if [[ -f ".env.example" ]]; then
    warn ".env manquant — copie depuis .env.example"
    cp .env.example .env
    warn "⚠️  Édite .env et ajoute ta vraie clé API avant de déployer en production !"
  else
    warn ".env manquant — création d'un .env minimal"
    cat > .env <<EOF
DEBUG=false
SERVER_PORT=8000
API_KEY=local-dev-key
CORS_ORIGINS=*
EOF
  fi
else
  success ".env présent"

  # Avertir si la clé par défaut est encore là
  if grep -q "change-this-in-production\|your-secret-key\|local-dev-key" .env 2>/dev/null; then
    warn "⚠️  La clé API dans .env semble être une valeur par défaut."
  fi
fi

# ── 5. Build ─────────────────────────────────────────────────
step "Build des images Docker"

$COMPOSE_CMD build --no-cache
success "Images construites"

# ── 6. Démarrage ─────────────────────────────────────────────
step "Démarrage des conteneurs"

$COMPOSE_CMD up -d
success "Conteneurs démarrés"

# ── 7. Health checks ─────────────────────────────────────────
step "Attente du démarrage des services"

wait_for_service() {
  local name=$1
  local url=$2
  local max_attempts=30
  local attempt=1

  echo -ne "  Attente de ${name}"
  while [[ $attempt -le $max_attempts ]]; do
    if curl -sf "$url" &>/dev/null; then
      echo -e "\r${GREEN}[OK]${RESET}    ${name} opérationnel ✓          "
      return 0
    fi
    echo -ne "\r  ${YELLOW}Attente de ${name}...${RESET} (${attempt}/${max_attempts})"
    sleep 2
    ((attempt++))
  done

  echo -e "\r${RED}[TIMEOUT]${RESET} ${name} ne répond pas après $((max_attempts * 2))s"
  return 1
}

BACKEND_OK=true
FRONTEND_OK=true

wait_for_service "Backend API" "http://localhost:8000/health" || BACKEND_OK=false
wait_for_service "Frontend"    "http://localhost/"            || FRONTEND_OK=false

# ── 8. Rapport final ─────────────────────────────────────────
echo ""
echo -e "${BOLD}────────────────────────────────────────────────────${RESET}"
echo -e "${BOLD}  Rapport de démarrage${RESET}"
echo -e "${BOLD}────────────────────────────────────────────────────${RESET}"

if [[ "$BACKEND_OK" == true && "$FRONTEND_OK" == true ]]; then
  echo -e ""
  echo -e "  ${GREEN}${BOLD}✅ SnakeIA est opérationnel !${RESET}"
  echo -e ""
  echo -e "  ${BOLD}URLs :${RESET}"
  echo -e "  🌐 Landing page  →  ${CYAN}http://localhost/landing.html${RESET}"
  echo -e "  💬 Chatbot       →  ${CYAN}http://localhost${RESET}"
  echo -e "  📡 API           →  ${CYAN}http://localhost:8000${RESET}"
  echo -e "  📚 API Docs      →  ${CYAN}http://localhost:8000/docs${RESET}"
  echo -e ""
  echo -e "  ${BOLD}Commandes utiles :${RESET}"
  echo -e "  ./start.sh logs    → Voir les logs en direct"
  echo -e "  ./start.sh status  → État des conteneurs"
  echo -e "  ./start.sh stop    → Arrêter les conteneurs"
  echo -e "  ./start.sh clean   → Tout nettoyer"
  echo ""

  # Ouvrir le navigateur automatiquement si possible
  URL="http://localhost/landing.html"
  if command -v xdg-open &>/dev/null; then
    xdg-open "$URL" &>/dev/null &
    info "Navigateur ouvert sur $URL"
  elif command -v open &>/dev/null; then
    open "$URL"
    info "Navigateur ouvert sur $URL"
  fi

else
  echo -e ""
  echo -e "  ${RED}${BOLD}❌ Certains services n'ont pas démarré.${RESET}"
  echo -e ""
  [[ "$BACKEND_OK"  == false ]] && error "Backend  → non opérationnel"
  [[ "$FRONTEND_OK" == false ]] && error "Frontend → non opérationnel"
  echo ""
  info "Consulte les logs pour diagnostiquer :"
  echo -e "  ${CYAN}./start.sh logs${RESET}"
  echo ""
  $COMPOSE_CMD logs --tail=30
  exit 1
fi
