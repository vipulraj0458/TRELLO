const db = require('../config/db');

exports.getBoards = async (req, res) => {
  try {
    const { rows: boards } = await db.query(
        'SELECT * FROM boards WHERE is_archived = FALSE ORDER BY id ASC'
    );
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

exports.createBoard = async (req, res) => {
  try {
    const { name, bgcolor } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Board name is required' });
    }
    const { rows: boards } = await db.query(
        'INSERT INTO boards (name, bgcolor) VALUES ($1, $2) RETURNING *',
        [name, bgcolor || 'bg-[#0079bf]']
    );
    res.status(201).json(boards[0]);
  } catch (error) {
    console.error('createBoard:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bgcolor, is_archived } = req.body;
    
    const { rows: existing } = await db.query('SELECT * FROM boards WHERE id = $1', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const updated = {
      name: name !== undefined ? name : existing[0].name,
      bgcolor: bgcolor !== undefined ? bgcolor : existing[0].bgcolor,
      is_archived: is_archived !== undefined ? is_archived : existing[0].is_archived
    };

    const { rows: boards } = await db.query(
        'UPDATE boards SET name = $1, bgcolor = $2, is_archived = $3 WHERE id = $4 RETURNING *',
        [updated.name, updated.bgcolor, updated.is_archived, id]
    );
    res.json(boards[0]);
  } catch (error) {
    console.error('updateBoard:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM boards WHERE id = $1', [id]);
    res.json({ message: 'Board deleted permanently' });
  } catch (error) {
    console.error('deleteBoard:', error);
    res.status(500).json({ message: error.message });
  }
};
