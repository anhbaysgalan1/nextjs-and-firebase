const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const next = require('next');
const admin = require('firebase-admin');

const serverCredentials = require('./credentials/server');
const twilioInterface = require('./server/twilio');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const firebase = admin.initializeApp(
  {
    credential: admin.credential.cert(serverCredentials),
    databaseURL: 'https://nextplusfirebase.firebaseio.com',
  },
  'server'
);

twilioInterface.initialize({ firebase });

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json());
  server.use(
    session({
      secret: 'next-firebase-demo',
      saveUninitialized: true,
      store: new FileStore({ path: './tmp/sessions', secret: 'next-firebase-demo' }),
      resave: false,
      rolling: true,
      httpOnly: true,
      cookie: { maxAge: 604800000 }, // week
    })
  );

  server.use((req, res, nextAction) => {
    req.firebaseServer = firebase;
    nextAction();
  });

  server.post('/api/login', (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const token = req.body.token;
    return firebase
      .auth()
      .verifyIdToken(token)
      .then((decodedToken) => {
        req.session.decodedToken = decodedToken;
        return decodedToken;
      })
      .then(decodedToken => res.json({ status: true, decodedToken }))
      .catch(error => res.json({ error }));
  });

  server.post('/api/logout', (req, res) => {
    req.session.decodedToken = null;
    res.json({ status: true });
  });

  server.get('*', (req, res) => handle(req, res));

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
