const http = require("http");
const express = require("express");
const app = express();
const fs = require("fs"),
  ms = require("ms");
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`https://mamamiya.glitch.me/`);
}, 280000);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////stream coede

const Discord = require("discord.js");
const client = new Discord.Client();
const DiscordAntiSpam = require("discord-anti-spam");
const AntiSpam = new DiscordAntiSpam({
  warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
  banThreshold: 6, // Amount of messages sent in a row that will cause a ban
  maxInterval: 1000, // Amount of time (in ms) in which messages are cosidered spam.
  warnMessage: "{@user}, **Please Stop spamming.**", // Message will be sent in chat upon warning.
  banMessage: "**{user_tag}** Has Been Banned For Spamming ", // Message will be sent in chat upon banning.
  maxDuplicatesWarning: 3, // Amount of same messages sent that will be considered as duplicates that will cause a warning.
  maxDuplicatesBan: 5, // Amount of same messages sent that will be considered as duplicates that will cause a ban.
  deleteMessagesAfterBanForPastDays: 1, // Amount of days in which old messages will be deleted. (1-7)
  exemptPermissions: [
    "MANAGE_MESSAGES",
    "ADMINISTRATOR",
    "MANAGE_GUILD",
    "BAN_MEMBERS"
  ], // Bypass users with at least one of these permissions
  ignoreBots: true, // Ignore bot messages
  verbose: false, // Extended Logs from module
  ignoredUsers: [], // Array of string user IDs that are ignored
  ignoredRoles: [], // Array of string role IDs or role name that are ignored
  ignoredGuilds: [], // Array of string Guild IDs that are ignored
  ignoredChannels: [] // Array of string channels IDs that are ignored
});

AntiSpam.on("warnEmit", member =>
  console.log(`Attempt to warn ${member.user.tag}.`)
);
AntiSpam.on("warnAdd", member =>
  console.log(`${member.user.tag} has been warned.`)
);
AntiSpam.on("kickEmit", member =>
  console.log(`Attempt to kick ${member.user.tag}.`)
);
AntiSpam.on("kickAdd", member =>
  console.log(`${member.user.tag} has been kicked.`)
);
AntiSpam.on("banEmit", member =>
  console.log(`Attempt to ban ${member.user.tag}.`)
);
AntiSpam.on("banAdd", member =>
  console.log(`${member.user.tag} has been banned.`)
);
AntiSpam.on("dataReset", () => console.log("Module cache has been cleared."));

var used1 = false;

var version = "1.0.0";
client.on("ready", () => {
  client.user.setStatus("online").catch(console.error);
  setInterval(() => {
    if (used1) {
      client.user.setActivity(
        `${client.users.size} users | ${client.guilds.size} server`,
        {
          type: "playing"
        }
      );
      used1 = false;
    } else {
      client.user.setActivity("FoxyBot | +help", {
        type: "playing"
      });
      used1 = true;
    }
  }, 5000);
});




const moment = require("moment");
const cmd = require("node-cmd");
const {prefix, token, youtubekey} = require('./config')
const ytdl = require("ytdl-core");
const convert = require("hh-mm-ss")
const fetchVideoInfo = require("youtube-info");
const util = require("util")
const { get } = require('snekfetch');
const guild = require('guild');
const dateFormat = require('dateformat');//npm i dateformat
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(youtubekey);
const getYoutubeID = require('get-youtube-id');
const pretty = require("pretty-ms");
const queue = new Map();




client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();


let cmds = {
  play: { cmd: 'play', a: ['p','شغل','تشغيل'] },
  skip: { cmd: 'skip', a: ['s','تخطي','next']},
  stop: { cmd: 'stop', a:['ايقاف','توقف'] },
  pause: { cmd: 'pause', a:['لحظة','مؤقت'] },
  resume: { cmd: 'resume', a: ['r','اكمل','استكمال'] },
  volume: { cmd: 'volume', a: ['vol','صوت'] },
  queue: { cmd: 'queue', a: ['q','list','قائمة'] },
  repeat: { cmd: 'repeat', a: ['re','تكرار','اعادة'] },
  forceskip: { cmd: 'forceskip', a: ['fs', 'fskip'] },
  skipto: { cmd: 'skipto', a: ['st','تخطي الي'] },
  nowplaying: { cmd: 'Nowplaying', a: ['np','الان'] }
};



Object.keys(cmds).forEach(key => {
var value = cmds[key];
  var command = value.cmd;
  client.commands.set(command, command);

  if(value.a) {
    value.a.forEach(alias => {
    client.aliases.set(alias, command)
  })
  }
})



let active = new Map();

client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => {
    console.log(`Iam Ready`);
    console.log(`Guilds: ${client.guilds.size}`);
    console.log(`Users: ${client.users.size}`);
    client.user.setActivity(`Type ${prefix}help`,{type: 'Playing'}); ///التعديل علي البلاينج
});

client.on('message', async msg => {
    if(msg.author.bot) return undefined;
  if(!msg.content.startsWith(prefix)) return undefined;

  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
const command = args.shift().toLowerCase();

    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';

    let cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))

    let s;

    if(cmd === 'play') {
        const voiceChannel = msg.member.voiceChannel;
        if(!voiceChannel) return msg.channel.send(`:no_entry_sign: You must be listening in a voice channel to use that!`);
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if(!permissions.has('CONNECT')) {
            return msg.channel.send(`:no_entry_sign: I can't join Your voiceChannel because i don't have ` + '`' + '`CONNECT`' + '`' + ` permission!`);
        }

        if(!permissions.has('SPEAK')) {
            return msg.channel.send(`:no_entry_sign: I can't SPEAK in your voiceChannel because i don't have ` + '`' + '`SPEAK`' + '`' + ` permission!`);
        }

        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();

			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return msg.channel.send(`Added to queue: ${playlist.title}`);
		} else {
			try {

				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(args, 1);

					// eslint-disable-next-line max-depth
					var video = await youtube.getVideoByID(videos[0].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send('I can\'t find any thing');
				}
			}

			return handleVideo(video, msg, voiceChannel);
		}

        async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = active.get(msg.guild.id);


//	console.log('yao: ' + Util.escapeMarkdown(video.thumbnailUrl));

let hrs = video.duration.hours > 0 ? (video.duration.hours > 9 ? `${video.duration.hours}:` : `0${video.duration.hours}:`) : '';
let min = video.duration.minutes > 9 ? `${video.duration.minutes}:` : `0${video.duration.minutes}:`;
let sec = video.duration.seconds > 9 ? `${video.duration.seconds}` : `0${video.duration.seconds}`;
let dur = `${hrs}${min}${sec}`

  let ms = video.durationSeconds * 1000;

	const song = {
		id: video.id,
		title: video.title,
    duration: dur,
    msDur: ms,
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],// حسن كههربا

			volume: 50,
      requester: msg.author,
			playing: true,
      repeating: false
		};
		active.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			active.delete(msg.guild.id);
			return msg.channel.send(`I cant join this voice channel`);
		}// حسن كههربا

	} else {
		serverQueue.songs.push(song);

		if (playlist) return undefined;
		if(!args) return msg.channel.send('no results.');
		else return msg.channel.send(':watch: Loading... [`' + args + '`]').then(m => {
      setTimeout(() => {//:watch: Loading... [let]
        m.edit(`:notes: Added **${song.title}**` + '(` ' + song.duration + ')`' + ` to the queue at position ` + `${serverQueue.songs.length}`);
      }, 500)
    }) 
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = active.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		active.delete(guild.id);
		return;
	}
	//console.log(serverQueue.songs);
  if(serverQueue.repeating) {
	console.log('Repeating');
  } else {
	serverQueue.textChannel.send(':notes: Added **' + song.title + '** (`' + song.duration + '`) to begin playing.');
}
	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			//if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			//else console.log(reason);
      if(serverQueue.repeating) return play(guild, serverQueue.songs[0])
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);

