#!/bin/bash

export PORT=3000

export RABBIT_MQ_CONNECTION_URL='amqp://guest:guest@insis-rabbitmq.northeurope.cloudapp.azure.com'

export GEC_MONGODB_CONNECTION_URL='mongodb+srv://insisinsis:insisinsis@cluster0-6y7rq.mongodb.net/ge-command-event-store?retryWrites=true&w=majority'

export EMPRESTIMO_EXCHANGE=emprestimo

export ESB_HOST=http://localhost:8280

export GE_QUERY_HOST=http://localhost:3001