const { Client } = require("discord.js");
const bot = new Client({ intents: ["GUILDS", "GUILD_MEMBERS"], partials: ["USER", "GUILD_MEMBER"] });
const config = require("./src/config.json");

bot.on("ready", () => {
  console.log(`[sDiscord]: Ready`);
});

function structureMember(m) {
  const { id, username, discriminator } = m.user;
  let roles = [];

  m.roles.cache.toJSON().forEach((role) => {
    if (role.name === "@everyone") return;
    roles.push(role.id);
  });

  return { id, username, discriminator, roles };
}

bot.on("guildMemberUpdate", (_, m) => {
  emit("sDiscord:guildMemberUpdate", structureMember(m));
});

exports("getUserRoles", async ({ user, guild }, cb) => {
  const guildId = guild ? guild : config.bot.guild;
  try {
    const guild = await bot.guilds.fetch(guildId);
    const guildMember = await guild.members.fetch(user);
    const roles = structureMember(guildMember).roles;

    cb(true, roles);
  } catch (err) {
    cb(false, err.message);
  }
});

exports("getUserData", async ({ user, guild }, cb) => {
  const guildId = guild ? guild : config.bot.guild;
  try {
    const guild = await bot.guilds.fetch(guildId);
    const guildMember = await guild.members.fetch(user);
    const structuredMember = structureMember(guildMember);

    cb(true, structuredMember);
  } catch (err) {
    cb(false, err.message);
  }
});

bot.login(config.bot.token);
