FROM node:20-slim

ARG DISCORD_TOKEN
ENV TOKEN=$DISCORD_TOKEN

ARG MONGO_TOKEN
ENV MONGODB $MONGO_TOKEN

ARG CLIENT_ID
ENV CLIENT $CLIENT_ID

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package*.json .
RUN npm install

COPY . .

CMD [ "node", "index.js" ]