"""
SnakeIA - Backend API
Application FastAPI pour le chatbot SnakeIA
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# ============================================================
# Configuration
# ============================================================

app = FastAPI(
    title="SnakeIA API",
    description="API pour le chatbot SnakeIA",
    version="1.0.0"
)

# CORS — allow_credentials=True est incompatible avec allow_origins=["*"]
ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

# ============================================================
# Modèles
# ============================================================

class MessageRequest(BaseModel):
    """Requête de message"""
    texte: str
    personality: str = "anaconda"
    function: str = "discussion"

class MessageResponse(BaseModel):
    """Réponse de message"""
    reponse: str

# ============================================================
# Base de connaissances
# ============================================================

KNOWLEDGE_BASE = {
    "anaconda": {
        "bonjour": "Bonjour... Comment puis-je t'aider ? 🌿",
        "qui es-tu": "Je suis Anaconda, une IA calme et posée. Je prends mon temps pour répondre aux questions.",
        "aide": "Je suis là pour t'aider. Pose-moi tes questions, je ferai de mon mieux.",
    },
    "cobra": {
        "bonjour": "Yo ! Qu'est-ce que tu veux ? 🔥",
        "qui es-tu": "Je suis Cobra, direct et sans détour. Je dis ce que je pense.",
        "aide": "Ouais, dis-moi ce que tu cherches et je vais t'arranger ça.",
    },
    "python": {
        "bonjour": "Bienvenue. Comment puis-je t'assister ? 🧠",
        "qui es-tu": "Je suis Python, une IA logique et structurée. Je fournis des réponses réfléchies.",
        "aide": "Je peux t'aider sur une variété de sujets. Sois précis dans ta question.",
    },
    "vipere": {
        "bonjour": "OUIII! Salut! Super de te voir! 🚀",
        "qui es-tu": "Je suis Vipère! L'IA la plus excitée de tous les temps!!! 😄",
        "aide": "Oh oui! Je vais t'aider avec plaisir! C'est gonna be AMAZING!!!",
    },
    "couleuvre": {
        "bonjour": "Yo! Ça va? Prêt pour rigoler? 😂",
        "qui es-tu": "Je suis Couleuvre, le chatbot le plus drôle de tous! 😄",
        "aide": "Avec plaisir! Posons les choses avec humour!",
    },
}

# ============================================================
# Routes
# ============================================================

@app.get("/")
async def root():
    """Route racine"""
    return {
        "message": "Bienvenue sur SnakeIA API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health():
    """Vérification de santé"""
    return {"status": "ok"}

@app.post("/api/chat", response_model=MessageResponse)
async def chat(request: MessageRequest):
    """
    Endpoint principal du chatbot

    Args:
        request: Message de l'utilisateur avec personnalité et fonction

    Returns:
        Réponse du chatbot
    """

    # Validation
    if not request.texte or len(request.texte.strip()) == 0:
        raise HTTPException(status_code=400, detail="Le message ne peut pas être vide")

    if request.personality not in KNOWLEDGE_BASE:
        raise HTTPException(status_code=400, detail=f"Personnalité inconnue: {request.personality}")

    # Traiter le message
    texte_lower = request.texte.lower().strip()

    # Chercher dans la base de connaissances
    kb = KNOWLEDGE_BASE.get(request.personality, {})

    # Réponse simple basée sur des mots-clés
    for keyword, response in kb.items():
        if keyword in texte_lower:
            return MessageResponse(reponse=response)

    # Réponse par défaut
    default_responses = {
        "anaconda": "C'est une bonne question. Laisse-moi réfléchir... 🌿",
        "cobra": "Intéressant! Je vais y réfléchir et te donner une réponse! 🔥",
        "python": "Excellente question. Voici mon analyse: Le sujet que tu abordes est complexe et mérite une réflexion approfondie. 🧠",
        "vipere": "OUUII! C'est une excellente question!!! Je suis trop excité de répondre à ça!!! 🚀",
        "couleuvre": "Haha! Bonne question! Tu m'as bien eu avec celle-ci! 😂",
    }

    return MessageResponse(
        reponse=default_responses.get(request.personality, "Je comprends ta question!")
    )

@app.get("/api/personalities")
async def get_personalities():
    """Retourne la liste des personnalités"""
    return {
        "personalities": list(KNOWLEDGE_BASE.keys())
    }

# ============================================================
# Gestion des erreurs
# ============================================================

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Gestionnaire d'erreurs global"""
    return JSONResponse(
        status_code=500,
        content={"error": "Une erreur est survenue", "detail": str(exc)}
    )

# ============================================================
# Lancement
# ============================================================

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("SERVER_PORT", 8000))
    debug = os.getenv("DEBUG", "false").lower() == "true"

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=debug,
        log_level="info"
    )
