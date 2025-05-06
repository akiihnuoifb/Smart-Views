const axios = require("axios");
const fs = require("fs-extra");

// Direct image download links (if needed in other parts of your code)
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
    // Use your new API endpoint
    const characterData = (await axios.get("https://run.mocky.io/v3/79ca3d9c-192d-4e01-a603-72d8d3d602bf")).data;
    
    // No arguments: initiate interactive selection (handleReply chain)
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
    
    // /banner find <id>
    if (args[0] === "find") {
      const characterId = args[1];
      // Find character by id (assuming ids in the JSON match user input)
      const selectedChar = characterData.characters.find(c => c.id == characterId);
      if (!selectedChar) {
        return api.sendMessage("❌ Character ID not found!", event.threadID);
      }
      const imageUrl = selectedChar.imgAnime;
      console.log("Downloading Character Image:", imageUrl);
      const avatarBuffer = (await axios.get(imageUrl, { responseType: "arraybuffer" })).data;
      const avatarPath = `avatar_${characterId}.png`;
      fs.writeFileSync(avatarPath, Buffer.from(avatarBuffer));
      
      return api.sendMessage({
        body: `🔍 **Character ID:** ${selectedChar.id}\n👤 **Name:** ${selectedChar.name}\n🎨 **Default Color:** ${selectedChar.colorBg}`,
        attachment: fs.createReadStream(avatarPath)
      }, event.threadID, () => fs.unlinkSync(avatarPath));
    }
    
    // /banner list <page>
    if (args[0] === "list") {
      const allCharacters = characterData.characters;
      const page = parseInt(args[1]) || 1;
      const limit = 20;
      const totalPages = Math.ceil(allCharacters.length / limit);
      
      let msg = `📜 **Character List (Page ${page}/${totalPages})**\n`;
      for (let i = limit * (page - 1); i < limit * page; i++) {
        if (i >= allCharacters.length) break;
        msg += `🆔 [${allCharacters[i].id}] - ${allCharacters[i].name}\n`;
      }
      msg += `\n🔹 **Usage:** /banner list <page_number>`;
      
      return api.sendMessage(msg, event.threadID);
    }
    
    // Default: unknown command usage
    return api.sendMessage(
      "❓ Unknown command. Usage:\n/banner (for interactive selection)\n/banner find <id>\n/banner list <page>", 
      event.threadID
    );
    
  } catch (error) {
    console.error("🚨 Error in banner module:", error);
    return api.sendMessage("❌ An error occurred while generating the banner.", event.threadID);
  }
};
