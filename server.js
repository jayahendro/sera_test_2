const express = require('express');
const app = express();
const PORT = 3000;

const usersRouter = require('./routes/users.router');

app.use(express.json());

app.use('/users', usersRouter);


app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});

module.exports = app;