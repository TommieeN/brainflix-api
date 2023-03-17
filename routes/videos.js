const express = require("express");
const router = express.Router();
const fs = require("fs");
const { title } = require("process");
const { v4: uuid } = require("uuid");

router.use(express.json());

//VIDEOLIST ROUTE
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
    res.status(500).send("Server error");
  }
});

//MAIN VIDEO ROUTE
router.get("/:videoId", (req, res) => {
  try {
    const data = fs.readFileSync("./data/video-details.json", "utf-8");
    let videoData = JSON.parse(data);
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
    const data = fs.readFileSync("./data/video-details.json", "utf-8");
    let videoData = JSON.parse(data);
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
    fs.writeFileSync("./data/video-details.json", JSON.stringify(videoData));
    res.json({ comments: foundVideo.comments });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

//DELETE COMMENT ROUTE
router.delete("/:videoId/comments/:commentId", (req, res) => {
  try {
    const data = fs.readFileSync("./data/video-details.json", "utf-8");
    let videoData = JSON.parse(data);
    const newVideoData = videoData.map((video) => {
      if (video.id === req.params.videoId) {
        const newCommentArr = video.comments.filter(
          (comment) => comment.id !== req.params.commentId)
        video.comments = newCommentArr;
      }
      return video;
    });    
    fs.writeFileSync("./data/video-details.json", JSON.stringify(newVideoData));
    res.status(200).send(`Post with ${req.params.commentId} has been deleted`);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.post("/", (req, res) => {
  const data = fs.readFileSync("./data/video-details.json", "utf-8");
    let videoData = JSON.parse(data);
  const newVideo = {
    id: uuid(),
    title: req.body.title,
    channel: "John",
    description: req.body.description,
    image: req.body.image,
    views: "9409",
    likes: "7777",
    duration: "2:44",
    timestamp: Date.now(),
    comments: [],
    video: "https://project-2-api.herokuapp.com/stream"
  };
  console.log(newVideo);
  videoData.push(newVideo);
  
  fs.writeFileSync("./data/video-details.json", JSON.stringify(videoData));
  res.status(201).send("Thank you for uploading!")
  console.log("newVideo: ", newVideo)
});


module.exports = router;
