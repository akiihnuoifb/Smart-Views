module.exports.config = {
	name: "inf",
	version: "1.0.1", 
	hasPermssion: 0,
	credits: "MrTomXxX", //don't change the credits please
	description: "Admin and Bot info.",
	commandCategory: "...",
	cooldowns: 1,
	dependencies: 
	{
    "request":"",
    "fs-extra":"",
    "axios":""
  }
};
module.exports.run = async function({ api,event,args,client,Users,Threads,__GLOBAL,Currencies }) {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
const time = process.uptime(),
		hours = Math.floor(time / (60 * 60)),
		minutes = Math.floor((time % (60 * 60)) / 60),
		seconds = Math.floor(time % 60);
const moment = require("moment-timezone");
var juswa = moment.tz("Asia/Dhaka").format("『D/MM/YYYY』 【HH:mm:ss】");
var link = ["https://i.imgur.com/afSpOv6.gif", "https://i.postimg.cc/rpLppqWX/IMG-20250503-182404.jpg", "https://i.postimg.cc/rpLppqWX/IMG-20250503-182404.jpg", "https://i.postimg.cc/rpLppqWX/IMG-20250503-182404.jpg", "https://i.postimg.cc/rpLppqWX/IMG-20250503-182404.jpg", "https://i.postimg.cc/rpLppqWX/IMG-20250503-182404.jpg", "https://i.postimg.cc/rpLppqWX/IMG-20250503-182404.jpg", "https://i.postimg.cc/rpLppqWX/IMG-20250503-182404.jpg"];
var callback = () => api.sendMessage({body:`✦𝗔𝗗𝗠𝗜𝗠 𝗔𝗡𝗗 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡✦

⁂BoT NaMe ⊂◉‿◉: ${global.config.BOTNAME}

✡BoT Prefix ◉‿◉: ${global.config.PREFIX}

༻𝐎𝐖𝐍𝐄𝐑:- ☞ABIR HASAN☜ ༺
༒𝚈𝚘𝚞 𝙲𝚊𝚗 𝙲𝚊𝚕𝚕 𝙷𝚒𝚖 〠ABIR〠.༒

༒𝐇𝐢𝐬 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐢𝐝༒:- ☞ https://www.facebook.com/ABIRMAHMMUD1344 ☜ 

༻WEBSITE 𝘭𝘪𝘯𝘬༺:- 
☞ https://abir7109.github.io/cyberabir/ ☜

֎𝘍𝘰𝘳 𝘈𝘯𝘺 𝘒𝘪𝘯𝘥 𝘖𝘧 𝘏𝘦𝘭𝘱 ֍:-

 ֎𝘊𝘰𝘯𝘵𝘢𝘤𝘵 𝘔𝘦 𝘖𝘯 𝘞𝘩𝘢𝘵𝘴𝘈𝘱𝘱֍ :-  ☞+8801919069898 ☜
 
➟UPTIME☆

✬Today Is: ${juswa} 

➳BoT Is Running ${hours}:${minutes}:${seconds}.

✫Thanks For Using ${global.config.BOTNAME} BoT!`,attachment: fs.createReadStream(__dirname + "/cache/juswa.jpg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/juswa.jpg")); 
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/juswa.jpg")).on("close",() => callback());
   };;
