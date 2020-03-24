const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// Middleware
const morgan = require('morgan');
const cors = require('cors');
const auth = require('./middleware/authorization');

const db = knex({
  client: 'pg',
  connection: process.env.POSTGRES_URI
});

const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());

app.post('/signin', signin.signinAuthentication(db, bcrypt));

app.post('/register', register.handleRegister(db, bcrypt));

app.get('/profile/:id', auth.requireAuth, profile.handleProfileGet(db));

app.post('/profile/:id', auth.requireAuth, profile.handleProfileUpdate(db));

app.delete('/signout', auth.requireAuth, profile.handleSignOut);

app.put('/image', auth.requireAuth, image.handleImage(db));

app.post('/imageurl', auth.requireAuth, image.handleApiCall);

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
