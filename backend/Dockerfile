FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Créer un utilisateur non-root
RUN adduser --disabled-password --no-create-home snakeia
USER snakeia

EXPOSE 8000

CMD ["python", "main.py"]
