const options = {
};

const pgp = require('pg-promise')(options);
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/machine';
const db = pgp(connectionString);

const getAllImages = (req, res, next) => {
	db.any('SELECT * FROM images')
    .then(images => {
      res.status(200)
        .json({
          status: 'success',
          data: images
        });
    })
    .catch(err => {
      return next(err);
    });
};

const getSingleImage = id => {
  db.one('SELECT * FROM images WHERE id = 1', [id])
    .then(image => {
      res.status(200)
        .json({
          status: 'success',
          data: image
        });
    })
    .catch(err => {
      return next(err);
    });
};

const createImage = (req, res, next) => {
  if (!req.body) return res.sendStatus(400);
  const name = req.body.name;
  const data = req.body.data;
  db.none('INSERT INTO images (name, data) VALUES ($1, $2)', [name, data])
    .then(image => {
      res.status(200)
        .json({
          status: 'success',
          image
        });
    })
    .catch(err => {
      return next(err);
    });
};

module.exports = {
  getAllImages: getAllImages,
  getSingleImage: getSingleImage,
  createImage: createImage
};