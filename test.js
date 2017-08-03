const fs = require('fs');
const fetch = require('node-fetch');
const stringify = require('json-stringify');

const file = '/Users/ekonetzni/Desktop/Screen Shot 2017-08-02 at 2.47.15 PM.png'

const go = () => {
  const img = fs.readFileSync(file);
  const base64 = new Buffer(img).toString('base64');

  fetch('http://localhost:3000',{
    method: 'POST',
    body: {
      name: 'test',
      title: 'Test',
      bas64: base64
    }
  })
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.error(error);
  })
}

go();