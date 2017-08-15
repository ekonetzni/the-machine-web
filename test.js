const fs = require('fs');
const fetch = require('node-fetch');
const stringify = require('json-stringify');

const file = '/Users/ekonetzni/Desktop/1-IS.jpg';

const go = () => {
  const img = fs.readFileSync(file);
  const base64 = new Buffer(img).toString('base64');

  console.log(base64);
  
  fetch('http://localhost:3000',{
    method: 'POST',
    body: stringify({
      name: 'test',
      title: 'Test',
      bas64: base64
    })
  })
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.error(error);
  })
}

go();