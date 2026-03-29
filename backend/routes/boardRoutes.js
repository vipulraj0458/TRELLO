const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all boards
router.get("/", async (req, res) => {
  try {
    const { rows: boards } = await db.query("SELECT * FROM boards");
    res.json(boards);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET board with lists and cards
router.get("/:id", async (req, res) => {
  const boardId = req.params.id;

  try {
    const { rows: lists } = await db.query(
      "SELECT * FROM lists WHERE board_id = $1 ORDER BY position",
      [boardId]
    );

    for (let list of lists) {
      const { rows: cards } = await db.query(
        "SELECT * FROM cards WHERE list_id = $1 ORDER BY position",
        [list.id]
      );
      list.cards = cards;
    }

    res.json(lists);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
