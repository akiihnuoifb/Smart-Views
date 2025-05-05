const fetch = require("node-fetch");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ytSearch = require("yt-search");
const https = require("https");

module.exports = {
  config: {
    name: "video",
    version: "1.0.4",
    hasPermssion: 0,
    credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
    description: "Download YouTube song from keyword search and link",
    commandCategory: "Media",
    usages: "[songName] [type]",
    cooldowns: 5,
    dependencies: {
      "node-fetch": "",
      "yt-search": "",
    },
  },

  run: async function ({ api, event, args }) {
    const youtubeUrlPattern = /(?:https?:\/\/)?(?:www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]+)/;
    let songName, type, videoId;

    if (args.length > 1 && (args[args.length - 1] === "audio" || args[args.length - 1] === "video")) {
      type = args.pop();
      songName = args.join(" ");
    } else {
      songName = args.join(" ");
      type = "video";
    }

    // Check if input is a YouTube URL
    const match = songName.match(youtubeUrlPattern);
    if (match) {
      videoId = match[2]; // Extract video ID from URL
    }

    const processingMessage = await api.sendMessage(
      "✅ Processing your request. Please wait...",
      event.threadID,
      null,
      event.messageID
    );

    try {
      let topResult;

      if (videoId) {
        topResult = { videoId, title: "Selected Video" }; // Use direct videoId
      } else {
        // Search for the song on YouTube
        const searchResults = await ytSearch(songName);
        if (!searchResults || !searchResults.videos.length) {
          throw new Error("No results found for your search query.");
        }
        topResult = searchResults.videos[0];
        videoId = topResult.videoId;
      }

      // Construct API URL for downloading the video
      const apiKey = "priyansh-here";
      const apiUrl = `https://priyansh-ai.onrender.com/youtube?id=${videoId}&type=${type}&apikey=${apiKey}`;

      api.setMessageReaction("⌛", event.messageID, () => {}, true);

      // Get the direct download URL from the API
      const downloadResponse = await axios.get(apiUrl);
      if (!downloadResponse.data.downloadUrl) {
        throw new Error("Failed to fetch the download URL.");
      }

      const downloadUrl = downloadResponse.data.downloadUrl;

      // Set filename based on the song title and type
      const safeTitle = topResult.title.replace(/[^a-zA-Z0-9 \-_]/g, ""); // Clean the title
      const filename = `${safeTitle}.${type === "audio" ? "mp3" : "mp4"}`;
      const downloadDir = path.join(__dirname, "cache");
      const downloadPath = path.join(downloadDir, filename);

      // Ensure the directory exists
      if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true });
      }

      // Download the file and save locally
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

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      // Send the downloaded file to the user
      await api.sendMessage(
        {
          attachment: fs.createReadStream(downloadPath),
          body: `🖤 Title: ${topResult.title}\n\n Here is your ${
            type === "audio" ? "audio" : "video"
          } 🎧:`,
        },
        event.threadID,
        () => {
          fs.unlinkSync(downloadPath); // Cleanup after sending
          api.unsendMessage(processingMessage.messageID);
        },
        event.messageID
      );
    } catch (error) {
      console.error(`Failed to download and send song: ${error.message}`);
      api.sendMessage(
        `Failed to download song: ${error.message}`,
        event.threadID,
        event.messageID
      );
    }
  },
};
