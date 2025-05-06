const axios = require("axios");
const fs = require("fs-extra");

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
    // Fetch character data from your new Mocky.io endpoint
    const response = await axios.get("https://run.mocky.io/v3/79ca3d9c-192d-4e01-a603-72d8d3d602bf");
    const characterData = response.data; // Expecting an object with a "characters" array
    console.log("Fetched character data:", characterData);

    // Case 1: /banner with no arguments => prompt interactive selection
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

    // Case 2: /banner find <character_id>
    if (args[0] === "find") {
      const characterId = args[1];
      if (!characterId) {
        return api.sendMessage("❌ Please provide a character ID (for example: /banner find 1).", event.threadID);
      }

      // Search for the character in the JSON data based on the provided id
      const selectedChar = characterData.characters.find(c => c.id == characterId);
      if (!selectedChar) {
        return api.sendMessage("❌ Character ID not found!", event.threadID);
      }

      // Logging the selected character for debugging
      console.log("Selected Character:", selectedChar);

      // Download the character image
      const imageUrl = selectedChar.imgAnime;
      console.log("Downloading character image from:", imageUrl);
      const avatarResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
      const avatarBuffer = avatarResponse.data;
      const avatarPath = `avatar_${characterId}.png`;
      fs.writeFileSync(avatarPath, Buffer.from(avatarBuffer));

      // Send image along with character details
      return api.sendMessage({
        body: `🔍 **Character ID:** ${selectedChar.id}\n👤 **Name:** ${selectedChar.name}\n🎨 **Default Color:** ${selectedChar.colorBg}`,
        attachment: fs.createReadStream(avatarPath)
      }, event.threadID, () => fs.unlinkSync(avatarPath));
    }

    // Case 3: /banner list <page>
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

    // If the command is not recognized
    return api.sendMessage("❓ Unknown command.\nUsage:\n/banner (for interactive selection)\n/banner find <id>\n/banner list <page>", event.threadID);
  } catch (error) {
    console.error("Error in banner module:", error);
    return api.sendMessage("❌ An error occurred while generating the banner.", event.threadID);
  }
};
