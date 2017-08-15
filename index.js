const { 
  json,
  send
} = require('micro');
const url = require('url');
const level = require('level');
const promisify = require('then-levelup');

const db = promisify(level('./db/photos.db'), {
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

const _read = async ({name}) => {
  console.log('name', name);
  db.get(name)
  .then(res => {
    console.log('result', res);
    return res;
  })
  .catch(error => {
    console.error(error);
    return false;
  });
}

const _create = async ({name, title, base64}) => {
  db.put(name, {
    base64: base64,
    title: title
  })
  .then(res => {
    console.warn(`${name} saved.`)
    return true;
  })
  .catch(error => {
    console.error(error)
    return false
  });
}

const get = async (request, response) => {
  /*
    Requests should look like
    /photo/${id} which should parse to ["", "photo", "23"]
  */
  const path = url.parse(request.url).path;
  const parts = path.split('/');
  
  if(parts[1] && parts[1] === 'photo' && parts[2]) {
    console.log(`${parts[2]}`);
  } else {
    return {
      status: 404,
      body: ''
    }
  }

  const name = parts[2];
  const data = await _read({name});
  
  console.log(data);

  if(data) {
    return {
      status: 200,
      body: data
    }
  } else {
    return {
      status: 404
    }
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
  const data = await json(request);
  const keys = await _getKeys();
  
  let {
    name,
    base64,
    title
  } = data;

  name = _getUniqueKey(name, keys);

  const result = _create({
    name,
    title,
    base64
  });

  if(result) {
    return {
      status: 200,
      body: {
        status: 'success'
      }
    }
  } else {
    return {
      status: 500,
      body: {
        status: 'error'
      }
    }
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

