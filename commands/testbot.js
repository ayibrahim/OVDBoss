module.exports = {
    name: 'testbot',
    description: 'this is a test bot is running file!',
    execute(message , args){
        message.channel.send('OverDoseMain is awake!');
    }
}