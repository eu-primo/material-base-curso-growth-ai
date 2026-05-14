require('dotenv').config();
const { google } = require('googleapis');
const path = require('path');

const HEADERS = [
  '#',
  'Status',
  'Módulo',
  'Nº Aula',
  'Título Aula',
  'Duração Estimada',
  'O que vai aprender',
  'Conhecimento Prévio',
  'Materiais Extras',
  'Comentários',
];

async function main() {
  const keyFile = path.resolve(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Ler dados atuais
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'A1:J1',
  });

  const rows = res.data.values;

  if (!rows || rows.length === 0) {
    console.log('Planilha vazia. Escrevendo headers...');
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'A1:J1',
      valueInputOption: 'RAW',
      requestBody: { values: [HEADERS] },
    });
    console.log('Headers escritos com sucesso!');
  } else {
    console.log('Headers encontrados:', rows[0]);
  }

  console.log('\nConexao com Google Sheets OK!');
}

main().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
