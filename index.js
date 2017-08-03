const { 
  json,
  send
} = require('micro');
const url = require('url');
const level = require('level');
const promisify = require('then-levelup');

const db = promisify(level('./photos.db'), {
  valueEncoding: 'json'
}); 

const _getKeys = () => {
  return new Promise(resolve => {
    let keys = [];

    db.createKeyStream()
      .on('data', data => {
        keys.push(data);
      })
      .on('end', () => {
        resolve(keys);
      })
  });
}

const _getUniqueKey = (test, keys) => {
  return keys.includes(test) ? _getUniqueKey(`${test}-`, keys) : test;
}

const get = async (request, response) => {
  let status = 200;
  let body = null;
  /*
    Requests should look like
    /photo/${id} which should parse to ["", "photo", "23"]
  */
  const path = url.parse(request.url).path;
  const parts = path.split('/');

  if(parts[1] && parts[1] === 'photo' && parts[2]) {
    console.log(`Requesting ${parts[2]}`);
  }

  return {
    status: 200,
    body: 'get'
  }
}

const post = async (request, response) => {
  /**
    Requests should look like:
      {
        cert: sha1,
        name: 'the image name',
        base64: 'encoded image data',
        title: 'A separate title for the work'
      }
  **/
  const data = json(request);
  const keys = await _getKeys();
  let {
    name,
    base64,
    title
  } = data;
  
  console.log(data);
  
  name = _getUniqueKey(name, keys);

  console.log(name, title);

  db.put(name, {
    base64: base64,
    title: title
  })
  .then(res => console.warn(`${name} saved.`))
  .catch(error => {
    console.error(error);
  });

  return {
    status: 200,
    body: `post`
  }
}

module.exports = async function(request, response) {
  const handler = request.method === 'GET' ? get : post;
  const { 
    status,
    body
  } = await handler(request, response);

  send(response, status, body);
}

