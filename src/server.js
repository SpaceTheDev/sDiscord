const https = require('https');
const { DiscordWebSocket } = require('./src/ws');
const config = require('./src/config.json');

const discordWS = new DiscordWebSocket(config.bot.token, config.bot.guild);

discordWS.on('guildMemberUpdate', (data) => {
  emit('sDiscord:guildMemberUpdate', data);
});

function getMember(clientId, { guild }) {
  return new Promise((resolve, reject) => {
    https
      .request(
        {
          hostname: 'discord.com',
          port: 443,
          path: `/api/v6/guilds/${guild ? guild : config.bot.guild}/members/${clientId}`,
          method: 'GET',
          headers: {
            Authorization: `Bot ${config.bot.token}`,
            'Content-Type': 'application/json',
          },
        },
        (res) => {
          let chunks = [];
          res.on('data', (chunk) => {
            chunks.push(chunk);
          });

          res.on('end', () => {
            let data = JSON.parse(Buffer.concat(chunks).toString());
            resolve(data);
          });
        }
      )
      .on('error', (e) => {
        reject(e.message);
      })
      .end();
  });
}

exports('getUserRoles', ({ user, guild }, cb) => {
  getMember(user, { guild })
    .then((res) => {
      cb(true, res.roles);
    })
    .catch((err) => {
      cb(false, err.message);
    });
});

exports('getUserData', ({ user, guild }, cb) => {
  getMember(user, { guild })
    .then((res) => {
      cb(true, res);
    })
    .catch((err) => {
      cb(false, err.message);
    });
});
