const jwt = require('jsonwebtoken');
const redisClient = require('./signin').redisClient;

const registerUser = (db, bcrypt, req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    Promise.reject('incorrect form submission');
  }

  const hash = bcrypt.hashSync(password);

  return db
    .transaction((trx) => {
      trx
        .insert({
          hash: hash,
          email: email
        })
        .into('login')
        .returning('email')
        .then((loginEmail) => {
          return trx('users')
            .returning('*')
            .insert({
              email: loginEmail[0],
              name: name,
              joined: new Date()
            })
            .then((user) => {
              return user[0];
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch((err) => {
      Promise.reject('unable to register');
    });
};

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, 'JWT_Secret', { expiresIn: '2 days' });
};

const setToken = (key, val) => {
  return Promise.resolve(redisClient.set(key, val));
};

const createSessions = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => ({ success: true, userId: id, token }))
    .catch(console.log);
};

const handleRegister = (db, bcrypt) => (req, res) => {
  registerUser(db, bcrypt, req, res)
    .then((data) => {
      if (!data) return;
      return createSessions(data);
    })
    .then((session) => {
      res.status(200).json(session);
    })
    .catch((err) => {
      console.log(err);
      res.send(400).json('Unable to register');
    });
};

module.exports = {
  handleRegister
};
