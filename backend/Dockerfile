FROM python:3.11-slim

WORKDIR /app

# Chemins depuis la racine du repo (Railway utilise toujours la racine comme contexte)
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
