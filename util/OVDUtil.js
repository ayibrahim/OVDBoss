exports.canModifyQueue = (member) => {
    const { channelID } = member.voice;
    const botChannel = member.guild.voice.channelID;
  
    if (channelID !== botChannel) {
      member.send("You need to join the voice channel first!").catch(console.error);
      return;
    }
  
    return true;
  };
  
  let config;
  
  try {
    config = require("../config.json");
  } catch (error) {
    config = null;
  }
  
  exports.TOKEN = config ? config.TOKEN : process.env.TOKEN;
  exports.PREFIX = config ? config.PREFIX : process.env.PREFIX;