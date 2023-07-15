const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoute = require('./Routes/authRoute');
const todoRoute = require('./Routes/todoRoute');
const { checkAuth } = require('./Config/auth');
const port = 3000;

app.use(cors());

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Endpoints
app.use('/auth', authRoute);
app.use('/todo', checkAuth, todoRoute);

app.listen(port, () => console.log(`Todo app back-end listening on port ${port}`));