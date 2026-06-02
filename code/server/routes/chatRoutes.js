const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getMyConversations,
  getConversationMessages,
} = require("../controllers/chatController");


router.get("/conversations", protect, getMyConversations);

router.get(
  "/conversations/:id/messages",
  protect,
  getConversationMessages
);

module.exports = router;