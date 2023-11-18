# Apa-Aja.bot

[![Docker build and push](https://github.com/RazorHex/Apa-Aja.bot_v3/actions/workflows/docker.yaml/badge.svg?branch=main&event=push)](https://github.com/RazorHex/Apa-Aja.bot_v3/actions/workflows/docker.yaml)

> Version 3.0.0

[Apa-Aja.bot Version 2](https://github.com/RazorHex/Apa-Aja.bot_V2)

Discord bot to help admin of discord server handle role by letting member join using dropdown.

The goal for this project is to help admin control their server.

## Progress

- Adding role functionality.

## Docs

> - [Discord.js](https://discord.js.org/)
> - [Node.js](https://nodejs.org/en)
> - [Mongoose](https://mongoosejs.com/docs/index.html)

## Docker

You can use docker to run this bot for local use.

URL = `ahda043/apa-aja.bot@latest`

**Required environment variable**

```yaml
MONGODB: mongo_uri
TOKEN: discord_bot_application_token
CLIENT: discord_bot_application_client_token
```
