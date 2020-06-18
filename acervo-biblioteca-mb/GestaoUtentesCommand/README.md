# Gestão Utentes Command Service

This project contains the code for the command service of gestão utentes microservice. It is implemented in Javascript and is prepared to be interpreted by Node.JS.

## Requirements

- Node.js `v8.10.0` installed (Version that the service was developed, may work with other versions)

## Install dependencies

Execute the following command on project root:

```
npm install .
```

## Run

To run it is first needed to setup the following environment variables:

|Variable|Description|
|--------|-----------|
|`PORT`|Port which API will be available on|
|`RABBIT_MQ_CONNECTION_URL`|Connection String to connect to RabbitMQ server|
|`GUQ_MONGODB_CONNECTION_URL`|Connection String to connect to MongoDB database|

Then execute the following command:

```
npm start
```

## Test

Execute the following command on project root:

```
npm test
```