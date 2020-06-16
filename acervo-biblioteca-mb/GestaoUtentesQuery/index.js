const express = require('express');

const cors = require('cors');

const moongoose = require('mongoose');

const amqp = require('amqplib/callback_api');

const app = express();

app.use(cors());

app.listen(process.env.PORT);

amqp.connect(process.env.RABBIT_MQ_CONNECTION_URL, function (error0, connection) { });

moongoose.connect(process.env.GUQ_MONGODB_CONNECTION_URL, { useNewUrlParser: true });