const config = require("./config.js");
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async () => {
    console.log("Connected")

    if(!config.user) {
        console.log("User not find. Bot was deconnected")
        process.exit(1)
    }

    let user = bot.users.cache.get(config.user);

    if(!user) {
        console.log("User not find. Bot was deconnected")
        process.exit(1)
    }
            
    bot.user.setAvatar(`${user.displayAvatarURL()}`);
    if(config.changeUsername === "true") {
        bot.user.setUsername(user.username)
    }

    setInterval(
        async function(){ 

            let user = bot.users.cache.get(config.user);
            //console.log(user)

            if(!user) return

            
            //presence
            //console.log(user)
            let presence = user.presence.status;
            if(presence === "online") presence = "online";
            if(presence === "dnd") presence = "dnd";
            if(presence === "idle") presence = "idle";
            if(presence === "offline") presence = "offline";

            let playingStatus = false;
            let playing = false;

            if(user.presence.activities.length >= 1) {
                let activity = user.presence.activities.find(x => x.name);
                if(activity) {
                    activity = user.presence.activities;
                    if(activity.find(x => x.type === "CUSTOM_STATUS")) {
                        let pre = activity.find(x => x.type === "CUSTOM_STATUS");
                        playingStatus = "WATCHING";
                        playing = pre.state;
                    }

                    if(activity.find(x => x.type === "LISTENING")) {
                        let pre = activity.find(x => x.type === "LISTENING");
                        playingStatus = "LISTENING";
                        playing = `${pre.state} - ${pre.details}`;
                    }

                    if(activity.find(x => x.type === "PLAYING")) {
                        let pre = activity.find(x => x.type === "PLAYING");
                        playingStatus = "PLAYING";
                        playing = pre.name;
                    }

                };
            };
            if(playingStatus && playing) {
                bot.user.setPresence({ activity: { name: playing, type: playingStatus }, status: presence });
            } else {
                bot.user.setStatus(presence)
            }
        }
    , 10000);


    setInterval(
        async function(){ 

            let user = bot.users.cache.get(config.user);
            
            bot.user.setAvatar(`${user.displayAvatarURL()}`);

            if(config.changeUsername === "true") {
                bot.user.setUsername(user.username)
            }
        }
    , 3600000);
});



bot.login(config.token);