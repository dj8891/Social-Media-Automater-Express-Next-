const fs = require('fs');
const https = require('https');
const { createServer } = require('next');
const { parse } = require('url');

const dev = process.env.NODE_ENV !== 'production';
const app = createServer({ dev });

const options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
};

app.prepare().then(() => {
  https.createServer(options, (req, res) => {
    const parsedUrl = parse(req.url, true);
    app.getRequestHandler()(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on https://localhost:3000');
  });
});
