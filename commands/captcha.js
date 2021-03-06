const Discord = require('discord.js');
const Canvas = require('canvas');

function createCaptcha(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

module.exports.run = async (bot, message, args) => {

    message.delete()
    const a = await message.channel.send('Loading...')

    const verificationSuccessful = async () => {
        //What to do if they are an actual human
        /*
        Example: 
        let role = message.guild.roles.cache.find(r => r.name === 'Verified');
        message.member.roles.add(role)
        */
    };

    let captchaLength = 8
    let captcha = createCaptcha(captchaLength)

    const canvas = Canvas.createCanvas(500, 200);
    const ctx = canvas.getContext("2d")

    const background = await Canvas.loadImage('https://wallpapercave.com/wp/wp3597523.jpg')
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#FFFFFF'
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    var size = 50
    var size1 = 30

    var code = captcha
    do {
        ctx.font = `${size -= 5}px sans-serif`
    } while (ctx.measureText(code).width > canvas.width - 225);
    ctx.fillText(code, 160, 115)

    var howTo = 'Please type this to verify you are human!'
    do {
        ctx.font = `${size1 -= 5}px sans-serif`
    } while (ctx.measureText(howTo).width > canvas.width - 225);
    ctx.fillText(howTo, 135, 195)

    const final = new Discord.MessageAttachment(canvas.toBuffer(), "captcha.png");
    const filter = m => m.author.id === message.author.id;

    await a.edit(`Verifying...`);
    const msg = await message.member.send(final)

    msg.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
        if (collected.first().content === captcha) {
            msg.channel.send(`Successfully Verified!`)
            a.edit('Successfully Verified!').then(a => a.delete({ timeout: 5000 }))
            verificationSuccessful()
        } else {
            msg.channel.send(`Incorrect code. Try again later!`)
            a.edit('Failed to verify.').then(a => a.delete({ timeout: 5000 }))
        }
    }).catch(() => {
        msg.channel.send(`Did not send anything within 30 seconds. Out of time.`)
        a.edit(`Did not respond within the 30 second time limit!`).then(a => a.delete({ timeout: 5000 }))
    })
};


module.exports.config = {
    name: 'captcha',
    aliases: ['verify'],
    usage: 'captcha',
    description: 'Verify that you are human!'
}