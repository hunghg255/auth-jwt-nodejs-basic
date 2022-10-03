require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const verifyToken = require('./middleware/auth');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const galleries = require('./model/galleries');
let account = require('./model/users');
const postDummy = require('./model/posts');
const { faker } = require('@faker-js/faker');
const tags = require('./model/tags');
const cors = require('cors');
const path = require('path');

const app = express();

const options = {
  customCssUrl: 'https://agiletechvn.vercel.app/swagger-ui.css',
};

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

const generateTokens = (payload) => {
  const { id, username } = payload;

  // Create JWT
  const accessToken = jwt.sign(
    { id, username },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: username?.includes('Refresh') ? '1m' : '1d',
    }
  );

  const refreshToken = jwt.sign(
    { id, username },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '30d',
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
  res.send(`<h1>Welcome to Agiletech Test</h1>
  <a href="https://agiletechvn.vercel.app/api" target="_blank">Link Swagger</a>
  <code style="font-size:16px">
    <h4>POST: /auth/login: Đăng nhập có accessToken, refreshToken (accessToken hết hạn sau 2 phút, refreshToken hết hạn sau 1 giờ)</h4>
    <h4>POST: /auth/refreshToken: Refresh token khi accessToken hết hạn</h4>
    <h4>POST: /auth/logout: Xoá access token</h4>
    <br />
    <h4>GET: /posts: Lấy danh sách posts</h4>
    <h4>GET: /posts?title=&page=: Lấy danh sách posts theo title hoặc phân trang</h4>
    <h4>POST: /posts: Tạo một posts</h4>
    <h4>PATCH: /posts/{postId}: Sửa thông tin post</h4>
    <h4>DELETE: /posts/{postId}: Xoá post</h4>
    <h4>GET: /tags: Lấy danh sách tags của post</h4>
    <br />
    <h4>GET: /galleries: Lấy ảnh từ galleries</h4>
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
  const user = account.find((user) => user.username === req.username);
  updateRefreshToken(user.username, null);

  res.sendStatus(204);
});

app.get('/posts', verifyToken, (req, res) => {
  let data = postDummy[req.username];

  const queryPage = +req.query?.page || 1;
  const page = queryPage <= 1 ? 1 : queryPage;

  if (req.query?.title || req.query?.tags) {
    const postFilter =
      postDummy[req.username]?.posts?.filter((item) => {
        if (req.query?.title && req.query?.tags) {
          return (
            item?.title?.startsWith(req.query?.title) &&
            item?.tags?.includes(req.query?.tags)
          );
        }

        return (
          item?.title?.startsWith(req.query?.title) ||
          item?.tags?.includes(req.query?.tags)
        );
      }) || [];

    data = {
      ...data,
      posts: postFilter.slice((page - 1) * 10, data.page_size * page),
      current_page: page,
      total_page: Math.ceil(postFilter?.length / 10),
    };
  } else {
    data = {
      ...data,
      posts: data.posts.slice((page - 1) * 10, data.page_size * page),
      current_page: page,
    };
  }

  res.json(data);
});

app.post('/posts', verifyToken, (req, res) => {
  const body = { id: faker.datatype.uuid(), ...req.body };
  postDummy[req.username].posts.unshift(body);

  postDummy[req.username] = {
    ...postDummy[req.username],
    current_page: 1,
    total_page: Math.ceil(postDummy[req.username].posts.length / 10),
  };

  res.json(body);
});

app.patch('/posts/:postId', verifyToken, (req, res) => {
  const body = req.body;

  postDummy[req.username].posts = postDummy[req.username].posts.map((item) => {
    let newItem = { ...item };
    if (newItem.id === req.params.postId) {
      newItem = {
        ...newItem,
        ...body,
      };
    }

    return newItem;
  });

  res.json(body);
});

app.delete('/posts/:postId', verifyToken, (req, res) => {
  postDummy[req.username].posts = postDummy[req.username].posts.filter(
    (item) => item.id !== req.params.postId
  );

  postDummy[req.username] = {
    ...postDummy[req.username],
    current_page: 1,
    total_page: Math.ceil(postDummy[req.username].posts.length / 10),
  };

  res.json(req.body.postId);
});

app.get('/tags', verifyToken, (req, res) => {
  res.json(tags);
});

app.get('/galleries', (req, res) => {
  res.json(galleries);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
