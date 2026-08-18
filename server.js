/**
 * OPS Dashboard — Servidor de Rede Interna
 * ------------------------------------------
 * Serve o dashboard (public/index.html) e guarda os dados
 * (ManPower, PCM, TMR, KPI, Ciclo de Vida) em um único arquivo
 * compartilhado (data.json), para que todos que acessarem pelo
 * IP deste computador vejam e editem os MESMOS dados.
 *
 * Como usar:
 *   1) Instale o Node.js (https://nodejs.org) neste computador.
 *   2) Nesta pasta, rode:  npm install
 *   3) Depois rode:        npm start
 *   4) Acesse de qualquer computador da rede interna:
 *        http://SEU_IP_INTERNO:3000
 *      (troque SEU_IP_INTERNO pelo IP deste computador na rede,
 *       ex: 192.168.0.25 — veja o README.md para descobrir o IP)
 */

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3003;
const DATA_FILE = path.join(__dirname, 'data.json');
const BACKUP_FILE = path.join(__dirname, 'data.backup.json');

app.use(express.json({ limit: '15mb' }));

/* ── Leitura / escrita do "banco de dados" (arquivo JSON) ── */
function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function writeData(data) {
  // Mantém uma cópia de segurança do estado anterior antes de sobrescrever
  try {
    if (fs.existsSync(DATA_FILE)) fs.copyFileSync(DATA_FILE, BACKUP_FILE);
  } catch (e) { /* segue mesmo se o backup falhar */ }

  const tmpFile = DATA_FILE + '.tmp';
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmpFile, DATA_FILE); // escrita "atômica"
}

/* ── API ── */

// Retorna todos os dados salvos (chamado quando o dashboard abre)
app.get('/api/state', (req, res) => {
  res.json(readData());
});

// Salva/atualiza uma chave específica (ex: ops_manpower, ops_cv, etc.)
app.post('/api/state', (req, res) => {
  const { key, value } = req.body || {};
  if (!key) return res.status(400).json({ error: 'campo "key" é obrigatório' });

  const data = readData();
  data[key] = value;

  try {
    writeData(data);
    res.json({ ok: true });
  } catch (e) {
    console.error('Erro ao salvar dados:', e);
    res.status(500).json({ error: 'falha ao gravar no servidor' });
  }
});

// Healthcheck simples
app.get('/api/ping', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

/* ── Arquivos estáticos (o dashboard em si) ── */
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('════════════════════════════════════════════════════');
  console.log('  OPS Dashboard — servidor rodando');
  console.log('  Local:        http://localhost:' + PORT);
  console.log('  Rede interna: http://SEU_IP_INTERNO:' + PORT);
  console.log('  (veja o README.md para descobrir o IP deste PC)');
  console.log('════════════════════════════════════════════════════');
  console.log('');
});
