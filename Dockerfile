#Each instruction in this file creates a new layer
#Here we are getting our node as Base image
FROM node:20-alpine3.17 AS base
LABEL authors="Daniel Szunomar"
#Creating a new directory for app files and setting path in the container
RUN mkdir -p /usr/src/app
#setting working directory in the container
WORKDIR /usr/src/app
#copying the package.json file(contains dependencies) from project source dir to container dir
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app
# installing the dependencies into the container
RUN npm install
#copying the source code of Application into the container dir
COPY ./src /usr/src/app/src
#container exposed network port number
EXPOSE 7500


FROM base AS development
CMD ["npm","run","dev"]

FROM base AS production
CMD ["npm","run","start"]
