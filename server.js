require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const verifyToken = require('./middleware/auth');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();

app.use(express.json());
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// database
let account = [
  {
    id: 1,
    username: 'admin',
    refreshToken: null,
  },
];

const customers = [
  {
    userId: 1,
    name: 'Henry',
    roles: 'CUSTOMER',
  },
  {
    userId: 2,
    name: 'Jim',
    roles: 'VIEW',
  },
  {
    userId: 3,
    name: 'Peter',
    roles: 'MANAGE',
  },
];

const generateTokens = (payload) => {
  const { id, username } = payload;

  // Create JWT
  const accessToken = jwt.sign(
    { id, username },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '2m',
    }
  );

  const refreshToken = jwt.sign(
    { id, username },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '1h',
    }
  );

  return { accessToken, refreshToken };
};

const updateRefreshToken = (username, refreshToken) => {
  account = account.map((user) => {
    if (user.username === username)
      return {
        ...user,
        refreshToken,
      };

    return user;
  });
};

app.get('/', (req, res) => {
  res.send(`<h1>Hello</h1>
  <a href="https://jwt-auth-1.herokuapp.com/api" target="_blank">Documentation</a>
  `);
});

app.post('/auth/login', (req, res) => {
  const username = req.body.username;
  const user = account.find((user) => user.username === username);

  if (!user) return res.sendStatus(401);

  const tokens = generateTokens(user);
  updateRefreshToken(username, tokens.refreshToken);

  res.json(tokens);
});

app.post('/auth/refresh-token', (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  const user = account.find((user) => user.refreshToken === refreshToken);
  if (!user) return res.sendStatus(403);

  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const tokens = generateTokens(user);
    updateRefreshToken(user.username, tokens.refreshToken);

    res.json(tokens);
  } catch (error) {
    console.log(error);
    res.sendStatus(403);
  }
});

app.delete('/auth/logout', verifyToken, (req, res) => {
  const user = account.find((user) => user.id === req.userId);
  updateRefreshToken(user.username, null);

  res.sendStatus(204);
});

// app
app.get('/customers', verifyToken, (req, res) => {
  res.json(customers.filter((post) => post.userId !== req.userId));
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
