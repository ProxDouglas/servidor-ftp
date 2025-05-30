require('dotenv').config();
const path = require('path');
const FtpSrv = require('ftp-srv');
const express = require('express');

// Caminho para a pasta FTP
const rootPath = path.resolve(__dirname, 'src/files');

// Configurações do FTP
const ftpServer = new FtpSrv({
  url: 'ftp://0.0.0.0:' + process.env.PORT_FTP,
  anonymous: false
});

const USERNAME = 'admin';
const PASSWORD = '1234';

ftpServer.on('login', ({ username, password }, resolve, reject) => {
  if (username === USERNAME && password === PASSWORD) {
    console.log(`FTP: Usuário '${username}' conectado.`);
    resolve({ root: rootPath });
  } else {
    reject(new Error('Usuário ou senha inválidos.'));
  }
});

// Inicia o FTP
ftpServer.listen().then(() => {
  console.log(`Servidor FTP escutando em ftp://localhost:` + process.env.PORT_FTP);
});

// Express App
const app = express();

// Rota de health check
app.get('/health', (req, res) => {
  res.send('OK');
});

// Inicia o servidor HTTP (porta 3000)
app.listen(Number(process.env.PORT), () => {
  console.log('Servidor HTTP rodando em http://localhost:' + process.env.PORT);
});
