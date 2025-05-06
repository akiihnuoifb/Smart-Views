const axios = require("axios");
const fs = require("fs-extra");

const loz = [
  "https://i.imgur.com/aE2idak.png",
  "https://i.imgur.com/h4xef15.png",
  "https://i.imgur.com/NtKGQY7.png",
  "https://i.imgur.com/HxKGOLo.png",
  "https://i.imgur.com/ZTGzq7L.png",
  "https://i.imgur.com/3TaZMEt.png",
  "https://i.imgur.com/zwPpOvc.png",
  "https://i.imgur.com/4Nq1Yza.png",
  "https://i.imgur.com/1xFXJzn.jpg",
  "https://i.imgur.com/ey8udtl.png"
];

module.exports.config = {
  name: "banner",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Hanaku UwuU (Fixed by Copilot)",
  description: "Generates a banner",
  commandCategory: "game",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function ({ api, args, event }) {
  try {
    const lengthchar = (await axios.get("https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864")).data;

    // 🔹 Handle /banner with no arguments
    if (!args[0]) {
      return api.sendMessage("✍️ Reply to this message to select a Character ID.", event.threadID, (err, info) => {
        if (!err) {
          global.client.handleReply.push({
            step: 1,
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID
          });
        }
      });
    }

    // 🔍 Handle /banner find <character_id>
    if (args[0] === "find") {
      const characterId = args[1];
      const imageUrl = lengthchar[characterId]?.imgAnime;

      if (!imageUrl) {
        return api.sendMessage("❌ Character ID not found!", event.threadID);
      }

      console.log("Downloading Character Image:", imageUrl);
      const avatarBuffer = (await axios.get(imageUrl, { responseType: "arraybuffer" })).data;
      const avatarPath = `avatar_${characterId}.png`;
      fs.writeFileSync(avatarPath, Buffer.from(avatarBuffer));

      return api.sendMessage({
        body: `🔍 **Character ID:** ${characterId}\n🎨 **Default Color:** ${lengthchar[characterId].colorBg}`,
        attachment: fs.createReadStream(avatarPath)
      }, event.threadID, () => fs.unlinkSync(avatarPath));
    }

    // 📜 Handle /banner list <page>
    if (args[0] === "list") {
      const alime = lengthchar.listAnime;
      const page = parseInt(args[1]) || 1;
      const limit = 20;
      const totalPages = Math.ceil(alime.length / limit);

      let msg = `📜 **Character List (Page ${page}/${totalPages})**\n`;
      for (let i = limit * (page - 1); i < limit * page; i++) {
        if (i >= alime.length) break;
        msg += `🆔 [${i + 1}] - ${alime[i].ID} | ${alime[i].name}\n`;
      }
      msg += `🔹 **Use:** ${global.config.PREFIX}${this.config.name} list <page_number>`;

      return api.sendMessage(msg, event.threadID);
    }

  } catch (error) {
    console.error("🚨 Error in banner module:", error);
    return api.sendMessage("❌ An error occurred while generating the banner.", event.threadID);
  }
};
