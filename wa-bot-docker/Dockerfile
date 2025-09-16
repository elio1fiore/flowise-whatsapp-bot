FROM node:20-bullseye

# Installa Chromium e dipendenze
RUN apt-get update && apt-get install -y     chromium     libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1     libxdamage1 libxi6 libxtst6 libnss3 libcups2 libxss1     libxrandr2 libasound2 libpangocairo-1.0-0 libpango-1.0-0     libgtk-3-0 libgbm1 fonts-liberation  && rm -rf /var/lib/apt/lists/*

ENV CHROME_PATH=/usr/bin/chromium
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# Persistenza auth WhatsApp
VOLUME ["/app/.wwebjs_auth"]

CMD ["npm", "start"]
