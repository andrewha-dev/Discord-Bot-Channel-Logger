const Discord = require("discord.js");
var config = require('./config.json');
const client = new Discord.Client();

const build = "0.0.1"; // Change with each update
const defaultTextChannel = config.CHANNEL_ID

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
  console.log("Build: " + build);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    let message = ''
    const user = newState.guild.member(newState.id)
    const myPromise = new Promise((resolve, reject) => {
        let username = user.nickname
        if (username !== null) {
            resolve(username)
        }
        if (user.nickname == undefined) {
            client.users.fetch(newState.id).then(user => {
                username = user.username
                resolve(username)
            })
        }
    })

    myPromise.then(username => {
        var d = new Date();
        // d.toLocaleString();       // -> "2/1/2013 7:37:08 AM"
        // d.toLocaleDateString();   // -> "2/1/2013"
        // d.toLocaleTimeString();

        client.channels.fetch(defaultTextChannel).then(
            channel => {
                if (oldState.channelID == null && newState.channelID != null) {   
                    message = `[${d.toLocaleTimeString()} - EST] **${username}** joined **<#${newState.channelID}>**`
                    channel.send(message)
                } 
                else if (oldState.channelID != null && newState.channelID == null) {
                    message = `[${d.toLocaleTimeString()} - EST] **${username}** has left the server`
                    channel.send(message)
                }
                else if (oldState.channelID != null && newState.channelID != null && (oldState.channelID !== newState.channelID)) {
                    message = `[${d.toLocaleTimeString()} - EST] **${username}** switched from **<#${oldState.channelID}>** to **<#${newState.channelID}>**`
                    channel.send(message)
                }
            }
        );
    })
})

client.login(config.TOKEN);