import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;

import qrcode from 'qrcode-terminal';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const flowiseUrl = process.env.FLOWISE_URL;
if (!flowiseUrl) {
  console.error('Missing FLOWISE_URL in environment');
  process.exit(1);
}

const chromePath = process.env.CHROME_PATH || '/usr/bin/chromium';
const clientId = process.env.WWEBJS_CLIENT_ID || 'bot1';

const client = new Client({
  authStrategy: new LocalAuth({ clientId, dataPath: './.wwebjs_auth' }),
  puppeteer: {
    executablePath: chromePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-gpu',
      '--disable-extensions',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  }
});

client.on('qr', qr => {
  console.log('\n📱 Scansiona il QR code con WhatsApp (Dispositivi collegati > Collega dispositivo):\n');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('\n✅ Bot connesso a WhatsApp e pronto!\n');
});

const chatHistories = {};

client.on('message', async msg => {
  const userId = msg.from;
  const message = (msg.body || '').trim();
  console.log(`📩 Messaggio da ${userId}: "${message}"`);
  if (!message) return;

  chatHistories[userId] ||= [];
  chatHistories[userId].push({ role: 'user', content: message });

  try {
    const res = await axios.post(flowiseUrl, {
      question: message,
      overrideConfig: { sessionId: userId }
    }, { timeout: 60000 });

    const reply = (res?.data?.text ?? '').toString().trim() || 'Nessuna risposta.';
    chatHistories[userId].push({ role: 'assistant', content: reply });

    console.log(`📤 Risposta a ${userId}: "${reply}"`);
    await msg.reply(reply);
  } catch (err) {
    console.error('❌ Errore contattando Flowise:', err?.message || err);
    await msg.reply('⚠️ Errore nel contattare il bot.');
  }
});

const shutdown = async () => {
  try { await client.destroy(); } catch { }
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

client.initialize();
