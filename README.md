# sDiscord

A discord helper resource used to get discord member information in game. I wanted to avoid using Discord.js, but dealing with discord's gateway is a pain in the ass, so here we are.

---

## Installation

- Clone or download resource into your `resources` folder
- Install dependencies using `npm i`
- Add your bot token and guild id to the config.json
- Add `sDiscord` to your server.cfg

## Exports

### getUserRoles

The getUserData export takes a discord id, user, and a guild id, guild. The guild id is optional. It returns two values, completed and the data. Completed with either be true or false and data with either be the a error message or the user's roles.

#### Example Usage (getUserRoles)

```lua
exports['sDiscord']:getUserRoles({ user = 'users discord id', guild = 'the guild id'  }, function(completed, data)
  if completed then
    -- prints the first role in the array
    print(data[1])
  else
    -- prints the error message
    print(data)
  end
end)
```

### getUserData

getUserData takes a discord id, user, and a guild id, guild. The guild id is optional. It returns two values, completed and the data. Completed with either be true or false and data with either be the a error message or the user's user object.

#### Example Usage (getUserData)

```lua
exports['sDiscord']:getUserData({ user = 'users discord id' }, function(completed, data)
  if completed then
    -- prints the users username
    print(data.user.username)
  else
    -- prints the error message
    print(data)
  end
end)
```

## Events

### sDiscord:guildMemberUpdate

The event sDiscord:guildMemberUpdate will fire whenever a guild member is updated and it will return a user object. Note: This only triggers when a guild member in the guild you provided in the config is updated.

#### Example Usage (sDiscord:guildMemberUpdate)

```lua
RegisterNetEvent('sDiscord:guildMemberUpdate')

AddEventHandler('sDiscord:guildMemberUpdate', function(data)
  print(data.user.username)
end)
```
