# WA Bot (Docker)

## Requisiti
- Docker Desktop (Windows/macOS) o Docker Engine (Linux)
- Docker Compose v2

## Setup rapido
```bash
# 1) Estrai la cartella
cd wa-bot-docker

# 2) Crea il file .env partendo dall'esempio
cp .env.example .env && nano .env  # modifica FLOWISE_URL

# 3) Build e avvio
docker compose up --build
# oppure in background
docker compose up -d --build

# 4) Scansiona il QR dai log
docker logs -f wa-bot
```

I dati di login WhatsApp vengono salvati nella cartella `auth/` (montata come volume).  
Per trasferire sul server, copia l'intera cartella del progetto **inclusa `auth/`** per non dover ricollegare il dispositivo.

## Comandi utili
```bash
docker compose logs -f
docker compose restart
docker compose down
```

## Personalizzazioni
- Modifica `WWEBJS_CLIENT_ID` nel `.env` per profili multipli.
- Se usi Google Chrome nel container, cambia `CHROME_PATH` e i pacchetti nel Dockerfile.
```)

