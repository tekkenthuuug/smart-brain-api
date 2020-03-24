const redisClient = require('./signin').redisClient;

const handleProfileGet = (db) => (req, res) => {
  const { id } = req.params;
  db.select('*')
    .from('users')
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('Not found');
      }
    })
    .catch((err) => res.status(400).json('error getting user'));
};

const handleProfileUpdate = (db) => (req, res) => {
  const { id } = req.params;
  const { name, age, pet } = req.body.formInput;
  db('users')
    .where({ id })
    .update({ name, age, pet })
    .returning('*')
    .then(([dbr]) => {
      if (dbr) {
        res.status(200).send(dbr);
      } else {
        res.status(400).json('Unable to update');
      }
    })
    .catch(() => {
      res.status(400).json('Error updating user');
    });
};

const handleSignOut = (req, res) => {
  const { authorization: token } = req.headers;
  redisClient.DEL(token);
  res.status(200);
};

module.exports = {
  handleProfileGet,
  handleProfileUpdate,
  handleSignOut
};
