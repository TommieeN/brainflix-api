const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuid } = require("uuid");

router.use(express.json());

router.route("/").get((req, res) => {
  try {
    const data = fs.readFileSync("./data/video-details.json", "utf-8");
    const videoData = JSON.parse(data).map((video) => {
      return {
        id: video.id,
        title: video.title,
        channel: video.channel,
        image: video.image,
      };
    });
    res.json(videoData);
  } catch (error) {
    res.status(500).send("server error");
  }
});

router.get("/:videoId", (req, res) => {
  try {
    const data = fs.readFileSync("./data/video-details.json", "utf-8");
    let videoData = JSON.parse(data);
    const foundVideo = videoData.find(
      (video) => video.id === req.params.videoId
    );
    res.json(foundVideo);
  } catch (error) {
    res.status(500).send("server error");
  }
});

module.exports = router;
