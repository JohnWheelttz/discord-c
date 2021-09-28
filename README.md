
# discord-c

[![MIT License](https://img.shields.io/npm/l/discord-c)]() [![Coverage](https://img.shields.io/badge/coverage-90%25-green)](https://opensource.org/licenses/) [![Version](https://img.shields.io/npm/v/discord-c?color=green&label=discord-c)]()

A simple package to create bots in discord


# Description

discord-c is a very simple bot creation API, if you want something very simple, like just responding to messages or commands, this API is for you


## Basic starts

```javascript
const { Bot } = require('discord-c');

const bot = new Bot();

bot.onmessage((ctx) => {
    ctx.channel.send(ctx.author.mention, 'Hi');
});

bot.command('ping', (ctx) => {
    ctx.channel.send('PONG!');
});

bot.start('token', () => {
    console.log('started');
});
```

# Commands

- ## Basic

    Default prefix is $

    ```javascript
    bot.command('ping', (ctx) => {
        ctx.channel.send('PONG!');
    });

    bot.command('hi', (ctx) => {
        ctx.channel.send('Hello .-.');
    });
    ```

- ## Module commands

    ```javascript
    const { Bot } = require('discord-c');

    const com = new Bot.Commands();

    com.command('ping', (ctx) => {
        ctx.channel.send('PONG!');
    });

    com.command('hi', (ctx) => {
        ctx.channel.send('Hello .-.');
    });

    module.exports = bot;
    ```
    In other file

    ```javascript
    const { Bot } = require('discord-c');
    const commands = require('./commands');

    const bot = new Bot();

    bot.commandsUse(commands);
    ````

# Reference
- Basic functions
  | Instance | Functions     | Description                |
  | :-------- | :------- | :------------------------- |
  | bot | onmessage | On message call your callback |
  | bot | comamnd | On commands call your callback |
  | bot | start | Starts bot |

- All ctx functions 
  | Parameter | Object     | Description                |
  | :-------- | :------- | :------------------------- |
  | ctx | channel **Function** | Send message in channel |
  | ctx | author.mention | Mention author of message |
  | ctx | author.mention | Mention author of message |
  | ctx | author.id | Id author of message |
  | ctx | author.avatar | Avatar author of message |


  

## Download

 - [NPM](https://www.npmjs.com/package/discord-c)
 - [Github](https://github.com/JohnWheelttz/discord-c)
