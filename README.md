# Exchange rate backend

## Functionalities
This service is primarily designed to connect to [exchangeratesapi](http://api.exchangeratesapi.io) 
It also caches the exchange rate data for a duration that can be configured based on the external API subscription plan.

[Frontend Project](https://github.com/DSzuno/exchange-rate-frontend)

Below you can find the flow diagram of the backend decision graph:
![exchange-rates-backend-logic](https://github.com/DSzuno/exchange-rate-backend/assets/87638774/db88d658-0166-43e6-8c8e-2f3669326b61)



## Installation

The project requires [docker](https://www.docker.com/) to run locally, but it can be deployed in production with the container too. 

To create the container images, run `docker compose build` command

With default configuration the backend is reachable at [http://localhost:7500](http://localhost:7500)

## Environment variables

`DOCKER_TARGET` controls the docker build stage, it can be `development` or `production`, 
development will hot reload the application via `nodemon`

`NODE_ENV` helps to debug the application if it is set to `dev`

`PORT` the node application port, default value is `7500`

`REDIS_HOST` and `REDIS_PORT` together configures the node application connectivity string to connect to redis, 
if run via docker compose the host name is `cache` and the default port is `6379` 

`EXCHANGE_RATE_ACCESS_KEY` the access key used to communicate with the external API

`EXCHANGE_UPDATE_FREQUENCY` this `number` type value defines for application what is the expiration time on redis stored data

## Usage

The project can be executed with the following command: `docker compose up`
