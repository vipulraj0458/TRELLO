const db = require('../config/db');

exports.getBoards = async (req, res) => {
  try {
    const { rows: boards } = await db.query('SELECT * FROM boards ORDER BY id ASC');
    res.json(boards);
  } catch (error) {
    console.error('getBoards:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getBoardDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const boardId = Number(id);
    if (Number.isNaN(boardId)) {
      return res.status(400).json({ message: 'Invalid board id' });
    }

    const { rows: boards } = await db.query('SELECT * FROM boards WHERE id = $1', [
      boardId,
    ]);
    if (boards.length === 0) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const { rows: lists } = await db.query(
      'SELECT * FROM lists WHERE board_id = $1 ORDER BY position ASC',
      [boardId]
    );
    const { rows: cards } = await db.query(
      `SELECT * FROM cards
       WHERE list_id IN (SELECT id FROM lists WHERE board_id = $1)
       ORDER BY position ASC`,
      [boardId]
    );

    const structuredLists = lists.map((list) => ({
      ...list,
      cards: cards.filter(
        (card) => String(card.list_id) === String(list.id)
      ),
    }));

    res.json({ ...boards[0], lists: structuredLists });
  } catch (error) {
    console.error('getBoardDetails:', error);
    res.status(500).json({ message: error.message });
  }
};
