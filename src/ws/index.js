const Events = require('events');
const config = require('../config.json');
const WebSocket = require('ws');

class DiscordWebSocket extends Events.EventEmitter {
  constructor(token, guild) {
    super();
    this._internal = {
      bot: {
        token,
        guild,
      },
      client: {},
    };
    // should use the /gateway endpoint to get this, but /shrug
    this._ws = new WebSocket('wss://gateway.discord.gg/?v=6&encoding=json');

    // handle the ws message events
    this._ws.on('message', (e) => this._messageHandler(e));
    this._ws.on('close', console.log)
  }

  // identify to the gateway or resume the connection
  _identify() {
    let payload;

    if (this._internal.client.s && this._internal.bot.token && this._internal.client.session_id) {
      payload = {
        op: 6,
        d: {
          token: this._internal.bot.token,
          session_id: this._internal.client.session_id,
          seq: this._internal.client.s,
        },
      };
    } else {
      payload = {
        op: 2,
        d: {
          token: this._internal.bot.token,
          properties: {
            $os: require('os').platform(),
            $browser: 'sDiscord',
            $device: 'sDiscord',
          },
        },
      };
    }
    this._ws.send(JSON.stringify(payload));
  }

  _messageHandler(e) {
    const data = JSON.parse(e);
    switch (data.op) {
      case 0:
        this._internal.client.s = data.s;
        break;
      case 1:
        this._ws.send(JSON.stringify({ op: 1, d: this._internal.client.s }));
        break;
      case 7:
        clearTimeout(this._identify.client.keepAlive);
        this._ws.close(1000, 'Reconnect requested');
        break;
      case 9:
        if (data.d) {
          delete this._internal.client.s;
          delete this._internal.client.session_id;
          // identify after 1-5 seconds
          setTimeout(() => {
            this._identify();
          }, Math.random() * 4000 + 1000);
        } else {
          this._identify();
        }
        break;
      case 10:
        this._identify();

        this._internal.client.keepAlive = setInterval(() => {
          this._ws.send(JSON.stringify({ op: 1, d: this._internal.client.s }));
        }, data.d.heartbeat_interval);
        break;
      case 11:
        clearTimeout(this._internal.client.keepAlive);
        break;
    }

    switch (data.t) {
      case 'READY':
        this._internal.client.session_id = data.d.session_id
        break;
      case 'GUILD_MEMBER_UPDATE':
        if (data.d.guild_id == config.bot.guild) {
          this.emit('guildMemberUpdate', data.d);
        }
        break;
    }
  }
}

module.exports = { DiscordWebSocket };
