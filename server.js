require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const verifyToken = require('./middleware/auth');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
import { v4 as uuidv4 } from 'uuid';
const app = express();

app.use(express.json());
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// database
let account = [
  {
    username: 'admin',
    refreshToken: null,
  },
];

const customers = [
  {
    userId: uuidv4(),
    name: 'Henry',
    roles: 'CUSTOMER',
  },
  {
    userId: uuidv4(),
    name: 'Jim',
    roles: 'VIEW',
  },
  {
    userId: uuidv4(),
    name: 'Peter 1',
    roles: 'MANAGE',
  },
  {
    userId: uuidv4(),
    name: 'Peter 2',
    roles: 'MANAGE',
  },
  {
    userId: uuidv4(),
    name: 'Peter 3',
    roles: 'MANAGE',
  },
  {
    userId: uuidv4(),
    name: 'Peter 4',
    roles: 'MANAGE',
  },
  {
    userId: uuidv4(),
    name: 'Peter 5',
    roles: 'MANAGE',
  },
  {
    userId: uuidv4(),
    name: 'Peter 6',
    roles: 'MANAGE',
  },
  {
    userId: uuidv4(),
    name: 'Peter 7',
    roles: 'MANAGE',
  },
  {
    userId: uuidv4(),
    name: 'Peter 8',
    roles: 'MANAGE',
  },
  {
    userId: uuidv4(),
    name: 'Peter 9',
    roles: 'MANAGE',
  },
  {
    userId: uuidv4(),
    name: 'Peter 10',
    roles: 'MANAGE',
  },
  {
    userId: uuidv4(),
    name: 'Peter 11',
    roles: 'MANAGE',
  },
];

const galleries = [
  {
    id: uuidv4(),
    imageUrl: 'https://source.unsplash.com/collection/1758353/800x350/?sig=1',
  },
  {
    id: uuidv4(),
    imageUrl: 'https://source.unsplash.com/collection/1758353/800x350/?sig=2',
  },
  {
    id: uuidv4(),
    imageUrl: 'https://source.unsplash.com/collection/1758353/800x350/?sig=3',
  },
  {
    id: uuidv4(),
    imageUrl: 'https://source.unsplash.com/collection/1758353/800x350/?sig=4',
  },
  {
    id: uuidv4(),
    imageUrl: 'https://source.unsplash.com/collection/1758353/800x350/?sig=5',
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
  res.send(`<h1>Welcome to Agiletech Company Test</h1>
  <a href="https://jwt-auth-1.herokuapp.com/api" target="_blank">Swagger API</a>
  <code>
    <h4>POST: /auth/login: Đăng nhập có accessToken, refreshToken (accessToken hết hạn sau 2 phút, refreshToken hết hạn sau 1 giờ)</h4>
    <h4>POST: /auth/refreshToken: Refresh token khi accessToken hết hạn</h4>
    <h4>POST: /auth/logout: Xoá access token</h4>
    <br />
    <h4>GET: /galleries: Lấy ảnh từ galleries</h4>
    <br />
    <h4>GET: /customers: Lấy danh sách customers</h4>
    <h4>GET: /customers?name=: Lấy danh sách customers theo name</h4>
    <h4>POST: /customers: Tạo một customers</h4>
    <h4>PUT: /customers: Sửa thông tin customer</h4>
    <h4>DELETE: /customers: Xoá customer</h4>
  </code>

  <h1>Yêu cầu</h1>

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

app.get('/galleries', (req, res) => {
  res.json(galleries);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
