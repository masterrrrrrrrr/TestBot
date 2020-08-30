const Discord = require('discord.js');
const { color } = require('../config.json');
const errors = require('../util/errors.js');

module.exports.run = async (bot, message, args) => {
    if (message.author.id !== '317074864538386443') return errors.noPerms(message, 'ID: 317074864538386443');

    let members = bot.users.cache.map(user => user.username)

    let embed = new Discord.MessageEmbed()
        .setTitle('Members')
        .setColor(color)
        .setDescription(members)
        .setFooter(`${bot.user.username} is watching ${bot.users.cache.size} members!`)

    message.channel.send(embed)
}


module.exports.config = {
    name: 'test',
    aliases: [],
    usage: 'test',
    description: 'Test command!',
}