// حسن كههربا
}
} else if(cmd === 'stop') {
        if(msg.guild.me.voiceChannel !== msg.member.voiceChannel) return msg.channel.send(`You must be in ${msg.guild.me.voiceChannel.name}`)
        if(!msg.member.hasPermission('ADMINISTRATOR')) {
          msg.react('❌')
          return msg.channel.send('You don\'t have permission `ADMINSTRATOR`');
        }
        let queue = active.get(msg.guild.id);
        if(queue.repeating) return msg.channel.send('Repeating Mode is on, you can\'t stop the music, run `' + `${prefix}repeat` + '` to turn off it.')
        queue.songs = [];
        queue.connection.dispatcher.end();
        return msg.channel.send(':notes: The player has stopped and the queue has been cleared.');
// 04
    } else if(cmd === 'skip') {

      let vCh = msg.member.voiceChannel;

      let queue = active.get(msg.guild.id);

        if(!vCh) return msg.channel.send('Sorry, but you can\'t because you are not in voice channel');

        if(!queue) return msg.channel.send('No music playing to skip it');

        if(queue.repeating) return msg.channel.send('You can\'t skip it, because repeating mode is on, run ' + `\`${prefix}forceskip\``);
// 14
        let req = vCh.members.size - 1;

        if(req == 1) {
            msg.channel.send('**:notes: Skipped **' + args);
            return queue.connection.dispatcher.end('Skipping ..')
        }

        if(!queue.votes) queue.votes = [];

        if(queue.votes.includes(msg.member.id)) return msg.say(`You already voted for skip! ${queue.votes.length}/${req}`);

        queue.votes.push(msg.member.id);

        if(queue.votes.length >= req) {
            msg.channel.send('**:notes: Skipped **' + args);

            delete queue.votes;

            return queue.connection.dispatcher.end('Skipping ..')
        }

        msg.channel.send(`**You have successfully voted for skip! ${queue.votes.length}/${req}**`)

    } else if(cmd === 'pause') {

      let queue = active.get(msg.guild.id);

        let vCh = msg.member.voiceChannel;

        if(!vCh || vCh !== msg.guild.me.voiceChannel) return msg.channel.send(`You are not in my voice channel.`);

        if(!queue) {
            return msg.channel.send('No music playing to pause.')
        }

        if(!queue.playing) return msg.channel.send(':no_entry_sign: There must be music playing to use that!')

        let disp = queue.connection.dispatcher;

        disp.pause('Pausing..')

        queue.playing = false;
// 2002
        msg.channel.send(':notes: Paused ' + args + '. **Type** `' + prefix + 'resume` to unpause!')

    } else if (cmd === 'resume') {

      let queue = active.get(msg.guild.id);

        let vCh = msg.member.voiceChannel;

        if(!vCh || vCh !== msg.guild.me.voiceChannel) return msg.channel.send(`You are not in my voice channel.`);

        if(!queue) return msg.channel.send(':notes: No music paused to resume.')

        if(queue.playing) return msg.channel.send(':notes: No music paused to resume.')

        let disp = queue.connection.dispatcher;

        disp.resume('Resuming..')

        queue.playing = true;

        msg.channel.send(':notes: Resumed.')

    } else if(cmd === 'volume') {

      let queue = active.get(msg.guild.id);

      if(!queue || !queue.songs) return msg.channel.send(':notes: There is no music playing to set volume.');

      let vCh = msg.member.voiceChannel;

      if(!vCh || vCh !== msg.guild.me.voiceChannel) return msg.channel.send(':notes: You are not in my voice channel');

      let disp = queue.connection.dispatcher;

      if(isNaN(args[0])) return msg.channel.send(':notes: Numbers only!');

      if(parseInt(args[0]) > 100) return msg.channel.send('You can\'t set the volume more than 100.')
//:speaker: Volume changed from 20 to 20 ! The volume has been changed from ${queue.volume} to ${args[0]}
      msg.channel.send(':speaker: Volume has been **changed** from (`' + queue.volume + '`) to (`' + args[0] + '`)');

      queue.volume = args[0];
// 14-04-2002
      disp.setVolumeLogarithmic(queue.volume / 100);

    } else if (cmd === 'queue') {

      let queue = active.get(msg.guild.id);

      if(!queue) return msg.channel.send(':no_entry_sign: There must be music playing to use that!');

      let embed = new Discord.RichEmbed()
      .setAuthor(`${client.user.username}`, client.user.displayAvatarURL)
      let text = '';

      for (var i = 0; i < queue.songs.length; i++) {
        let num;
        if((i) > 8) {
          let st = `${i+1}`
          let n1 = converter.toWords(st[0])
          let n2 = converter.toWords(st[1])
          num = `:${n1}::${n2}:`
        } else {
        let n = converter.toWords(i+1)
        num = `:${n}:`
      }
        text += `${num} ${queue.songs[i].title} [${queue.songs[i].duration}]\n`
      }
      embed.setDescription(`Songs Queue | ${msg.guild.name}\n\n ${text}`)
      msg.channel.send(embed)
// 14-04-2002
    } else if(cmd === 'repeat') {

      let vCh = msg.member.voiceChannel;

      if(!vCh || vCh !== msg.guild.me.voiceChannel) return msg.channel.send('You are not in my voice channel');

      let queue = active.get(msg.guild.id);

      if(!queue || !queue.songs) return msg.channel.send('There is no music playing to repeat it.');

      if(queue.repeating) {
        queue.repeating = false;
        return msg.channel.send(':arrows_counterclockwise: **Repeating Mode** (`False`)');
      } else {
        queue.repeating = true;
        return msg.channel.send(':arrows_counterclockwise: **Repeating Mode** (`True`)');
      }

    } else if(cmd === 'forceskip') {

      let vCh = msg.member.voiceChannel;

      if(!vCh || vCh !== msg.guild.me.voiceChannel) return msg.channel.send('You are not in my voice channel');

      let queue = active.get(msg.guild.id);
// 14-04-2002
      if(queue.repeating) {

        queue.repeating = false;

        msg.channel.send('ForceSkipped, Repeating mode is on.')

        queue.connection.dispatcher.end('ForceSkipping..')

        queue.repeating = true;

      } else {
// 14-04-2002
        queue.connection.dispatcher.end('ForceSkipping..')

        msg.channel.send('ForceSkipped.')

      }

     } else if(cmd === 'skipto') {

      let vCh = msg.member.voiceChannel;
// 14-04-2002
      if(!vCh || vCh !== msg.guild.me.voiceChannel) return msg.channel.send('You are not in my voice channel');

      let queue = active.get(msg.guild.id);

      if(!queue.songs || queue.songs < 2) return msg.channel.send('There is no music to skip to.');

    if(queue.repeating) return msg.channel.send('You can\'t skip, because repeating mode is on, run ' + `\`${prefix}repeat\` to turn off.`);

      if(!args[0] || isNaN(args[0])) return msg.channel.send('Please input song number to skip to it, run ' + prefix + `queue` + ' to see songs numbers.');
// 14-04-2002
      let sN = parseInt(args[0]) - 1;

      if(!queue.songs[sN]) return msg.channel.send('There is no song with this number.');

      let i = 1;

      msg.channel.send(`Skipped to: **${queue.songs[sN].title}[${queue.songs[sN].duration}]**`)

      while (i < sN) {
        i++;
        queue.songs.shift();
      }

      queue.connection.dispatcher.end('SkippingTo..')
// 14-04-2002
    } else if(cmd === 'Nowplaying') {

      let q = active.get(msg.guild.id);

      let now = npMsg(q)

      msg.channel.send(now.mes, now.embed)
      .then(me => {
        setInterval(() => {
          let noww = npMsg(q)
          me.edit(noww.mes, noww.embed)
        }, 5000)
      })

      function npMsg(queue) {

        let m = !queue || !queue.songs[0] ? 'No music playing.' : "Now Playing..."

      const eb = new Discord.RichEmbed();

      eb.setColor(msg.guild.me.displayHexColor)

      if(!queue || !queue.songs[0]){
// 14-04-2002
        eb.setTitle("No music playing");
            eb.setDescription("\u23F9 "+bar(-1)+" "+volumeIcon(!queue?100:queue.volume));
      } else if(queue.songs) {

        if(queue.requester) {

          let u = msg.guild.members.get(queue.requester.id);

          if(!u)
            eb.setAuthor('Unkown (ID:' + queue.requester.id + ')')
          else
            eb.setAuthor(u.user.tag, u.user.displayAvatarURL)
        }

        if(queue.songs[0]) {
        try {
            eb.setTitle(queue.songs[0].title);
            eb.setURL(queue.songs[0].url);
        } catch (e) {
          eb.setTitle(queue.songs[0].title);
        }
}
        eb.setDescription(embedFormat(queue))

      } // 14-04-2002

      return {
        mes: m,
        embed: eb
      }

    }

      function embedFormat(queue) {

        if(!queue || !queue.songs) {
          return "No music playing\n\u23F9 "+bar(-1)+" "+volumeIcon(100);
        } else if(!queue.playing) {
          return "No music playing\n\u23F9 "+bar(-1)+" "+volumeIcon(queue.volume);
        } else {

          let progress = (queue.connection.dispatcher.time / queue.songs[0].msDur);
          let prog = bar(progress);
          let volIcon = volumeIcon(queue.volume);
          let playIcon = (queue.connection.dispatcher.paused ? "\u23F8" : "\u25B6")
          let dura = queue.songs[0].duration;

          return playIcon + ' ' + prog + ' `[' + formatTime(queue.connection.dispatcher.time) + '/' + dura + ']`' + volIcon;


        }

      }

      function formatTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return (hours > 0 ? hours + ":" : "") + minutes + ":" + seconds;
}

      function bar(precent) {

        var str = '';

        for (var i = 0; i < 12; i++) {

          let pre = precent
          let res = pre * 12;

          res = parseInt(res)

          if(i == res){
            str+="\uD83D\uDD18";
          }
          else {
            str+="▬";
          }
        }

        return str;

      }

      function volumeIcon(volume) {

        if(volume == 0)
           return "\uD83D\uDD07";
       if(volume < 30)
           return "\uD83D\uDD08";
       if(volume < 70)
           return "\uD83D\uDD09";
       return "\uD83D\uDD0A";

      }

    }

});

///ticket

const category = "category-id";
let mtickets = true;
let tchannels = [];
let current = 0;
 
 
client.on("message", async message => {
  if (message.author.bot || message.channel.type === "dm") return;
  let args = message.content.split(" ");
  let author = message.author.id;
  if (args[0].toLowerCase() === `${prefix}heeeeelsasaollooop`) {
    let embed = new Discord.RichEmbed()
      .addField(``);
    await message.channel.send(
      `:white_check_mark: , **This is a list of all bot commands.**`
    );
    await message.channel.send(embed);
  } else if (args[0].toLowerCase() === `${prefix}new`) {
    if (mtickets === false)
      return message.channel.send(
        `**The tickets were stopped by one of the administration**`
      );
    if (!message.guild.me.hasPermission("MANAGE_CHANNELS"))
      return message.channel.send(
        `**The bot is not unable to make Rom. Check Rank**`
      );
    console.log(current);
    let openReason = "";
    current++;
    message.guild.createChannel(`ticket-${current}`, "text").then(c => {
      tchannels.push(c.id);
      c.setParent(category);
      message.channel.send(`**Your ticket has been unlocked**`);
      c.overwritePermissions(message.guild.id, {
        READ_MESSAGES: false,
        SEND_MESSAGES: false
      });
      c.overwritePermissions(message.author.id, {
        READ_MESSAGES: true,
        SEND_MESSAGES: true
      });
 
      if (args[1])
        openReason = `\nReason: [ **__${args.slice(1).join(" ")}__** ]`;
      let embed = new Discord.RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setColor("#36393e")
        .setDescription(`**Wait Admin To Answer You**${openReason}`);
      c.send(`${message.author}`);
      c.send(embed);
    });
  } else if (args[0].toLowerCase() === `${prefix}mtickets`) {
    if (!message.member.hasPermission("MANAGE_GUILD"))
      return message.channel.send(
        `**This is for management only**`
      );
    if (args[1] && args[1].toLowerCase() === "enable") {
      mtickets = true;
      message.channel.send(
        `**The ticketing system has been activated**`
      );
    } else if (args[1] && args[1].toLowerCase() === "disable") {
      mtickets = false;
      message.channel.send(
        `**The tickets system has been closed**`
      );
    } else if (!args[1]) {
      if (mtickets === true) {
        mtickets = false;
        message.channel.send(
          `**The tickets system has been closed**`
        );
      } else if (mtickets === false) {
        mtickets = true;
        message.channel.send(
          `**The ticketing system has been activated**`
        );
      }
    }
  } else if (args[0].toLowerCase() === `${prefix}close`) {
    if (!message.member.hasPermission("MANAGE_GUILD"))
      return message.channel.send(
      `**You are not from the server administration to do this**`
      );
    if (
      !message.channel.name.startsWith("ticket-") &&
      !tchannels.includes(message.channel.id)
    )
      return message.channel.send(`**This is not Rom Ticket**`);
 
    message.channel.send(
      `**ROM is locked automatically after 5 seconds**`
    );
    tchannels.splice(tchannels.indexOf(message.channel.id), 1);
    setTimeout(() => message.channel.delete(), 5000); //لحد هنا
  } else if (message.content == prefix + `remove`) {
    if (!message.channel.name.startsWith("ticket-")) {
      return message.channel.send(`**This command only for the tickets**`);
    }
    let member = message.mentions.members.first();
    if (!member || member.id === client.user.id) {
      return message.channel.send(`**Please mention the user**`);
    }
    if (
      !message.channel
        .permissionsFor(member)
        .has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])
    ) {
      return message.channel.send(
        `**${member.user.tag}** is not in this ticket to remove them`
      );
    }
    message.channel.overwritePermissions(member.id, {
      SEND_MESSAGES: false,
      VIEW_CHANNEL: false,
      READ_MESSAGE_HISTORY: false
    });
    message.channel.send(
      `**Done \nSuccessfully removed \`${member.user.tag}\` from the ticket**`
    );
  } else if (message.content == prefix + `add`) {
    if (!message.guild.member(client.user).hasPermission("MANAGE_CHANNELS"))
      return message.channel.send(
        `**Error** \nI Don\'t have MANAGE_CHANNELS Permission to do this`
      );
    if (!message.channel.name.startsWith("ticket-"))
      return message.channel.send(`**This command only for the tickets**`);
    let member = message.mentions.members.first();
    if (!member) return message.channel.send(`**Please mention the user**`);
    if (
      message.channel
        .permissionsFor(member)
        .has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])
    )
      return message.channel.send(
        `this member already in this ticket :rolling_eyes:`
      );
    message.channel.overwritePermissions(member.id, {
      SEND_MESSAGES: true,
      VIEW_CHANNEL: true,
      READ_MESSAGE_HISTORY: true
    });
    message.channel.send(
      `**Done \nSuccessfully added <@${member.user.id}> to the ticket**`
    );
  } else if (args[0].toLowerCase() === `${prefix}reeeeeeeeeestart`) {
    if (!devs.includes(message.author.id))
      return message.channel.send(
        `:tools:, **You are not the server administrator to use this command.**`
      );
    message.channel.send(`:white_check_mark:, **The bot is restarting.**`);
    client.destroy();
 
        
      
    
  }
});



