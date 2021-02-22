const { Client, Collection , MessageEmbed , MessageAttachment} = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
const { TOKEN , PREFIX } = require("./util/OVDUtil");
const Discord = require('discord.js');
const Canvas = require('canvas');
const client = new Client();
const discordEmoji = require('discord-emoji')
client.login(TOKEN);
client.commands = new Collection();
client.prefix = PREFIX;

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const guildInvites = new Map();

const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on('inviteCreate', async invite => guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()));

client.once('ready', () => {
    client.user.setActivity(`${PREFIX}help and ${PREFIX}play`, { type: "LISTENING" });
    console.log(`${client.user.tag} has logged in.`);
    client.guilds.cache.forEach(guild => {
        guild.fetchInvites()
            .then(invites => guildInvites.set(guild.id, invites))
            .catch(err => console.log(err));
    });
});


client.on("message", async (message) => {

    
    // if (message.content == "%join") {
	// 	client.emit('guildMemberAdd', message.member);
	// }

    // if (message.author.bot) return;
    // if (!message.guild) return;
    // const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
    // if (!prefixRegex.test(message.content)) return;
    // const [matchedPrefix] = message.content.match(prefixRegex);
    // const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    // const commandName = args.shift().toLowerCase();
    // const command =
    //   client.commands.get(commandName) ||
    //   client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
  
    // if (!command) return;
    // try {
    //   command.execute(message, args);
    // } catch (error) {
    //   console.error(error);
    //   message.reply("There was an error executing that command.").catch(console.error);
    // }
});

client.on('guildMemberAdd', async member => {
    try {
        const channel = member.guild.channels.cache.find(ch => ch.id === '803977442712092742');
        if (!channel) return;

        
        const cachedInvites = guildInvites.get(member.guild.id);
        const newInvites = await member.guild.fetchInvites();
        guildInvites.set(member.guild.id, newInvites);
        const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses);
        


        const canvas = Canvas.createCanvas(1300, 500);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage('./wallpaper.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        var DisplayNameWithFourDigit = member.user.tag;
        var userFourDigit = DisplayNameWithFourDigit.split('#')[1];
        // Name
        ctx.font = applyText(canvas, `${member.displayName}`);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${member.displayName}`, 650, 223);
        
        // ID
        ctx.font = applyText(canvas, `${userFourDigit}`);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${userFourDigit}`, 500, 305);

        ctx.beginPath();
        ctx.arc(232, 232, 186, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
    

        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
        ctx.drawImage(avatar, 45, 45, 380, 380);
        const attachment = new MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
        const blBlueEmoji = member.guild.emojis.cache.find(e => e.name === "blblue");
        const yeYellowEmoji = member.guild.emojis.cache.find(e => e.name === "yeyellow");

        if (!usedInvite) {
            channel.send(`**New Member:** ${member} ${yeYellowEmoji} \n**Invited By:** Unknown (Temp Invite) ${blBlueEmoji} \n اهلا و سهلا فيك بعيلتنا الصغيرة نورتناا :fire::heart: بنتمنى تنبسط معنا`, attachment);
        } else {
            channel.send(`**New Member:** ${member} ${yeYellowEmoji} \n**Invited By:** ${usedInvite.inviter} ${blBlueEmoji} \n اهلا و سهلا فيك بعيلتنا الصغيرة نورتناا :fire::heart: بنتمنى تنبسط معنا`, attachment);
        }
        
    } catch(err){
        console.log(err);
    }
    
});
const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');
	//size of the font
	let fontSize = 60;
	do {
		
		ctx.font = `${fontSize -= 10}px sans-serif`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (ctx.measureText(text).width > canvas.width - 300);
	return ctx.font;
};

