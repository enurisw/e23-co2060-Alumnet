const { pool } = require("../src/db");

const getMyConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT *
      FROM conversations
      WHERE student_user_id = $1
         OR alumni_user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get conversations error:", error);

    res.status(500).json({
      message: "Failed to fetch conversations",
    });
  }
};

const getConversationMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversationId = req.params.id;

    // Verify access
    const conversationResult = await pool.query(
      `
      SELECT *
      FROM conversations
      WHERE id = $1
      `,
      [conversationId]
    );

    if (conversationResult.rows.length === 0) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    const conversation = conversationResult.rows[0];

    const hasAccess =
      Number(conversation.student_user_id) === Number(userId) ||
      Number(conversation.alumni_user_id) === Number(userId);

    if (!hasAccess) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const messagesResult = await pool.query(
      `
      SELECT *
      FROM messages
      WHERE conversation_id = $1
      ORDER BY created_at ASC
      `,
      [conversationId]
    );

    res.json(messagesResult.rows);

  } catch (error) {
    console.error("Get messages error:", error);

    res.status(500).json({
      message: "Failed to fetch messages",
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversationId = req.params.id;
    const { message_text } = req.body;

    if (!message_text || !message_text.trim()) {
      return res.status(400).json({
        message: "Message cannot be empty",
      });
    }

    const conversationResult = await pool.query(
      `
      SELECT *
      FROM conversations
      WHERE id = $1
      `,
      [conversationId]
    );

    if (conversationResult.rows.length === 0) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    const conversation = conversationResult.rows[0];

    const hasAccess =
      Number(conversation.student_user_id) === Number(userId) ||
      Number(conversation.alumni_user_id) === Number(userId);

    if (!hasAccess) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO messages (
        conversation_id,
        sender_id,
        message_text
      )
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [
        conversationId,
        userId,
        message_text.trim()
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error("Send message error:", error);

    res.status(500).json({
      message: "Failed to send message",
    });
  }
};

module.exports = {
  getMyConversations,
  getConversationMessages,
  sendMessage,
};