client.on("ready", () => {
  const channel = client.channels.get("675048712967421991");
  if (!channel) return console.error("The channel does not exist!");
  channel
    .join()
    .then(connection => {
      // Yay, it worked!
      console.log("Successfully connected.");
    })
    .catch(e => {
      // Oh no, it errored! Let's log it to console :)
      console.error(e);
      return;
    });
});
client.on("ready", () => {
  const channel = client.channels.get("637723070617878542");
  if (!channel) return console.error("The channel does not exist!");
  channel
    .join()
    .then(connection => {
      // Yay, it worked!
      console.log("Successfully connected.");
    })
    .catch(e => {
      // Oh no, it errored! Let's log it to console :)
      console.error(e);
      return;
    });
});
client.on("message", msg => {
  AntiSpam.message(msg);
});
client.on("ready", () => {
  console.log(`----------------`);
  console.log(`Desert Bot- Script By : BadBoy17`);
  console.log(`----------------`);
  console.log(`ON ${client.guilds.size} Servers '     Script By : BadBoy17' `);
  console.log(`----------------`);
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setStatus("IDLE");
});

client.on("message", async message => {
  if (!message.content.startsWith(prefix)) return;
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  var messageArray = message.content.split(" ");
  var command = messageArray[0];
  var args = messageArray.slice(1);

  if (command === `${prefix}kick`) {
    if (!message.member.roles.some(r => ["Admins", "Owner"].includes(r.name)))
      return message.replay(
        "**Foxytool :** *Sorry you don't have permissions to use this !* "
      );

    var kickUser = message.guild.member(
      message.mentions.users.first() || message.guild.members(args[0])
    );
    if (!kickUser)
      return message.channel.send("**Foxytool :** *Please mention an User !* ");
    var reason = args.join(" ").slice(22);
    if (!message.member.hasPermission("KICK_MEMBERS"))
      return message.channel.send(
        "**Foxytool +:** *Sory you dont have enough permission !* "
      );
    if (kickUser.hasPermission("KICK_MEMBERS"))
      return message.channel.send(
        "**Foxytool +:** *You cannot kick this user !* "
      );

    var kick = new Discord.RichEmbed()
      .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL)
      .setColor("#a21b1b")
      .addField("✦-**Moderation:**", "Kick")
      .addField("✦-**Kicked user:**", kickUser)
      .addField("✦-**Kicked by:**", message.author)
      .addField("✦-**Reason:**", reason)
      .addField("✦-**Date:**", message.createdAt);

    var kickChannel = message.guild.channels.find(c => c.name == "prime-logs");
    if (!kickChannel) return message.guild.send("Could not find the channel");

    message.guild.member(kickUser).kick(reason);

    kickChannel.send(kick);

    return;
  }

  if (command === `${prefix}ban`) {
    if (!message.member.roles.some(r => ["Admins", "Owner"].includes(r.name)))
      return message.replay(
        "**Foxytool :** *Sorry you don't have permissions to use this !* "
      );

    var banUser = message.guild.member(
      message.mentions.users.first() || message.guild.members(args[0])
    );
    if (!banUser)
      return message.channel.send("**Foxytool :** *Please mention an User !* ");
    var reason = args.join(" ").slice(22);
    if (!message.member.hasPermission("BAN_MEMBERS"))
      return message.channel.send(
        "**Foxytool +:** *Sorry you cannot do this !*  "
      );
    if (banUser.hasPermission("BAN_MEMBERS"))
      return message.channel.send(
        "**Foxytool +:** *You cannot ban this user !*  "
      );

    var ban = new Discord.RichEmbed()
      .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL)
      .setColor("#a21b1b")
      .setThumbnail(message.guild.iconURL)
      .addField("**Moderation:**", "Ban")
      .addField("**Banned user:**", banUser)
      .addField("**Banned by:**", message.author)
      .addField("**Reason:**", reason)
      .addField("**Date:**", message.createdAt);

    var banChannel = message.guild.channels.find(c => c.name == "prime-logs");
    if (!banChannel) return message.guild.send("Could not find the channel");

    message.guild.member(banUser).ban(reason);

    banChannel.send(ban);

    return;
  }
});

client.on('message', message => {
  // If message is ping
  if (message.content === 'best server') {
    // Send pong back
    message.channel.send('Alpha Community: https://discord.gg/CC2aFCz https://media.giphy.com/media/BTNG0RVXY5M0OKoap6/giphy.gif');
  }
});

client.on('message', message => {
  // If message is ping
  if (message.content === 'Happy birthday Ja3bou9 🎉') {
    // Send pong back
    message.channel.send('https://media.giphy.com/media/3MIMsGRiS2KcRM4FHj/giphy.gif');
  }
});


/*Kick*/
client.on("message", function(message) {
  if (!message.guild) return;
  let args = message.content.trim().split(/ +/g);

  if (args[0].toLowerCase() === prefix + "kick") {
    if (!message.member.hasPermission("KICK_MEMBERS"))
      return message.channel.send(
        "**Foxytool :** *Please, check your permissions !*  "
      );
    let member = message.mentions.members.first();
    if (!member)
      return message.channel.send(
        "**Foxytool :** *Please Use:* `&kick` + `User` + `Reason` !"
      );
    if (
      member.highestRole.calculatedPosition >=
        message.member.highestRole.calculatedPosition &&
      message.author.id !== message.guild.owner.id
    )
      return message.channel.send(
        "**Foxytool :** *I Cant kick this member !* "
      );
    if (!member.kickable) return message.channel.send("");
    member.kick();
  }
});

/*Ban*/
client.on("message", function(message) {
  if (!message.guild) return;
  let args = message.content.trim().split(/ +/g);

  if (args[0].toLocaleLowerCase() === prefix + "ban") {
    if (!message.member.hasPermission("BAN_MEMBERS"))
      return message.channel.send(
        "**Foxytool :** *You don't have enough power !* "
      );
    let member = message.mentions.members.first();
    if (!member)
      return message.channel.send(
        "**Foxytool :** *Please Use:* `&ban` + `User` + `Reason` !"
      );
    if (
      member.highestRole.calculatedPosition >=
        message.member.highestRole.calculatedPosition &&
      message.author.id !== message.guild.owner.id
    )
      return message.channel.send("**Kingtool :** *I can't ban this user* ! ");
    if (!member.bannable) return message.channel.send("");
    message.guild.ban(member, { days: 7 });
  }
});
client.on(`ready`, async function() {
  console.log(`Logged in`);
});

