exports.run = async (client, msg, args) => {
  if(!args || args.size < 1) return msg.edit(`Must provide a command to reload. Derp.`).then(setTimeout(msg.delete.bind(msg), 1000));

  let command;
  if (client.commands.has(args[0])) {
    command = client.commands.get(args[0]);
  } else if (client.aliases.has(args[0])) {
    command = client.commands.get(client.aliases.get(args[0]));
  }
  if(!command) return msg.edit(`The command \`${args[0]}\` doesn't seem to exist, nor is it an alias. Try again!`).then(setTimeout(msg.delete.bind(msg), 1000));
  command = command.help.name;

  // Forward slash (/) is also supported on Windows and required on some machines.
  // Source: https://nodejs.org/api/path.html#path_path_sep
  delete require.cache[require.resolve(`./${command}.js`)];
  let cmd = require(`./${command}`);
  client.commands.delete(command);
  client.aliases.forEach((cmd, alias) => {
    if (cmd === command) client.aliases.delete(alias);
  });
  client.commands.set(command, cmd);
  cmd.conf.aliases.forEach(alias => {
    client.aliases.set(alias, cmd.help.name);
  });

  msg.edit(`The command \`${command}\` has been reloaded`).then(setTimeout(msg.delete.bind(msg), 1000));
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'reload',
  description: 'Reloads a command that\'s been modified.',
  usage: 'reload [command]'
};