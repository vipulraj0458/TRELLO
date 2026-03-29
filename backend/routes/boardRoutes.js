const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController");

// GET all boards
router.get("/", boardController.getBoards);

// GET board with lists and cards
router.get("/:id", boardController.getBoardDetails);

// POST create new board
router.post("/", boardController.createBoard);

// PUT update board (edit/archive)
router.put("/:id", boardController.updateBoard);

// DELETE board
router.delete("/:id", boardController.deleteBoard);

module.exports = router;