client.on("message", async message => {
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g); //arguments
  const command = args.shift().toLowerCase(); //command

  if (message.content.indexOf(prefix) !== 0) return;

  if (command === "ban") {
    if (!message.guild) return; //if command is run in a dm, dont run
    if (!args[0]) return; //if no one is mentioned, then do nothing (obviously)
    var user = message.mentions.members.first(); //if a person is mentioned, get their member property
    if (!user) user = message.guild.member(client.users.get(args[0])); //for those with developer mode on,
    // you can ban someone with their id whos been in the server in the past, even if they're currently not in it
    let reason = args.slice(1).join(" "); //The reason is everything after the mentioned user
    if (!reason) reason = "No reason specified.";

    var BanEmbed = new Discord.RichEmbed()
      .setDescription("**Ban**")
      .setAuthor(message.author.tag, message.author.displayAvatarURL)
      .setThumbnail(message.author.displayAvatarURL)
      .setColor("#a21b1b") //set color of the embed.
      .addField("**Banned user**", `${user}`) //get the tag of the USER property of the banned member
      .addField(
        "**Banned by**",
        `<@${message.author.id}>, ${message.author.tag}`
      ) //tag the moderator who banned the member
      .addField("**Reason**", reason) //add the reason to the embed
      .addField("**Date**", message.createdAt);

    if (!message.member.hasPermission("BAN_MEMBERS"))
      return message.channel.send(" "); //dont ban the person
    //if the moderator doesnt have ban permission
    user
      .ban(reason)
      .then(() => {
        //ban them
        if (!message.guild.members.has(user)) {
          message.channel.send(BanEmbed); //if the ban was successful, send the embed to the channel
        } else {
          message.channel.send("**Foxytool :** *I couldn't ban that user !* ");
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  client.on(`ready`, async function() {
    console.log(`Logged in`);
  });

  client.on("message", async message => {
    const args = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g); //arguments
    const command = args.shift().toLowerCase(); //command

    if (message.content.indexOf(prefix) !== 0) return;

    if (command === "kick") {
      if (!message.guild) return; //if command is run in a dm, dont run
      if (!args[0]) return; //if no one is mentioned, then do nothing (obviously)
      var user = message.mentions.members.first(); //if a person is mentioned, get their member property
      if (!user) user = message.guild.member(client.users.get(args[0])); //for those with developer mode on,
      // you can ban someone with their id whos been in the server in the past, even if they're currently not in it
      let reason = args.slice(1).join(" "); //The reason is everything after the mentioned user
      if (!reason) reason = "No reason specified.";

      var BanEmbed = new Discord.RichEmbed()

        .setDescription(" **Kick**")
        .setAuthor(message.author.tag, message.author.displayAvatarURL)
        .setThumbnail(message.author.displayAvatarURL)
        .setColor("#a21b1b") //set color of the embed.
        .addField("**Kicked user**", `${user}`) //get the tag of the USER property of the banned member
        .addField("**Kicked by**", `<@${message.author.id}>`) //tag the moderator who banned the member
        .addField("**Reason**", reason) //add the reason to the embed
        .addField("**Date**", message.createdAt);

      if (!message.member.hasPermission("KICK_MEMBERS"))
        return message.channel.send(""); //dont ban the person
      //if the moderator doesnt have ban permission
      user
        .kick(reason)
        .then(() => {
          //ban them
          if (!message.guild.members.has(user)) {
            message.channel.send(BanEmbed); //if the ban was successful, send the embed to the channel
          } else {
            message.channel.send(
              "**Foxytool:** *I couldn't kick that user !* "
            );
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  });
});

client.on("guildMemberAdd", member => {
  const channel = client.channels.get("760160634402242562");
  if (member.guild.id === "759447695202713631") {
    var embed = new Discord.RichEmbed()
      .setColor("#a21b1b")
      .setThumbnail(client.user.avatarURL)
      .setTitle("Hello and Welcome, to Foxy SUPPORT")
      .setDescription(
        `Before entering Foxy SUPPORT,
Feel Free to check out these Channels first: 
**-** <#759477959060226108>
**-** <#759563031549837373>
`
      )
      .addField("⍣  ``Username``", member.user, true)
      .addField("⍣  ``Server``", "**Foxy BOT SUPPORT™**", true)
      .addField("⍣  ``Users``", member.guild.memberCount, true)
      .setImage(
        "https://i.pinimg.com/originals/6d/fb/c7/6dfbc74564ed8ed039734fa91b2d8f9a.gif"
      );
    channel.send(embed);
  }
});

const invites = {};
const wait = require("util").promisify(setTimeout);
client.on("ready", () => {
  wait(1000);
  client.guilds.forEach(king => {
    king.fetchInvites().then(guildInvites => {
      invites[king.id] = guildInvites;
    });
  });
});

client.on("guildMemberAdd", member => {
  member.guild.fetchInvites().then(guildInvites => {
    const gamer = invites[member.guild.id];
    invites[member.guild.id] = guildInvites;
    let invite = guildInvites.find(i => gamer.get(i.code).uses < i.uses);
    if (!invite) invite = 0;
    const inviter = client.users.get(invite.inviter.id);
    const welcome = member.guild.channels.find(
      channel => channel.id === "760160634402242562"
    );
    if (!welcome) return;
    welcome.send(`**Invited by: **` + `[ ${inviter.tag} ]`);
  });
});


client.on(`ready`, async function() {
  console.log(`Logged in`);
});

client.on("message", async message => {
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g); //arguments
  const command = args.shift().toLowerCase(); //command

  if (message.content.indexOf(prefix) !== 0) return;

  if (command == "avatar") {
    var user;
    user = message.mentions.users.first(); //mentioned user, if any
    if (!user) {
      //if no one is mentioned
      if (!args[0]) {
        //if the command is only "!avatar". I.e. no one is mentioned and no id is specified
        user = message.author;
        getuseravatar(user);
      } else {
        //if a user id IS specified (need developer mode on on discord to get it)
        var id = args[0];
        client
      
          .fetchUser(id)
          .then(user => {
            getuseravatar(user); //get avatar of the user, whose id is specified
          })
          .catch(error => console.log(error));
      }
    } else {
      //if someone IS mentioned
      getuseravatar(user);
    }
    function getuseravatar(user) {
      var embed = new Discord.RichEmbed()
        .setColor("#a21b1b") //can specifiy color of embed here
        .setImage(user.avatarURL)
        .setFooter("Foxytool");
      message.channel.send(embed);
    }
  }
});

var used1 = false;

var version = "1.0.0";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("Use: +help");
});

client.on("ready", async () => {
  console.log(`${client.user.username} is IDLE!`);
});

client.on("message", msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(prefix)) return;
  let command = msg.content.split(" ")[0];
  command = command.slice(prefix.length);
  let args = msg.content.split(" ").slice(1);

  if (command == "clear") {
    const emoji = client.emojis.find("name", "wastebasket");
    let textxt = args.slice(0).join("");
    if (msg.member.hasPermission("MANAGE_MESSAGES")) {
      if (textxt == "") {
        msg.delete().then;
        msg.channel
          .send("***``Please choose a number``***")
          .then(m => m.delete(10000));
      } else {
        msg.delete().then;
        msg.delete().then;
        msg.channel.bulkDelete(textxt);
        msg.channel
          .send("```Messages deleted : " + textxt + "\n```")
          .then(m => m.delete(10000));
      }
    }
  }
});

client.on("message", message => {
  if (message.content.startsWith(prefix + "invites")) {
    message.guild.fetchInvites().then(invs => {
      let user = message.mentions.users.first() || message.author;
      let personalInvites = invs.filter(i => i.inviter.id === user.id);
      let inviteCount = personalInvites.reduce((p, v) => v.uses + p, 0);
      message.channel.send(`${user} has ${inviteCount} invites.`);
    });
  }
});

client.on("message", async message => {
  if (!message.content.startsWith(prefix)) return;
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  var messageArray = message.content.split(" ");
  var command = messageArray[0];
  var args = messageArray.slice(1);
  var year = message.author.createdAt.getFullYear();
  var month = message.author.createdAt.getMonth();
  var day = message.author.createdAt.getDate();

  if (command === `${prefix}user`) {
    let user = message.mentions.users.first();
    if (!user) user = message.author;
    let color = message.member.displayHexColor;
    if (color == "") color = message.member.hoistRole.hexColor;
    const userinfoEmbed = new Discord.RichEmbed()
      .setColor("#a21b1b")
      .setAuthor(message.author.tag, message.author.displayAvatarURL)
      .addField("👤 ``User ID``:", message.author.id, true)
      .addField("📜 ``Status``:", message.author.presence.status, true)
      .addField(
        "📅 ``Date of Creation``: ",
        year + "-" + month + "-" + day,
        true
      )
      .addField(
        "📆 ``Date of Joining the server``:",
        message.member.joinedAt.toLocaleString(),
        true
      )
      .setImage("https://d.top4top.io/p_1734jjry91.gif");
    message.channel.send(userinfoEmbed);
  }

  if (command === `${prefix}server`) {
    var serverEmbed = new Discord.RichEmbed()
      .setColor("#a21b1b")
      .setTitle("About Foxy SUPPORT :")
      .addField("👤 ``Name``", message.guild.name, true)
      .addField("👥 ``Member Count``", message.guild.memberCount, true)
      .addField(
        "💬 ``Texting Channels``",
        `${message.guild.channels.filter(m => m.type === "text").size} `,
        true
      )
      .addField(
        "🎤 ``Voice Channels``",
        `${message.guild.channels.filter(m => m.type === "voice").size} `,
        true
      )
      .addField("🌍 ``Server Region``", message.guild.region, true)
      .addField("🛠️ ``Role Count``", message.guild.roles.size, true)
      .setImage("https://d.top4top.io/p_1734jjry91.gif");
    message.channel.send(serverEmbed);
  }
});

client.on("message", m => {
  if (m.content === "helpful") {
    let Dashboard = "https://discord.gg/r5XG7q";
    var addserver ="https://discord.com/oauth2/authorize?client_id=758243946488397824&permissions=8&scope=bot";
    var SUPPORT = "https://discord.gg/r5XG7q";
    let embed = new Discord.MessageEmbed().setTitle(`Helpful Links`)
      .setDescription(`                                                                                                               
**[Add To Your Server ](${addserver})**    
**[Dashboard](${Dashboard})**
**[ Server Support](${SUPPORT})**`);
    m.author.send(embed);
  }
});

client.on("message", message => {
  if (message.content.startsWith("+slots")) {
    let slot1 = ["🍏", "🍇", "🍒", "🍍", "🍅", "🍆", "🍑", "🍓"];
    let slot2 = ["🍏", "🍇", "🍒", "🍍", "🍅", "🍆", "🍑", "🍓"];
    let slot3 = ["🍏", "🍇", "🍒", "🍍", "🍅", "🍆", "🍑", "🍓"];
    let slots1 = `${slot1[Math.floor(Math.random() * slot1.length)]}`;
    let slots2 = `${slot1[Math.floor(Math.random() * slot1.length)]}`;
    let slots3 = `${slot1[Math.floor(Math.random() * slot1.length)]}`;
    let we;
    if (slots1 === slots2 && slots2 === slots3) {
      we = "😀 Rbeee7ti Atoubi 😀";
    } else {
      we = "😣 Khserti Ras L9lwa 😣";
    }
    let embedcasi = new Discord.RichEmbed()
      .setTitle(`${we}`)

      .setAuthor(message.author.username, message.author.avatarURL)
      .setColor("RANDOM")
      .setDescription(`|${slots1}---------|${slots2}----------|${slots3} `)
      .setImage(
        "https://cdn.discordapp.com/attachments/659858211855138825/660144839098236929/fx-long-1_2.gif"
      )
      .setThumbnail(message.author.avatarURL)
      .setTimestamp()
      .setFooter(message.guild.name, message.guild.iconURL)
      .setFooter("Foxy-Casino", "https://i.imgur.com/q1f7SCl.jpg");
    message.channel.sendEmbed(embedcasi);
  }
});

client.on("message", message => {
  if (message.content == "+vlock") {
    if (!message.member.hasPermission("MANAGE_CHANNELS")) return;
    let channel = message.member.voiceChannel;
    for (let member of channel.members) {
      member[1].setMute(true);
    }
    message.channel.send(
      `**Foxytool**: :no_entry: : **${message.author.username}**, *Voice channel, is now Under :* **LockDown** *Mode* 🔒`
    );
  }
});

client.on("message", message => {
  if (message.content == "+vunlock") {
    if (!message.member.hasPermission("MANAGE_CHANNELS")) return;
    let channel = message.member.voiceChannel;
    for (let member of channel.members) {
      member[1].setMute(false);
    }
    message.channel.send(
      `**Foxytool**: :no_entry: : **${message.author.username}**, *The Channel is no longer Under:* **Lockdown** *Mode* 🔓`
    );
  }
});

client.on("message", message => {
  let command = message.content.split(" ")[0];
  if (command == prefix + "unban") {
    if (!message.member.hasPermission("BAN_MEMBERS")) return;
    let args = message.content
      .split(" ")
      .slice(1)
      .join(" ");
    if (args == "all") {
      message.guild.fetchBans().then(zg => {
        zg.forEach(Saad => {
          message.guild.unban(Saad);
        });
      });
      return message.channel.send(
        "**Foxytool**: ✅ Unbanned all the members !"
      );
    }
    if (!args)
      return message.channel.send(
        "**Foxytool**: Please Use:  `+unban` + `User ID`  **or**  `&unban` + `All`  *!*"
      );
    message.guild
      .unban(args)
      .then(m => {
        message.channel.send(
          `**Foxytool**: | **${m.username}** Has Been Successfully Unbanned !`
        );
      })
      .catch(stry => {
        message.channel.send(
          `**Foxytool**: | I couldn't find \`${args}\` in the ban list !`
        );
      });
  }
});

client.on("message", message => {
  if (!message.channel.guild) return;
  if (message.content.startsWith(prefix + "ping")) {
    if (!message.channel.guild) return;
    var msg = `${Date.now() - message.createdTimestamp}`;
    var api = `${Math.round(client.ping)}`;
    if (message.author.bot) return;
    let embed = new Discord.RichEmbed()
      .setColor("#a21b1b")
      .addField("**Time Taken:**", msg + " ms :signal_strength: ", true)
      .addField("**WebSocket:**", api + " ms :signal_strength: ", true)
      .setImage(
        "https://i.pinimg.com/originals/6d/fb/c7/6dfbc74564ed8ed039734fa91b2d8f9a.gif"
      )
      .setFooter("FoxyBot (Foxytool)");
    message.channel.send({ embed: embed });
  }
});

client.on("message", async message => {
  if (message.content.startsWith(prefix + "lock")) {
    if (!message.member.hasPermission("MANAGE_CHANNELS")) return;
    if (!message.guild.member(client.user).hasPermission("MANAGE_CHANNELS"))
      return message.channelsend(
        `**${message.author.username}**,` +
          " I Don't Have `MANAGE_CHANNELS` Permission ✅"
      );
    message.channel.overwritePermissions(message.guild.id, {
      SEND_MESSAGES: false
    });
    message.channel.send(
      `**Foxy**: **${message.author.username}**, *Command confirmed, This Channel is now in* **Lockdown** 🔒`
    );
  }
});

client.on("message", async message => {
  if (message.content.startsWith(prefix + "unlock")) {
    if (!message.member.hasPermission("MANAGE_CHANNELS")) return;
    if (!message.guild.member(client.user).hasPermission("MANAGE_CHANNELS"))
      return message.channelsend(
        `**${message.author.username}**,` +
          "I Don't Have `MANAGE_CHANNELS` Permission ✅"
      );
    message.channel.overwritePermissions(message.guild.id, {
      SEND_MESSAGES: null
    });
    message.react("🔓");
    return;
  }
});

client.on("message", message => {
  if (message.content.startsWith(prefix + "bot")) {
    message.channel.send({
      embed: new Discord.RichEmbed()
        .setAuthor(client.user.username, client.user.avatarURL)
        .setThumbnail(client.user.avatarURL)
        .setColor("RED")
        .setTitle("**BOT INFO** ")
        .addField(
          "``🖧 My Ping``",
          [`**${Date.now() - message.createdTimestamp}` + "MS**"],
          true
        )
        .addField(
          "``🖧 RAM Usage``",
          `[**${(process.memoryUsage().rss / 1048576).toFixed()}MB**]`,
          true
        )
        .addField("``servers``", [client.guilds.size], true)
        .addField("``channels``", `[**${client.channels.size} **]`, true)
        .addField("``👥 Users``", `[** ${client.users.size}** ]`, true)
        .addField("``📋 My Name``", `[**${client.user.tag} **]`, true)
        .addField("``🆔 My ID``", `[ **${client.user.id}** ]`, true)
        .addField("``My Prefix``", `[ ${prefix} ]`, true)
        .setImage(
          "https://i.pinimg.com/originals/6d/fb/c7/6dfbc74564ed8ed039734fa91b2d8f9a.gif"
        )
    });
  }
});

client.on("message", async message => {
  const ms = require("ms");
  if (message.author.omar) return;
  if (!message.content.startsWith(prefix)) return;
  if (!message.channel.guild)
    return message.channel
      .send("**Foxytool :** *This command only for servers*")
      .then(m => m.delete(5000));
  if (!message.member.hasPermission("MANAGE_ROLES")) return;
  if (!message.guild.member(message.author).hasPermission("MANAGE_ROLES"))
    return message.channel.send(
      "**Foxytool :** *You Don't Have enough permision !*"
    );
  if (!message.guild.member(client.user).hasPermission("MANAGE_ROLES"))
    return message.channel
      .send("**Foxytool :** *I Dont have enough permission.*")
      .then(msg => msg.delete(6000));
  var command = message.content.split(" ")[0];
  command = command.slice(prefix.length);
  var args = message.content.split(" ").slice(1);
  if (command == "mute") {
    let tomute = message.guild.member(
      message.mentions.users.first() || message.guild.members.get(args[0])
    );
    let embed = new Discord.RichEmbed()
      .addField("Mute:", "+mute User time")
      .addField("Usage:", "``+mute`` ``@name`` ``30m``");
    if (!tomute) return message.channel.sendEmbed(embed);
    if (tomute.hasPermission("MANAGE_MESSAGES"))
      return message.channel.send(
        "**Foxytool :** *I Dont have enough permission !*"
      );
    let muterole = message.guild.roles.find(`name`, "muted");
    //start of create role
    if (!muterole) {
      try {
        muterole = await message.guild.createRole({
          name: "muted",
          color: "#000000",
          permissions: []
        });
        message.guild.channels.forEach(async (channel, id) => {
          await channel.overwritePermissions(muterole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          });
        });
      } catch (e) {
        console.log(e.stack);
      }
    }
    //end of create role
    let mutetime = args[1];
    if (!mutetime)
      return message.channel.send("**Foxytool :** Incorrect Time !");

    await tomute.addRole(muterole.id);
    message.channel.send("**Foxytool :** User has been muted !");
    setTimeout(function() {
      tomute.removeRole(muterole.id);
      message.channel.send(
        `**Foxytool :** <@${tomute.id}>'s Mute time is over, He has been **Unmuted** ! `
      );
    }, ms(mutetime));
  }
  if (command === `unmute`) {
    if (!message.member.hasPermission("MANAGE_ROLES"))
      return message.channel
        .sendMessage("**Foxytool :** You dont have Enough permission !")
        .then(m => m.delete(5000));
    if (!message.guild.member(client.user).hasPermission("MANAGE_ROLES"))
      return message
        .reply("**Foxytool :** I Dont have enough permission !")
        .then(msg => msg.delete(6000));

    let toMute =
      message.guild.member(message.mentions.users.first()) ||
      message.guild.members.get(args[0]);
    if (!toMute)
      return message.channel.sendMessage(
        "**Foxytool :** I Couldnt find this User "
      );

    let role = message.guild.roles.find(r => r.name === "muted");

    if (!role || !toMute.roles.has(role.id))
      return message.channel.sendMessage("**Foxytool :** User is not muted !");

    await toMute.removeRole(role);
    message.channel.sendMessage("**Foxytool :** Successfully unmuted !");

    return;
  }
});

