FROM node:20-slim

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package*.json ./
RUN npm install

COPY ./ ./

CMD [ "node", "index.js" ]