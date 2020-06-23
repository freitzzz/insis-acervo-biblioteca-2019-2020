# Gestão Autorizações Command Service

This project contains the code for the command service of gestão autorizações microservice. It is implemented in Javascript and is prepared to be interpreted by Node.JS.

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
|`RABBIT_MQ_CONNECTION_URL`|Connection String to connect to RabbitMQ server|
|`REPOR_ESTADO_EXCHANGE`|Exchange identifier for repor estado use case. Defaults to `repor_estado`|
|`EMPRESTIMO_EXCHANGE`|Exchange identifier for emprestimo use case. Defaults to `emprestimo`|
|`RESERVA_EXCHANGE`|Exchange identifier for reserva use case. Defaults to `reserva`|
|`GU_QUERY_HOST`|Host name of Gestao Utentes Query service|

Then execute the following command:

```
npm start
```

## Test

Execute the following command on project root:

```
npm test
```