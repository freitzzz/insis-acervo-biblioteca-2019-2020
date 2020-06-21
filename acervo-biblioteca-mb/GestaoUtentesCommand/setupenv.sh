#!/bin/bash

export PORT=4000

export RABBIT_MQ_CONNECTION_URL='amqp://guest:guest@insis-rabbitmq.northeurope.cloudapp.azure.com'

export GUC_MONGODB_CONNECTION_URL='mongodb+srv://insisinsis:insisinsis@cluster0-6y7rq.mongodb.net/gu-command-event-store?retryWrites=true&w=majority'

export REPOR_ESTADO_EXCHANGE=repor_estado
