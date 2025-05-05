const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https");

module.exports = {
  config: {
    name: "video",
    version: "1.0.6",
    hasPermssion: 0,
    credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
    description: "Download a YouTube video from a provided link",
    commandCategory: "Media",
    usages: "[YouTube video link]",
    cooldowns: 5,
  },

  run: async function ({ api, event, args }) {
    // Ensure a YouTube URL is provided
    if (!args[0]) {
      return api.sendMessage("Please provide a YouTube video link.", event.threadID, event.messageID);
    }

    // Regular expression to extract a video ID from common YouTube URL formats.
    const youtubeUrlPattern = /(?:https?:\/\/)?(?:www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]+)/;
    const videoLink = args.join(" ").trim();
    const match = videoLink.match(youtubeUrlPattern);

    if (!match) {
      return api.sendMessage("Invalid YouTube video link provided. Please check your URL.", event.threadID, event.messageID);
    }

    const videoId = match[2];

    // Send an initial processing message.
    const processingMessage = await api.sendMessage(
      "✅ Processing your request. Please wait...",
      event.threadID,
      null,
      event.messageID
    );

    try {
      // For this bot, we always set type to 'video'
      const type = "video";
      const apiKey = "priyansh-here";
      const apiUrl = `https://priyansh-ai.onrender.com/youtube?id=${videoId}&type=${type}&apikey=${apiKey}`;

      // Indicate that processing has started.
      api.setMessageReaction("⌛", event.messageID, () => {}, true);

      // Request the API to get video details and the download URL.
      const downloadResponse = await axios.get(apiUrl);
      if (!downloadResponse.data.downloadUrl) {
        throw new Error("Failed to fetch the download URL.");
      }

      let downloadUrl = downloadResponse.data.downloadUrl;
      // If API returns an http URL, convert it to https.
      if (downloadUrl.startsWith("http:")) {
        downloadUrl = downloadUrl.replace("http:", "https:");
      }

      // Get the video title to create a safe filename.
      const title = downloadResponse.data.title || "Downloaded_Video";
      const safeTitle = title.replace(/[^a-zA-Z0-9 \-_]/g, "");
      const filename = `${safeTitle}.mp4`;
      const downloadDir = path.join(__dirname, "cache");
      const downloadPath = path.join(downloadDir, filename);

      // Make sure the cache directory exists.
      if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true });
      }

      // Download the video using the HTTPS module.
      const file = fs.createWriteStream(downloadPath);
      await new Promise((resolve, reject) => {
        https.get(downloadUrl, (response) => {
          if (response.statusCode === 200) {
            response.pipe(file);
            file.on("finish", () => {
              file.close(resolve);
            });
          } else {
            reject(new Error(`Failed to download file. Status code: ${response.statusCode}`));
          }
        }).on("error", (error) => {
          fs.unlinkSync(downloadPath);
          reject(new Error(`Error downloading file: ${error.message}`));
        });
      });

      // Update reaction to show completion.
      api.setMessageReaction("✅", event.messageID, () => {}, true);

      // Send the downloaded video file to the Messenger group.
      await api.sendMessage(
        {
          attachment: fs.createReadStream(downloadPath),
          body: `🖤 Title: ${title}\n\nHere is your video 🎧:`,
        },
        event.threadID,
        () => {
          // Cleanup the downloaded file and remove the processing message.
          fs.unlinkSync(downloadPath);
          api.unsendMessage(processingMessage.messageID);
        },
        event.messageID
      );
    } catch (error) {
      console.error(`Failed to download and send video: ${error.message}`);
      api.sendMessage(
        `Failed to download video: ${error.message}`,
        event.threadID,
        event.messageID
      );
    }
  },
};
