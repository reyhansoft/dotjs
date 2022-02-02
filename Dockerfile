FROM node:16-alpine3.15

WORKDIR /app

COPY package*.json /app

RUN yarn install --production=true
RUN yarn cache clean

COPY . /app

CMD node ./bin/www

EXPOSE 3000