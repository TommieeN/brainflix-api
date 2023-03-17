// require("dotenv").config();
const express = require("express");
const app = express();
const videoData = require("./routes/videos.js")
const cors = require("cors")
const PORT = 8080;


app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/videos", videoData);
app.use("/videos/:videoId", videoData);
app.use("/videos/:videoId/comments", videoData)
app.use("/videos/:videoId/comments/:commentId", videoData)


// START SERVER
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});