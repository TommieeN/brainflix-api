const express = require("express");
const router = express.Router();
const fs = require("fs");
const { title } = require("process");
const { v4: uuid } = require("uuid");

//MIDDLEWARE
router.use(express.json());

// READ AND PARSE DATA FUNCTION
function readAndParseData() {
    const data = fs.readFileSync("./data/videos.json", "utf-8");
    return JSON.parse(data);
}

//VIDEOLIST ROUTE
router.route("/").get((req, res) => {
  try {
    const videoData = readAndParseData().map((video) => {
      return {
        id: video.id,
        title: video.title,
        channel: video.channel,
        image: video.image,
      };
    });
    res.json(videoData);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

//MAIN VIDEO ROUTE
router.get("/:videoId", (req, res) => {
  try {
    const videoData = readAndParseData();
    const foundVideo = videoData.find(
      (video) => video.id === req.params.videoId
    );
    res.json(foundVideo);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

//POST NEW COMMENT ROUTE
router.post("/:videoId/comments", (req, res) => {
  try {
    const videoId = req.params.videoId;
    const { name, comment } = req.body;
    const videoData = readAndParseData();
    const foundVideo = videoData.find((video) => video.id === videoId);
    if (!foundVideo) {
      return res.status(404).send("Video not found");
    }
    const newComment = {
      id: uuid(),
      name,
      comment,
      timestamp: Date.now(),
    };
    foundVideo.comments.push(newComment);
    fs.writeFileSync("./data/videos.json", JSON.stringify(videoData));
    res.json({ comments: foundVideo.comments });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

//DELETE COMMENT ROUTE
router.delete("/:videoId/comments/:commentId", (req, res) => {
  try {
    const videoData = readAndParseData();
    const newVideoData = videoData.map((video) => {
      if (video.id === req.params.videoId) {
        const newCommentArr = video.comments.filter(
          (comment) => comment.id !== req.params.commentId
        );
        video.comments = newCommentArr;
      }
      return video;
    });
    fs.writeFileSync("./data/videos.json", JSON.stringify(newVideoData));
    res.status(200).send(`Post with ${req.params.commentId} has been deleted`);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// UPLOAD VIDEO ROUTE
router.post("/", (req, res) => {
  const videoData = readAndParseData();
  const { title, description } = req.body;
  if (!title || !description) {
    return res
      .status(400)
      .send("Please a provide title, descripion, and image");
  }
  if (title.length < 5 || description.length < 5) {
    return res
      .status(400)
      .send("Title and description must be more than 5 characters");
  }
  const newVideo = {
    id: uuid(),
    title,
    channel: "Anonymous",
    description,
    image: "/images/image9.jpeg",
    views: "9409",
    likes: "7777",
    duration: "2:44",
    timestamp: Date.now(),
    comments: [],
    video: "https://project-2-api.herokuapp.com/stream",
  };

  videoData.push(newVideo);
  fs.writeFileSync("./data/videos.json", JSON.stringify(videoData));
  res.status(201).send("Thank you for uploading!");
});

module.exports = router;
