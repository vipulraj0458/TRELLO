const db = require('../config/db');

exports.createList = async (req, res) => {
  try {
    const { title, board_id, position } = req.body;

    if (title == null || String(title).trim() === '') {
      return res.status(400).json({ message: 'title is required' });
    }
    if (board_id == null || board_id === '') {
      return res.status(400).json({ message: 'board_id is required' });
    }

    let nextPosition = position;
    if (nextPosition == null || nextPosition === '') {
      const { rows } = await db.query(
        'SELECT COALESCE(MAX(position), -1) + 1 AS next_pos FROM lists WHERE board_id = $1',
        [board_id]
      );
      nextPosition = rows[0].next_pos;
    }

    const { rows: resultRows } = await db.query(
      'INSERT INTO lists (title, board_id, position) VALUES ($1, $2, $3) RETURNING id',
      [String(title).trim(), board_id, nextPosition]
    );

    res.status(201).json({
      id: resultRows[0].id,
      title: String(title).trim(),
      board_id,
      position: nextPosition,
    });
  } catch (error) {
    console.error('createList:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateListTitle = async (req, res) => {
  try {
    const listId = req.params.id;
    const { title } = req.body;
    
    if (!title || String(title).trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const result = await db.query(
      'UPDATE lists SET title = $1 WHERE id = $2',
      [String(title).trim(), listId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'List not found' });
    }

    res.json({ message: 'List title updated successfully' });
  } catch (error) {
    console.error('updateListTitle:', error);
    res.status(500).json({ message: error.message });
  }
};
