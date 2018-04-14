const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000;

const db = require('./db');
const helmet = require('helmet');

const our_secret = process.env.MACHINE_SECRET;

const checkToken = (req, res, next) => {
  const req_secret = req.headers['x-machine-auth'];
  (req_secret && req_secret === our_secret) ? next() : res.sendStatus(403); 
}

express()
  //.use(express.static(path.join(__dirname, 'public')))
  //.set('views', path.join(__dirname, 'views'))
  //.set('view engine', 'ejs')
  .use(helmet())
  .use(bodyParser.json({ type: '*/*' }))
  .all('*', checkToken)
  .get('/images', db.getAllImages)
  .get('/images/:id', db.getSingleImage)
  .post('/image', db.createImage)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
