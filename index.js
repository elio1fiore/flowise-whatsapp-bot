const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const puppeteer = require('puppeteer');

// ✅ Flowise endpoint (modifica solo questo se cambi il tuo flow)
const flowiseUrl = 'https://cloud.flowiseai.com/api/v1/prediction/e795149f-737e-4831-bf91-a0b092aa0ff2';
// executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'bot1' }), // <-- nuovo profilo
  puppeteer: {
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--no-first-run',
      '--no-default-browser-check',
    ],
  },
});

// Mostra il QR per accedere a WhatsApp Web
client.on('qr', qr => {
  console.log('\n📱 Scansiona il QR code con WhatsApp Web:\n');
  qrcode.generate(qr, { small: true });
});

// Log quando il bot è connesso
client.on('ready', () => {
  console.log('\n✅ Bot connesso a WhatsApp e pronto!\n');
});

// Gestione messaggi
// 🧠 Salva lo storico dei messaggi per ogni utente
const chatHistories = {};

client.on('message', async msg => {
  const userId = msg.from;
  const message = msg.body;

  console.log(`📩 Messaggio da ${userId}: "${message}"`);

  if (!message || message.trim() === '') {
    console.log(`⛔️ Messaggio vuoto ignorato da ${userId}`);
    return;
  }


  // Inizializza la cronologia se non esiste
  if (!chatHistories[userId]) {
    chatHistories[userId] = [];
  }

  // Aggiungi il nuovo messaggio alla cronologia
  chatHistories[userId].push({
    role: 'user',
    content: message
  });

  try {
    const res = await axios.post(flowiseUrl, {
      question: message,
      overrideConfig: {
        sessionId: userId,
      },
    });


    const reply = res.data.text;

    // Salva anche la risposta del bot nella cronologia
    chatHistories[userId].push({
      role: 'assistant',
      content: reply
    });

    console.log(`📤 Risposta a ${userId}: "${reply}"`);
    await msg.reply(reply);
  } catch (err) {
    console.error('❌ Errore contattando Flowise:', err);
    await msg.reply('⚠️ Errore nel contattare il bot.');
  }
});


client.initialize();