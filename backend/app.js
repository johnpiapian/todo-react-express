const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoute = require('./routes/authRoute');
const todoRoute = require('./routes/todoRoute');
const { checkAuth } = require('./Config/auth');

app.use(cors());

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Endpoints
app.use('/auth', authRoute);
app.use('/todo', checkAuth, todoRoute);

app.listen(port, () => console.log(`Example app listening on port ${port}`));