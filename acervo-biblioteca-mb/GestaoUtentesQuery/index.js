const express = require('express');

const cors = require('cors');

const app = express();

const moongoose = require('mongoose');

app.use(cors());

app.listen(process.env.PORT);

moongoose.connect(process.env.GUQ_MONGODB_CONNECTION_URL, { useNewUrlParser: true });