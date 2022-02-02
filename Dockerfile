FROM node:latest

WORKDIR /app

COPY package*.json /app

RUN yarn install
RUN yarn cache clean

COPY . /app

CMD node app.js

EXPOSE 3000