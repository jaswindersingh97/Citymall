const express = require("express");
const router = express.Router();

const {createMeme, getMemes, placeBid, vote, generateCaption } = require("./../controllers/memes")

router.post("/", createMeme);
router.get("/", getMemes);
router.post("/:id/bid", placeBid);
router.post("/:id/vote", vote);
router.post("/:id/caption", generateCaption);

module.exports = router;