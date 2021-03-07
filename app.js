const Discord = require('discord.js');
var config = require('./config.json');
const client = new Discord.Client();

const build = '0.0.3'; // Change with each update
const defaultTextChannel = config.CHANNEL_ID

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
  console.log('Build: ' + build);
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

        client.channels.fetch(defaultTextChannel).then(
            channel => {
                const channelToSend = channel
                if (oldState.channelID == null && newState.channelID != null) {   
                    client.channels.fetch(newState.channelID).then(newChannel => {
                            message = `[${d.toLocaleTimeString()} - EST] **${username}** joined **${newChannel.name}**`
                            console.log(message)
                            channelToSend.send(message)
                        })
                } 
                else if (oldState.channelID != null && newState.channelID == null) {
                    message = `[${d.toLocaleTimeString()} - EST] **${username}** has left the server`
                    console.log(message)
                    channelToSend.send(message)

                }
                else if (oldState.channelID != null && newState.channelID != null && (oldState.channelID !== newState.channelID)) {
                    client.channels.fetch(oldState.channelID).then(oldChannel => {
                        client.channels.fetch(newState.channelID).then(newChannel => {
                            message = `[${d.toLocaleTimeString()} - EST] **${username}** switched from **${oldChannel.name}** to **${newChannel.name}**`
  
                            channelToSend.send(message)
                        })
                    })
                }
            }
        );
    })
})

client.login(config.TOKEN);