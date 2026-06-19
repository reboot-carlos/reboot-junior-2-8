"""
SnakeIA - Backend API
Application FastAPI connectée à l'API Anthropic Claude
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import anthropic
import os
from dotenv import load_dotenv

load_dotenv()

# ============================================================
# Configuration
# ============================================================

app = FastAPI(
    title="SnakeIA API",
    description="API pour le chatbot SnakeIA",
    version="2.0.0"
)

ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

MODEL = "claude-haiku-4-5-20251001"

# ============================================================
# System prompts par personnalité
# Prompt caching activé via cache_control
# ============================================================

SYSTEM_PROMPTS = {
    "anaconda": """Tu es Anaconda, un assistant IA calme et posé.
Tu parles lentement et sagement, en prenant toujours le temps de bien réfléchir avant de répondre.
Tu utilises un ton doux, jamais pressé, avec des pauses naturelles dans tes phrases.
Tu aimes les métaphores liées à la nature, à la sérénité, au temps qui passe.
Tu réponds toujours en français, de manière concise mais bienveillante.
Ajoute occasionnellement des emojis nature comme 🌿 ou 🍃.""",

    "cobra": """Tu es Cobra, un assistant IA colérique, direct et sans filtre.
Tu vas droit au but, tu n'as pas de temps à perdre avec les politesses inutiles.
Tu es impatient, parfois brusque, mais toujours honnête - tu dis exactement ce que tu penses.
Tu utilises des phrases courtes et percutantes. Tu peux être sarcastique.
Tu réponds toujours en français. Ajoute parfois des emojis comme 🔥 ou 💢.
Si la question est stupide, tu le dis clairement.""",

    "python": """Tu es Python, un assistant IA logique, précis et analytique.
Tu abordes chaque problème avec méthode et rigueur. Tu aimes les faits, les données et la logique.
Tu structures tes réponses de façon claire (listes, étapes, raisonnements).
Tu évites les émotions et te concentres sur l'essentiel : les faits et la logique.
Tu réponds toujours en français avec précision et clarté.
Ajoute parfois des emojis comme 🧠 ou 📊.""",

    "vipere": """Tu es Vipère, un assistant IA EXTRÊMEMENT excité et énergique !!!
Tu parles avec BEAUCOUP d'enthousiasme, des majuscules et des points d'exclamation !!!
Tu es toujours super positif, hyperactif, tu t'emballe facilement pour tout et n'importe quoi !!!
Tu utilises un langage familier et dynamique. Chaque chose est INCROYABLE pour toi !!!
Tu réponds toujours en français avec une énergie débordante !!!
Utilise PLEIN d'emojis comme 🚀✨⚡🎉 dans tes réponses !!!""",

    "couleuvre": """Tu es Couleuvre, un assistant IA comique et drôle.
Tu glisses des blagues, des jeux de mots et de l'humour dans toutes tes réponses.
Tu es léger, amusant, tu ne te prends jamais au sérieux.
Tu peux faire des jeux de mots (même mauvais), des références humoristiques.
Tu réponds toujours en français avec le sourire.
Ajoute des emojis marrants comme 😂🤣😄 et tes meilleures blagues.""",
}

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# ============================================================
# Modèles
# ============================================================

class MessageRequest(BaseModel):
    texte: str
    personality: str = "anaconda"
    function: str = "discussion"

class MessageResponse(BaseModel):
    reponse: str

# ============================================================
# Routes
# ============================================================

@app.get("/")
async def root():
    return {
        "message": "Bienvenue sur SnakeIA API",
        "version": "2.0.0",
        "model": MODEL,
        "docs": "/docs"
    }

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/api/chat", response_model=MessageResponse)
async def chat(request: MessageRequest):
    if not request.texte or len(request.texte.strip()) == 0:
        raise HTTPException(status_code=400, detail="Le message ne peut pas être vide")

    if request.personality not in SYSTEM_PROMPTS:
        raise HTTPException(status_code=400, detail=f"Personnalité inconnue: {request.personality}")

    system_prompt = SYSTEM_PROMPTS[request.personality]

    # Ajuster le prompt selon la fonction choisie
    if request.function == "reflexion":
        system_prompt += "\n\nMode Réflexion activé : prends le temps d'analyser en profondeur avant de répondre."

    try:
        # Appel à l'API Claude avec prompt caching sur le system prompt
        response = client.messages.create(
            model=MODEL,
            max_tokens=1024,
            system=[
                {
                    "type": "text",
                    "text": system_prompt,
                    "cache_control": {"type": "ephemeral"}  # Cache le system prompt
                }
            ],
            messages=[
                {"role": "user", "content": request.texte}
            ]
        )

        reponse_text = next(
            (block.text for block in response.content if block.type == "text"),
            "Je n'ai pas pu générer une réponse."
        )

        return MessageResponse(reponse=reponse_text)

    except anthropic.AuthenticationError:
        raise HTTPException(status_code=401, detail="Clé API Anthropic invalide.")
    except anthropic.RateLimitError:
        raise HTTPException(status_code=429, detail="Limite de requêtes atteinte. Réessaie dans un moment.")
    except anthropic.APIError as e:
        raise HTTPException(status_code=502, detail=f"Erreur API Claude : {str(e)}")

@app.get("/api/personalities")
async def get_personalities():
    return {"personalities": list(SYSTEM_PROMPTS.keys())}

# ============================================================
# Gestion des erreurs
# ============================================================

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
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
