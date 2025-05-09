module.exports.config = {
  name: "inf",
  version: "1.0.1", 
  hasPermssion: 0,
  credits: "MrTomXxX", // please keep the credits intact
  description: "Admin and Bot info.",
  commandCategory: "...",
  cooldowns: 1,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async function({ api, event, args, client, Users, Threads, __GLOBAL, Currencies }) {
  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];
  const time = process.uptime(),
        hours = Math.floor(time / (60 * 60)),
        minutes = Math.floor((time % (60 * 60)) / 60),
        seconds = Math.floor(time % 60);
  const moment = require("moment-timezone");
  const juswa = moment.tz("Asia/Dhaka").format("『D/MM/YYYY』 【HH:mm:ss】");

  // Array of image URLs for dynamic backgrounds.
  const link = [
    "https://i.imgur.com/afSpOv6.gif", 
    "https://i.postimg.cc/rpLppqWX/IMG-20250503-182404.jpg", 
    "https://i.postimg.cc/rpLppqWX/IMG-20250503-182404.jpg", 
    "https://i.postimg.cc/rpLppqWX/IMG-20250503-182404.jpg", 
    "https://i.postimg.cc/rpLppqWX/IMG-20250503-182404.jpg", 
    "https://i.postimg.cc/rpLppqWX/IMG-20250503-182404.jpg", 
    "https://i.postimg.cc/rpLppqWX/IMG-20250503-182404.jpg", 
    "https://i.postimg.cc/rpLppqWX/IMG-20250503-182404.jpg"
  ];

  // Constructing a message with a square border and interactive emojis.
  const message = `
╔════════════════════════════════════╗
║        **ADMIN & BOT INFORMATION**        ║
╠════════════════════════════════════╣
║ 📌 **Bot Name:** ${global.config.BOTNAME}                
║ 📌 **Bot Prefix:** ${global.config.PREFIX}               
╠════════════════════════════════════╣
║ 👑 **Owner:** ABIR HASAN                    
║ 🔗 **Facebook:** [Visit](https://www.facebook.com/ABIRMAHMMUD1344)        
║ 🌐 **Website:** [Explore](https://abir7109.github.io/cyberabir/)          
║ 📞 **Contact:** +8801919069898              
╠════════════════════════════════════╣
║ ⏱ **Uptime:** ${hours}h : ${minutes}m : ${seconds}s       
║ 🗓 **Today is:** ${juswa}      
╠════════════════════════════════════╣
║ ❤️ **Thanks for using ${global.config.BOTNAME} Bot!**       
╚════════════════════════════════════╝
`;

  // Callback to send the message with an attached image, then remove the cached image.
  var callback = () => api.sendMessage(
    {
      body: message,
      attachment: fs.createReadStream(__dirname + "/cache/juswa.jpg")
    },
    event.threadID,
    () => fs.unlinkSync(__dirname + "/cache/juswa.jpg")
  );

  // Download a random background image then trigger the callback.
  return request(encodeURI(link[Math.floor(Math.random() * link.length)]))
    .pipe(fs.createWriteStream(__dirname + "/cache/juswa.jpg"))
    .on("close", () => callback());
};
