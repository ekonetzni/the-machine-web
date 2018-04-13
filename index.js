const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000;

const db = require('./db');

express()
  //.use(express.static(path.join(__dirname, 'public')))
  //.set('views', path.join(__dirname, 'views'))
  //.set('view engine', 'ejs')
  .use(bodyParser.json({ type: '*/*' }))
  .get('/images', db.getAllImages)
  .get('/images/:id', db.getSingleImage)
  .post('/image', db.createImage)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
