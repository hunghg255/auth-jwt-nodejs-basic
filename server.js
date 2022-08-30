require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const verifyToken = require('./middleware/auth');

const app = express();

app.use(express.json());

// database
let users = [
  {
    id: 1,
    username: 'henry',
    refreshToken: null,
  },
  {
    id: 2,
    username: 'jim',
    refreshToken: null,
  },
];

const posts = [
  {
    userId: 1,
    post: 'post henry',
  },
  {
    userId: 2,
    post: 'post jim',
  },
  {
    userId: 1,
    post: 'post henry 2',
  },
];

const generateTokens = (payload) => {
  const { id, username } = payload;

  // Create JWT
  const accessToken = jwt.sign(
    { id, username },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '1m',
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
  users = users.map((user) => {
    if (user.username === username)
      return {
        ...user,
        refreshToken,
      };

    return user;
  });
};

app.get('/', (req, res) => {
  res.send(`
  <h1>/login</h1>
  <h1>/refresh-token</h1>
  <h1>/logout</h1>
  `);
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const user = users.find((user) => user.username === username);

  if (!user) return res.sendStatus(401);

  const tokens = generateTokens(user);
  updateRefreshToken(username, tokens.refreshToken);

  res.json(tokens);
});

app.post('/refresh-token', (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  const user = users.find((user) => user.refreshToken === refreshToken);
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

app.delete('/logout', verifyToken, (req, res) => {
  const user = users.find((user) => user.id === req.userId);
  updateRefreshToken(user.username, null);

  res.sendStatus(204);
});

// app
app.get('/posts', verifyToken, (req, res) => {
  res.json(posts.filter((post) => post.userId === req.userId));
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
