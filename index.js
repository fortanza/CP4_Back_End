const express = require('express');
const { backPort } = require('./conf');
const usersRoutes = require('./routes/users');

const app = express();
app.use(express.json());

app.use('/users', usersRoutes);

// 404 Error
app.use('/', (req, res) => {
  const msg = `Page not found: ${req.method} ${req.url}`;
  console.log(`404 - ${msg}`);
  res.status(404).send(msg);
});

app.listen(backPort, () => {
  console.log(`Wild-Board now available on http://localhost:${backPort} !`);
});