client.on("message", function(message) {
  if (message.content.startsWith(prefix + "roll")) {
    let args = message.content.split(" ").slice(1);
    if (!args[0]) {
      message.channel.send(
        "**Foxytool:** *Please, Write a number that i can choose from !* "
      );
      return;
    }
    message.channel.send(Math.floor(Math.random() * args.join(" ")));
    if (!args[0]) {
      message.edit("1");
      return;
    }
  }
});

client.on("message", message => {
  var prefix = "+";
  if (!message.channel.guild) return;
  if (message.content.startsWith(prefix + "move")) {
    if (message.member.hasPermission("MOVE_MEMBERS")) {
      if (message.mentions.users.size === 0) {
        return message.channel.send("``Use : " + prefix + "move @User``");
      }
      if (message.member.voiceChannel != null) {
        if (message.mentions.members.first().voiceChannel != null) {
          var authorchannel = message.member.voiceChannelID;
          var usermentioned = message.mentions.members.first().id;
          var embed = new Discord.RichEmbed()
            .setTitle("Succes!")
            .setColor("#000000")
            .setDescription(
              `✅ You Have Moved <@${usermentioned}> To Your Channel `
            );
          var embed = new Discord.RichEmbed()
            .setTitle(`You are Moved in ${message.guild.name} `)
            .setColor("RANDOM")
            .setTitle(`✽**FOXY Systeme**`)

            .setDescription(
              `**<@${message.author.id}> Moved You To His Channel!\nServer --> ${message.guild.name}**`
            );
          message.guild.members
            .get(usermentioned)
            .setVoiceChannel(authorchannel)
            .then(m => message.channel.send(embed));
          message.guild.members.get(usermentioned).send(embed);
        } else {
          message.channel.send(
            "`You Cant Move" +
              message.mentions.members.first() +
              " `The User Should Be In channel To Move It`"
          );
        }
      } else {
        message.channel.send(
          "**``You Should Be In Room Voice To Move SomeOne``**"
        );
      }
    } else {
      message.react("❌");
    }
  }
});


client.on("message", async message => {
  let messageArray = message.content.split(" ");
  let args = messageArray.slice(1);
  if (message.content.startsWith(prefix + "invinfo")) {
    if (!args) return message.reply("**Please, Type the invite**");
    message.guild.fetchInvites().then(i => {
      let inv = i.get(args[0]);
      if (!inv)
        return message.reply(
          `${args}` +
            "Please Use: `invinfo` + `Invite` , **Ex:** ( &invinfo AzAu3bm ) *!*"
        );
      var iNv = new Discord.RichEmbed()
        .setColor("#a21b1b")
        .setTitle("FoxyTools ")
        .addField("⍣``Invite Maker``", inv.inviter)
        .addField(
          "⍣``Expiration Date``",
          moment(inv.expiresAt).format("YYYY/M/DD:h")
        )
        .addField(
          "⍣``Date of Creation``",
          moment(inv.createdAt).format("YYYY/M/DD:h")
        )
        .addField("⍣``Number of Uses``", inv.uses || inv.maxUses)
        .setThumbnail("https://imgur.com/75LCb7g.png");
      message.channel.send(iNv);
    });
  }
});

