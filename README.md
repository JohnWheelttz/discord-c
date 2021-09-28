
# discord-c

[![MIT License](https://img.shields.io/npm/l/discord-c)]() [![Coverage](https://img.shields.io/badge/coverage-90%25-green)](https://opensource.org/licenses/) [![Version](https://img.shields.io/npm/v/discord-c?color=green&label=discord-c)]()

A simple package to create bots in discord


## Description

discord-c is a very simple bot creation API, if you want something very simple, like just responding to messages or commands, this API is for you


  
### Example

```javascript
  const { Bot } = require('discord-c');

  bot.onmessage((ctx) => {
      ctx.channel.send(ctx.author.mention, 'hi');
  });

  bot.start('token', () => {
      console.log('started');
  });
```


  
## Download

 - [NPM](https://www.npmjs.com/package/discord-c)
 - [Github](https://github.com/JohnWheelttz/discord-c)

  