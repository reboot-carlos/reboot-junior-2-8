from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import anthropic

# Charger les variables d'environnement
load_dotenv()

app = FastAPI()

# Configurer CORS pour permettre les requêtes du frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialiser le client Anthropic
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Modèle pour recevoir les messages du chatbot
class Message(BaseModel):
    texte: str

@app.post("/api/chat")
async def chat(message: Message):
    """Endpoint pour traiter les messages du chatbot avec Claude"""
    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            system="Tu es SnakeIA, un chatbot amical créé par un collégien. Tu es enthousiaste, aidant et tu aimes discuter. Réponds de manière courte et amicale, en utilisant des emojis. Tu es une IA serpent ! 🐍",
            messages=[
                {
                    "role": "user",
                    "content": message.texte
                }
            ]
        )

        reponse = response.content[0].text
        return {"reponse": reponse}

    except anthropic.APIError as e:
        return {"reponse": f"Erreur avec Claude : {str(e)} 😔"}

# Servir le fichier HTML
@app.get("/")
async def root():
    return FileResponse("index.html")

# Servir les fichiers statiques (CSS, JS, etc.)
app.mount("/static", StaticFiles(directory="."), name="static")

if __name__ == "__main__":
    import uvicorn
    print("🐍 SnakeIA est en train de démarrer...")
    print("Accédez à http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