client.on("message", message => {
  let args = message.content.split(" ");
  if (args[0].toLowerCase() == `${prefix}help`) {
    const emb = new Discord.RichEmbed()
      .setColor("#a21b1b")
      .setImage("https://d.top4top.io/p_1734jjry91.gif")
      .setDescription(
        `
> **Moderation Commands** 🔰
+ban | +unban | +mute | +unmute | +lock | +unlock | +vlock | +vunlock | +move | +clear

> **Music Commands** 🎶
+play | +stop | +skip | +pause | +forceskip | +Queue | +skipto | +Volume | +np | +repeat

> **Protection Commands** 🛡️
+antibots on/off | +antihack on/off

> **Economy Commands** 💳
+credits | +daily | +tax

> **Ticket Commands** 🎫
+mtickets | +new | +close | +add | +remove

> **Games & Fun Command** 🎲
+memes | +love | +xo | +slots

> **Utilities** 🛠
+avatar | +user | +ping | +roll | +invite | +invites | +server | +report | +allbots

[**invite**](https://discord.com/oauth2/authorize?client_id=758243946488397824&permissions=8&scope=bot) **|** [**Support**](https://discord.gg/pg4wUus)  📎
`)
.setFooter(`(Message is going to be deleted in 50s)`)
    .setFooter('Requested by' + message.author.username)
    message.channel.send(emb).then(m => m.delete(50000))
  }
});


client.on("message", msg => {
  var prefix = "+";
  if (msg.content.startsWith(prefix + "report")) {
    var mention = msg.mentions.members.first();
    var args = msg.content.split(" ").slice(2);
    var args2 = args.join(" ");
    if (!mention)
      return msg.reply(
        "**Foxy :** *You need to mention the user you want to report !*  ``` Report <User:Mention> [Report subject:Text] ```"
      );
    if (!args2)
      return msg.reply(
        "**Foxy:** *You need to mention the reason for the report !* ``` Report <User:Mention> [Report subject:Text] ```"
      );
    var channel = msg.guild.channels.find(chann => chann.name === "Foxy-reports");

    channel.send(`**A new report has been submitted**`);
    channel.send(`<@656258269500669982> , <@453025587888652290> , <@>`);
    channel.send(`**Report author :**<@${msg.author.id}> `);
    channel.send(`**Reported :**<@${mention.id}> `);
    channel.send(`**Report subject :** \`\`${args2}\`\``);
    msg.channel.send(
      `**Foxy :** :white_check_mark: *The report has been sent !*`
    );
  }
});

client.on("message", message => {
  if (!message.channel.guild) return;
  if (message.content == prefix + "allbots") {
    if (message.author.bot) return;
    let i = 1;
    const botssize = message.guild.members
      .filter(m => m.user.bot)
      .map(m => `${i++} - <@${m.id}>`);
    const embed = new Discord.RichEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL)
      .setDescription(
        `**Found ${
          message.guild.members.filter(m => m.user.bot).size
        } bots in FoxyBot**
${botssize.join("\n")}`
      )
      .setFooter(client.user.username, client.user.avatarURL);
    message.channel.send(embed);
  }
});

////antihack

let antihack = JSON.parse(fs.readFileSync('./antihack.json' , 'utf8'));
client.on('message', message => { 
    if(message.content.startsWith(prefix + "antihack")) { 
        if(!message.channel.guild) return message.reply('**This Command Only For Servers**'); 
        if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('**Sorry But You Dont Have Permission** `MANAGE_GUILD`' ); 
        if(!antihack[message.guild.id]) antihack[message.guild.id] = { 
          onoff: 'Off'
        } 
          if(antihack[message.guild.id].onoff === 'Off') return [message.channel.send(`**✅ The AntiHack Is __𝐎𝐍__ !**`), antihack[message.guild.id].onoff = 'On']
          if(antihack[message.guild.id].onoff === 'On') return [message.channel.send(`**⛔ The AntiHack Is __𝐎𝐅𝐅__ !**`), antihack[message.guild.id].onoff = 'Off']
          fs.writeFile("./antihack.json", JSON.stringify(antihack), (err) => {
            if (err) console.error(err)
            .catch(err => {
              console.error(err);
          });
            });
          }
 
        });
        

///antibots

let antibots = JSON.parse(fs.readFileSync('./antibots.json' , 'utf8'));//require antihack.json file
  client.on('message', message => {
    
      if(message.content.startsWith(prefix + "antibots on")) {
          if(!message.channel.guild) return;
          if(!message.member.hasPermission('ADMINISTRATOR')) return;
  antibots[message.guild.id] = {
  onoff: 'On',
  }
  message.channel.send(`** ✅ AntiBots Join Is On**`)
            fs.writeFile("./antibots.json", JSON.stringify(antibots), (err) => {
              if (err) console.error(err)
              .catch(err => {
                console.error(err);
            });
              });
            }
    
          })

  client.on('message', message => {
    if(message.content.startsWith(prefix + "antibots off")) {
          if(!message.channel.guild) return;
          if(!message.member.hasPermission('ADMINISTRATOR')) return;
  antibots[message.guild.id] = {
  onoff: 'Off',
  }
  message.channel.send(`** ⛔ AntiBots Join Is Off**`)
            fs.writeFile("./antibots.json", JSON.stringify(antibots), (err) => {
              if (err) console.error(err)
              .catch(err => {
                console.error(err);
            });
              });
            }
  
          })
  
  client.on("guildMemberAdd", member => {
    if(!antibots[member.guild.id]) antibots[member.guild.id] = {
  onoff: 'Off'
  }
    if(antibots[member.guild.id].onoff === 'Off') return;
  if(member.user.bot) return member.kick()
  })
  
  fs.writeFile("./antibots.json", JSON.stringify(antibots), (err) => {
  if (err) console.error(err)
  .catch(err => {
  console.error(err);
  });
  
  });

client.on("message", message => {
  var args = message.content.split(" ");
  var command = args[0];
  var num = args[1];
  var tax = 5.2; //غير قيمة الضريبة من هنا
  if (command == prefix + "tax") {
    let nume = new Discord.RichEmbed()
      .setColor('RED')
      .setDescription(command + " <number>");
    if (!num) {
      return message.channel.send(nume);
    }
    var numerr = Math.floor(num);
    if (numerr < 0 || numerr == NaN || !numerr) {
      return message.reply("**The value must be correct.**");
    }
    var taxval = Math.floor(numerr * (tax / 100));
    var amount = Math.floor(numerr - taxval);
    var amountfinal = Math.floor(numerr + taxval );
    let taxemb = new Discord.RichEmbed()
      .setTitle("Foxy Tax")
      .setColor('RED')
      .setThumbnail(client.user.displayAvatarURL)
      .setDescription(`المبلغ الأساسي: **${numerr}**\nضريبة: **${tax}%**\nقيمة الضريبة: **${taxval}**\nالمبلغ مع الضريبة: **${amount}**\nالمبلغ الواجب دفعه: **${amountfinal}**`)
      .setTimestamp()
      .setFooter(`Devlloped By BadBoy17`);
    message.channel.send(taxemb);
  }
});


client.on("message", message => {
  if (message.content.startsWith(prefix + "love")) {
    let user = message.mentions.users.first();
    if (!user) {
      return message.channel.send("💋 Mention the person you want to love");
    }
    let slaps = [
      "https://cdn.discordapp.com/attachments/747092964613816330/748548024573362287/screen-3.jpg"
    ];

    message.channel
      .send({
        embed: {
          description: `${message.author.username} ** Gave a 💋love to ** ${user.username}!`,
          image: {
            url: slaps[Math.floor(Math.random() * slaps.length)]
          }
        }
      })
      .catch(e => {
        client.log.error(e);
      });
  }
});

client.on("message", message => {
  if (message.content.startsWith("+slap")) {
    let user = message.mentions.users.first();
    if (!user) {
      return message.emit("commandUsage", message, this.help);
    }
    let slaps = [
      "https://imgur.com/gallery/DVft5D6",
      "https://giphy.com/gifs/Gf3AUz3eBNbTW/html5",
      "https://i.giphy.com/media/j3iGKfXRKlLqw/giphy.gif",
      "https://i.giphy.com/media/2M2RtPm8T2kOQ/giphy.gif",
      "https://media.giphy.com/media/1zgOyLCRxCmV5G3GFZ/giphy.gif",
      "https://media.giphy.com/media/3oEdv1Rdmo0Vd0YdW0/giphy.gif",
      "https://media.giphy.com/media/eIRFsjX4LULXa/giphy.gif",
      "https://media.giphy.com/media/LImd5H5oQ7Oms/giphy.gif",
      "https://i.giphy.com/media/l3YSimA8CV1k41b1u/giphy.gif",
      "https://media.giphy.com/media/81kHQ5v9zbqzC/giphy.gif",
      "https://media.giphy.com/media/QYT2VEOXVyVmE/giphy.gif",
      "https://media.giphy.com/media/xUNd9HZq1itMkiK652/giphy.gif",
      "https://media.giphy.com/media/xXRDuvEcMA2JO/giphy.gif",
      "https://media.giphy.com/media/zRlGxKCCkatIQ/giphy.gif",
      "https://media.giphy.com/media/9U5J7JpaYBr68/giphy.gif",
      "https://media.giphy.com/media/q0uYk5uwJVFug/giphy.gif",
      "https://media.giphy.com/media/iREUC7qrjN4vC/giphy.gif",
      "https://media.giphy.com/media/AkKEOnHxc4IU0/giphy.gif",
      "https://media.giphy.com/media/6Fad0loHc6Cbe/giphy.gif",
      "https://media.giphy.com/media/prKt29rL7zAbe/giphy.gif",
      "https://media.giphy.com/media/LeTDEozJwatvW/giphy.gif",
      "https://media.giphy.com/media/6UTkJXBd26qiI/giphy.gif",
      "https://media.giphy.com/media/VEmm8ngZxwJ9K/giphy.gif",
      "https://media.giphy.com/media/EtdEOL3MbPbmE/giphy.gif",
      "https://media.giphy.com/media/CIvfqJqBbvliU/giphy.gif",
      "https://media.giphy.com/media/3pSKnxaDzl9Oo/giphy.gif",
      "https://media.giphy.com/media/1iw7RG8JbOmpq/giphy.gif",
      "https://media.giphy.com/media/m0VwgrO5yXxQY/giphy.gif",
      "https://media.giphy.com/media/2o855hr1xVotO/giphy.gif",
      "https://media.giphy.com/media/URBigLkgWoYzS/giphy.gif",
      "https://media.giphy.com/media/pGOdXNi6J7ML6/giphy.gif",
      "https://media.giphy.com/media/HHUd5nOFbSYtG/giphy.gif",
      "https://media.giphy.com/media/TZp6XSDusOnXG/giphy.gif",
      "https://media.giphy.com/media/wqP5TOFnOMwqQ/giphy.gif",
      "https://i.giphy.com/media/WLXO8OZmq0JK8/giphy.gif"
    ];

    message.channel
      .send({
        embed: {
          description: `${message.author.username} I'm about to pen you. ${user.username}!`,
          image: {
            url: slaps[Math.floor(Math.random() * slaps.length)]
          }
        }
      })
      .catch(e => {
        client.log.error(e);
      });
  }
});

