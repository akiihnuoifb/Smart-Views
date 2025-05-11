module.exports.config = {
  name: "create",
  version: "1.0",
  hasPermssion: 0,
  credits: "Islamick Chat",
  description: "(Generate AI images)",
  commandCategory: "create-images",
  usages: "(Imagine Image)",
  cooldowns: 2,
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require("axios");
  const fs = require("fs-extra");
  let { threadID, messageID } = event;

  // Ensure the user provides a prompt
  if (!args.length) {
    return api.sendMessage("𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 ✓𝗀𝖾𝗇𝗆𝖺𝗀𝖾 <𝗍𝖾𝗑𝗍>", threadID, messageID);
  }

  let query = args.join(" "); // Correctly join user input
  let path = __dirname + `/cache/generated_image.png`;

  try {
    // Fetch the image from Pollinations API
    const response = await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(query)}`, {
      responseType: "arraybuffer",
    });

    // Write the image file correctly
    fs.writeFileSync(path, Buffer.from(response.data));

    // Send the image in chat
    api.sendMessage(
      {
        body: "𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥 𝐅𝐨𝐫 𝐘𝐨𝐮𝐫 𝐂𝐫𝐞𝐚𝐭𝐞 𝐈𝐦𝐠✨🌺",
        attachment: fs.createReadStream(path),
      },
      threadID,
      () => fs.unlinkSync(path),
      messageID
    );
  } catch (error) {
    console.error("Error fetching image:", error);
    api.sendMessage("❌ Failed to generate image. Please try again later.", threadID, messageID);
  }
};
