const { Client } = require('discord.js')
const bot = new Client()
const config = require('./src/config.json');

bot.on('ready', () => {
  console.log(`[sDiscord]: Ready`)
})

function structureMember(m) {
  const { id, username, discriminator } = m.user
  let roles = []

  m.roles.map(role => {
    if (role.guild == config.bot.guild) {
      roles.push(role.id)
    }
  })

  return { id, username, discriminator, roles }
}

bot.on('guildMemberUpdate', (m) => {
  emit('sDiscord:guildMemberUpdate', structureMember(m))
})

exports('getUserRoles', ({ user, guild }, cb) => {
  const guildId = guild ? guild : config.bot.guild
  try {
    const roles = structureMember(bot.guilds.get(guildId).members.get(user)).roles
    cb(true, roles)
  } catch (err) {
    cb(false, err.message)
  }
});

exports('getUserData', ({ user, guild }, cb) => {
  const guildId = guild ? guild : config.bot.guild
  try {
    const guildMember = structureMember(bot.guilds.get(guildId).members.get(user))
    cb(true, guildMember)
  } catch (err) {
    cb(false, err.message)
  }
});

bot.login(config.bot.token)