client.on("message", message => {
  if (message.content.startsWith("+hug")) {
    let user = message.mentions.users.first();
    if (!user) {
      return message.emit("commandUsage", message, this.help);
    }
    let hugs = [
      "https://media.giphy.com/media/od5H3PmEG5EVq/giphy.gif",
      "https://media.giphy.com/media/KL7xA3fLx7bna/giphy.gif",
      "https://media.giphy.com/media/1dOH0aFZz3LyVVEMn9/giphy.gif",
      "https://media.giphy.com/media/yidUzriaAGJbsxt58k/giphy.gif",
      "https://media.giphy.com/media/26FeTvBUZErLbTonS/giphy.gif",
      "https://media.giphy.com/media/xT0Gqne4C3IxaBcOdy/giphy.gif",
      "https://media.giphy.com/media/eMIGPdZ77kPgD7nf4j/giphy.gif",
      "https://media.giphy.com/media/13YrHUvPzUUmkM/giphy.gif",
      "https://media.giphy.com/media/wnsgren9NtITS/giphy.gif",
      "https://media.giphy.com/media/qscdhWs5o3yb6/giphy.gif",
      "https://media.giphy.com/media/hi0VuTUqLrmuc/giphy.gif",
      "https://media.giphy.com/media/xJlOdEYy0r7ZS/giphy.gif",
      "https://media.giphy.com/media/7WQQXPg6o3YNa/giphy.gif",
      "https://media.giphy.com/media/LWTxLvp8G6gzm/giphy.gif",
      "https://media.giphy.com/media/xZshtXrSgsRHy/giphy.gif",
      "https://media.giphy.com/media/BXrwTdoho6hkQ/giphy.gif",
      "https://media.giphy.com/media/10BcGXjbHOctZC/giphy.gif",
      "https://media.giphy.com/media/49mdjsMrH7oze/giphy.gif",
      "https://media.giphy.com/media/xUPGcgtKxm4PADy3Cw/giphy.gif",
      "https://media.giphy.com/media/JTjSlqiz63j5m/giphy.gif",
      "https://media.giphy.com/media/aD1fI3UUWC4/giphy.gif",
      "https://media.giphy.com/media/5eyhBKLvYhafu/giphy.gif",
      "https://media.giphy.com/media/ddGxYkb7Fp2QRuTTGO/giphy.gif",
      "https://media.giphy.com/media/pXQhWw2oHoPIs/giphy.gif",
      "https://media.giphy.com/media/ZRI1k4BNvKX1S/giphy.gif",
      "https://media.giphy.com/media/ZQN9jsRWp1M76/giphy.gif",
      "https://media.giphy.com/media/s31WaGPAmTP1e/giphy.gif",
      "https://media.giphy.com/media/wSY4wcrHnB0CA/giphy.gif",
      "https://media.giphy.com/media/aVmEsdMmCTqSs/giphy.gif",
      "https://media.giphy.com/media/C4gbG94zAjyYE/giphy.gif",
      "https://media.giphy.com/media/ArLxZ4PebH2Ug/giphy.gif",
      "https://media.giphy.com/media/kFTKQfjK4ysZq/giphy.gif",
      "https://media.giphy.com/media/vVA8U5NnXpMXK/giphy.gif",
      "https://media.giphy.com/media/2q2qHJu838EyQ/giphy.gif",
      "https://media.giphy.com/media/q3kYEKHyiU4kU/giphy.gif",
      "https://media.giphy.com/media/3ZnBrkqoaI2hq/giphy.gif",
      "https://media.giphy.com/media/ExQqjagJBoECY/giphy.gif",
      "https://media.giphy.com/media/3o6Yg5fZCGeFArIcbm/giphy.gif"
    ];

    message.channel
      .send({
        embed: {
          description: `${message.author.username} Give you a hug  ${user.username}!`,
          image: {
            url: hugs[Math.floor(Math.random() * hugs.length)]
          }
        }
      })
      .catch(e => {
        client.log.error(e);
      });
  }
});


client.on("message", message => {
  if (message.content.startsWith("+kiss")) {
    let user = message.mentions.users.first();
    if (!user) {
      return message.emit("commandUsage", message, this.help);
    }
    var kiss = [
      "https://media.giphy.com/media/dP8ONh1mN8YWQ/giphy.gif",
      "https://media.giphy.com/media/KMuPz4KDkJuBq/giphy.gif",
      "https://media.giphy.com/media/3o7TKzkCiuW3E0Gn4Y/giphy.gif",
      "https://media.giphy.com/media/HKQZgx0FAipPO/giphy.gif",
      "https://media.giphy.com/media/PFjXmKuwQsS9q/giphy.gif",
      "https://media.giphy.com/media/CzCi6itPr3yBa/giphy.gif",
      "https://media.giphy.com/media/hnNyVPIXgLdle/giphy.gif",
      "https://media.giphy.com/media/bGm9FuBCGg4SY/giphy.gif",
      "https://media.giphy.com/media/G3va31oEEnIkM/giphy.gif",
      "https://media.giphy.com/media/G3va31oEEnIkM/giphy.gif",
      "https://media.giphy.com/media/BaEE3QOfm2rf2/giphy.gif",
      "https://media.giphy.com/media/OSq9souL3j5zW/giphy.gif",
      "https://giphy.com/gifs/kiss-anime-nISHppsUAzosMhttps://media.giphy.com/media/nISHppsUAzosM/giphy.gif",
      "https://media.giphy.com/media/ll5leTSPh4ocE/giphy.gif",
      "https://media.giphy.com/media/10r6oEoT6dk7E4/giphy.gif",
      "https://media.giphy.com/media/YC4QEtFmz64sE/giphy.gif",
      "https://media.giphy.com/media/KH1CTZtw1iP3W/giphy.gif",
      "https://media.giphy.com/media/flmwfIpFVrSKI/giphy.gif",
      "https://media.giphy.com/media/Z21HJj2kz9uBG/giphy.gif",
      "https://media.giphy.com/media/mGAzm47irxEpG/giphy.gif",
      "https://media.giphy.com/media/JynbO9pnGxPrO/giphy.gif",
      "https://media.giphy.com/media/7z1xs4Fl9Kb8A/giphy.gif",
      "https://media.giphy.com/media/EP9YxsbmbplIs/giphy.gif",
      "https://media.giphy.com/media/q7MxQyarcDHDW/giphy.gif",
      "https://media.giphy.com/media/uSHX6qYv1M7pC/giphy.gif",
      "https://media.giphy.com/media/EVODaJHSXZGta/giphy.gif",
      "https://media.giphy.com/media/EVODaJHSXZGta/giphy.gif",
      "https://media.giphy.com/media/fHtb1JPbfph72/giphy.gif",
      "https://media.giphy.com/media/pwZ2TLSTouCQw/giphy.gif",
      "https://media.giphy.com/media/DfzHC09hY64Gk/giphy.gif",
      "https://media.giphy.com/media/l0MYB8Ory7Hqefo9a/giphy.gif",
      "https://media.giphy.com/media/Y9iiZdUaNRF2U/giphy.gif",
      "https://media.giphy.com/media/CTo4IKRN4l4SA/giphy.gif",
      "https://media.giphy.com/media/jR22gdcPiOLaE/giphy.gif",
      "https://media.giphy.com/media/pFg4Ko6pXqQVy/giphy.gif"
    ];

    message.channel
      .send({
        embed: {
          description: `${message.author.username} give you a kiss ${user.username}!`,
          image: {
            url: kiss[Math.floor(Math.random() * kiss.length)]
          }
        }
      })
      .catch(e => {
        client.log.error(e);
      });
  }
});

client.on("message", async message => {
  if (message.content.startsWith(prefix + "meme")) {
    let number = Math.floor(Math.random() * 400);
    if (number > 500) number--;
    message.channel.send(`https://ctk-api.herokuapp.com/meme/${number}`);
  }
});

client.on("message", async message => {
  if (message.content.includes("discord.gg")) {
    if (message.member.hasPermission("MANAGE_GUILD")) return;
    if (!message.channel.guild) return;
    message.delete();
    var command = message.content.split(" ")[0];
    let muterole = message.guild.roles.find(`name`, "Muted");
    if (!muterole) {
      try {
        muterole = await message.guild.createRole({
          name: "Muted",
          color: "#000000",
          permissions: []
        });
        message.guild.channels.forEach(async (channel, id) => {
          await channel.overwritePermissions(muterole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          });
        });
      } catch (e) {
        console.log(e.stack);
      }
    }
    if (!message.channel.guild)
      return message.reply("** This command only for servers**");
    message.member.addRole(muterole);
    const embed500 = new Discord.RichEmbed()
      .setTitle("Muted Ads")
      .addField(
        `**  You Have Been Muted **`,
        `**Reason : Sharing Another Discord Link**`
      )
      .setColor("041881")
      .setThumbnail(`${message.author.avatarURL}`)
      .setAuthor(message.author.username, message.author.avatarURL)
      .setFooter(`${message.guild.name} `);
    message.channel.send(embed500);
    message.author.send(
      "` You are being punished. Chatty die for publishing servers if it was by mistake. ** P ** Talk to the administration `"
    );
  }
});

client.on("message", message => {
  if (message.content === "+invite") {
    message.channel.send("**check prv bro😉**").then(msg => {
      msg.edit("why you wait men go go ");
    });
    message.channel
      .createInvite({
        thing: true,
        maxUses: 10,
        maxAge: 86400
      })
      .then(invite => message.author.sendMessage(invite.url));
  }
});

const Canvas = require('canvas')
const devs = '656258269500669982'



const credits = JSON.parse(fs.readFileSync("./credits.json"));
var time = require("./time.json");
client.on("message", async message => {
  if (message.author.bot || message.channel.type === "dm") return;
  let args = message.content.split(" ");
  let author = message.author.id;
  if (!credits[author])
    credits[author] = {
      credits: 0
    };
  fs.writeFileSync("./credits.json", JSON.stringify(credits, null, 4));
  if (args[0].toLowerCase() == `${prefix}credits`) {
    const mention = message.mentions.users.first() || message.author;
    const mentionn = message.mentions.users.first();
    if (!args[2]) {
      message.channel.send(
        `**${mention.username}, your :credit_card: balance is \`$${credits[mention.id].credits}\`**`
      );
    } else if (mentionn && args[2]) {
      if (isNaN(args[2])) return message.channel.send(`**:x: | Error**`);
      if (args[2] < 1) return message.channel.send(`**:x: | Error**`);
      if (mention.bot) return message.channel.send(`**:x: | Error**`);
      if (mentionn.id === message.author.id)
        return message.channel.send(`**:x: | Error**`);
      if (args[2] > credits[author].credits)
        return message.channel.send(
          `**:x: | Error , You Don't Have Enough Credit**`
        );
      if (args[2].includes("-")) return message.channel.send(`**:x: | Error**`);
      let resulting = Math.floor(args[2] - args[2] * (5 / 100));
      let tax = Math.floor(args[2] * (5 / 100));
      let first = Math.floor(Math.random() * 9);
      let second = Math.floor(Math.random() * 9);
      let third = Math.floor(Math.random() * 9);
      let fourth = Math.floor(Math.random() * 9);
      let num = `${first}${second}${third}${fourth}`;
      let canvas = Canvas.createCanvas(108, 40);
      let ctx = canvas.getContext("2d");
      const background = await Canvas.loadImage(
        "https://cdn.discordapp.com/attachments/608278049091223552/617791172810899456/hmmm.png"
      );
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      ctx.font = "20px Arial Bold";
      ctx.fontSize = "20px";
      ctx.fillStyle = "#ffffff";
      message.channel
        .send(
          `**${
            message.author.username
          }, Transfer Fees: \`${tax}\`, Amount: \`$${resulting.toLocaleString()}\`**
type these numbers to confirm: `
        )
        .then(essss => {
          ctx.fillText(num, canvas.width / 2.4, canvas.height / 1.7);
          message.channel.sendFile(canvas.toBuffer()).then(m => {
            message.channel
              .awaitMessages(r => r.author.id === message.author.id, {
                max: 1,
                time: 20000,
                errors: ["time"]
              })
              .then(collected => {
                if (collected.first().content === num) {
                  message.channel.send(
                    `**:moneybag: | ${
                      message.author.username
                    }, Done Trans \`$${resulting.toLocaleString()}\` To ${mentionn}**`
                  );
                  mention.send(
                    `**:money_with_wings: | Transfer Receipt \`\`\`You Have Received \`$${resulting.toLocaleString()}\` From User ${
                      message.author.username
                    }; (ID (${message.author.id})\`\`\``
                  );
                  m.delete();
                  credits[author].credits += Math.floor(
                    -resulting.toLocaleString()
                  );
                  credits[mentionn.id].credits += Math.floor(
                    +resulting.toLocaleString()
                  );
                  fs.writeFileSync(
                    "./credits.json",
                    JSON.stringify(credits, null, 4)
                  );
                } else {
                  m.delete();
                  essss.delete();
                }
              });
          });
        });
    } else {
      message.channel.send(
        `**:x: | Error , Please Command True Ex: \`${prefix}credits [MentionUser] [Balance]\`**`
      );
    }
  }
  if (args[0].toLowerCase() === `${prefix}daily`) {
    let cooldown = 8.64e7;
    let Daily = time[message.author.id];
    if (Daily !== null && cooldown - (Date.now() - Daily) > 0) {
      let times = cooldown - (Date.now() - Daily);
      message.channel.send(
        `**:stopwatch: |  ${
          message.author.username
        }, your daily :dollar: credits refreshes in ${pretty(times, {
          verbose: true
        })}.**`
      );
      fs.writeFile("./time.json", JSON.stringify(time), function(e) {
        if (e) throw e;
      });
    } else {
      let ammount = (300, 500, 100, 200, 120, 150, 350, 320, 220, 250);
      credits[author].credits += ammount;
      time[message.author.id] = Date.now();
      message.channel.send(
        `**:atm:  | ${message.author.username}, you received your :yen: ${ammount} daily credits!**`
      );
      fs.writeFile("./credits.json", JSON.stringify(credits), function(e) {
        if (e) throw e;
      });
    }
  }
}); // Me ZIAD كم حاقد

client.on("message", async message => {
  let Fire = message.content.split(" ")[0].substring(prefix.length);
  let mention = message.mentions.users.first() || message.author;
  if (Fire === "addcredits") {
    let args = message.content.split(" ");
    if (!devs.includes(message.author.id)) return;
    if (!args[1] || isNaN(args[1])) return message.reply("**Type Credit**");
    if (!credits[mention.id]) return;
    credits[mention.id].credits += +args[1];
    fs.writeFileSync("./credits.json", JSON.stringify(credits));
    console.log(credits[mention.id]);
    message.reply(`**, Adedd Money For : \`${args[1]}\`Done`);
  } else if (Fire === "removecredits") {
    let args = message.content.split(" ");
    if (!devs.includes(message.author.id)) return;
    if (!args[1] || isNaN(args[1])) return message.reply("**Type Credit**");
    if (!credits[mention.id]) return;
    credits[mention.id].credits += -args[1];
    fs.writeFileSync("./credits.json", JSON.stringify(credits));
    console.log(credits[mention.id]);
    message.reply(`**, Remove Money For : \`${args[1]}\`**`);
  }
});

client.on("message", message => {
  var prefix = "+";
  if (message.author.bot) return;

  if (message.content.startsWith(prefix + "xo")) {
    let array_of_mentions = message.mentions.users.array();
    let symbols = [":o:", ":heavy_multiplication_x:"];
    var grid_message;

    if (array_of_mentions.length == 1 || array_of_mentions.length == 2) {
      let random1 = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
      let random2 = Math.abs(random1 - 1);
      if (array_of_mentions.length == 1) {
        random1 = 0;
        random2 = 0;
      }
      var player1_id = message.author.id;
      let player2_id = array_of_mentions[random2].id;
      var turn_id = player1_id;
      var symbol = symbols[0];
      let initial_message = `Game match between <@${player1_id}> and <@${player2_id}>!`;
      if (player1_id == player2_id) {
        initial_message += "\n_( Play with yourself)_";
      }
      message.channel
        .send(`Xo ${initial_message}`)
        .then(console.log("Successful tictactoe introduction"))
        .catch(console.error);
      message.channel
        .send(
          ":one::two::three:" +
            "\n" +
            ":four::five::six:" +
            "\n" +
            ":seven::eight::nine:"
        )
        .then(new_message => {
          grid_message = new_message;
        })
        .then(console.log("Successful tictactoe game initialization"))
        .catch(console.error);
      message.channel
        .send("You must wait where it is approved")
        .then(async new_message => {
          await new_message.react("1⃣");
          await new_message.react("2⃣");
          await new_message.react("3⃣");
          await new_message.react("4⃣");
          await new_message.react("5⃣");
          await new_message.react("6⃣");
          await new_message.react("7⃣");
          await new_message.react("8⃣");
          await new_message.react("9⃣");
          await new_message.react("🆗");
          await new_message
            .edit(`It\'s <@${turn_id}>\'s turn! Your symbol is ${symbol}`)
            .then(new_new_message => {
              require("./xo.js")(
                client,
                message,
                new_new_message,
                player1_id,
                player2_id,
                turn_id,
                symbol,
                symbols,
                grid_message
              );
            })
            .then(console.log("Successful tictactoe listener initialization"))
            .catch(console.error);
        })
        .then(console.log("Successful tictactoe react initialization"))
        .catch(console.error);
    } else {
      message
        .reply(`tag with whom you want to play`)
        .then(console.log("Successful error reply"))
        .catch(console.error);
    }
  }
});


client.on("message", message => {
  if (message.content.startsWith("+boom")) {
    let user = message.mentions.users.first();
    if (!user) {
      return message.emit("commandUsage", message, this.help);
    }
    let bombs = [
      "https://media.giphy.com/media/Xp98Vi5OBvhXpwA0Zp/giphy.gif",
      "https://media.giphy.com/media/POnwee2RZBWmWWCeiX/giphy.gif",
      "https://media.giphy.com/media/oywQ7OhnYupINQa0L4/giphy.gif",
      "https://media.giphy.com/media/5aLrlDiJPMPFS/giphy.gif",
      "https://media.giphy.com/media/l1BgS9aNtdCdjgkaQ/giphy.gif",
      "https://media.giphy.com/media/d0NnEG1WnnXqg/giphy.gif",
      "https://media.giphy.com/media/NmrqUdwGXPOog/giphy.gif",
      "https://media.giphy.com/media/dpnfPvaCIHBrW/giphy.gif",
      "https://media.giphy.com/media/mks5DcSGjhQ1a/giphy.gif",
      "https://media.giphy.com/media/8wfoaIjVc0FBaLu5xH/giphy.gif",
      "https://media.giphy.com/media/xThtanBNixj1O1m5oY/giphy.gif",
      "https://media.giphy.com/media/fdGkCOiM0oOqI/giphy.gif",
      "https://media.giphy.com/media/c862b2dAhJXYA/giphy.gif",
      "https://media.giphy.com/media/CepTYjGRbV1ba/giphy.gif",
      "https://media.giphy.com/media/sRGCQ7INgSD0qbTqB5/giphy.gif",
      "https://media.giphy.com/media/ZJYOwl8SbFsic/giphy.gif",
      "https://media.giphy.com/media/3oEhmKspQX9EN48HNm/giphy.gif",
      "https://media.giphy.com/media/l1KVcAP6jvP9r4MaA/giphy.gif",
      "https://media.giphy.com/media/j2mY6orBJqAdG/giphy.gif",
      "https://media.giphy.com/media/3oz8xEqn8AGAQbR0yY/giphy.gif",
      "https://media.giphy.com/media/l4lQW9KfRQscU0ds4/giphy.gif",
      "https://media.giphy.com/media/XathaB5ILqSME/giphy.gif",
      "https://media.giphy.com/media/26AHvF2p5pridaSf6/giphy.gif",
      "https://media.giphy.com/media/Nlur5uO8GkjC0/giphy.gif",
      "https://media.giphy.com/media/l1J3preURPiwjRPvG/giphy.gif",
      "https://media.giphy.com/media/8cdZit2ZcjTri/giphy.gif",
      "https://media.giphy.com/media/3o7btNa0RUYa5E7iiQ/giphy.gif",
      "https://media.giphy.com/media/V88pTEefkoOFG/giphy.gif",
      "https://media.giphy.com/media/rfWAomOTPeOo8/giphy.gif"
    ];

    message.channel
      .send({
        embed: {
          description: `${message.author.username} The forehead has been successfully flown, your forehead has flown${user.username}!`,
          image: {
            url: bombs[Math.floor(Math.random() * bombs.length)]
          }
        }
      })
      .catch(e => {
        client.log.error(e);
      });
  }
});

client.login("NzU4MjQzOTQ2NDg4Mzk3ODI0.X2sHtA.y3NV1eHuWJJoONHTi_jlUad7Ghc");
