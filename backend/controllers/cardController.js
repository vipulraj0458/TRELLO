const db = require('../config/db');

exports.createCard = async (req, res) => {
  try {
    const { title, list_id, position, description } = req.body;

    if (title == null || String(title).trim() === '') {
      return res.status(400).json({ message: 'title is required' });
    }
    if (list_id == null || list_id === '') {
      return res.status(400).json({ message: 'list_id is required' });
    }

    let nextPosition = position;
    if (nextPosition == null || nextPosition === '') {
      const { rows } = await db.query(
        'SELECT COALESCE(MAX(position), -1) + 1 AS next_pos FROM cards WHERE list_id = $1',
        [list_id]
      );
      nextPosition = rows[0].next_pos;
    }

    const desc =
      description === undefined || description === null
        ? null
        : String(description);

    const { rows: resultRows } = await db.query(
      'INSERT INTO cards (title, list_id, position, description) VALUES ($1, $2, $3, $4) RETURNING id',
      [String(title).trim(), list_id, nextPosition, desc]
    );

    res.status(201).json({
      id: resultRows[0].id,
      title: String(title).trim(),
      list_id,
      position: nextPosition,
      description: desc,
    });
  } catch (error) {
    console.error('createCard:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.moveCard = async (req, res) => {
  try {
    const { card_id, new_list_id, new_position } = req.body;

    if (
      card_id == null ||
      new_list_id == null ||
      new_position == null ||
      new_position === ''
    ) {
      return res.status(400).json({
        message: 'card_id, new_list_id, and new_position are required',
      });
    }

    const result = await db.query(
      'UPDATE cards SET list_id = $1, position = $2 WHERE id = $3',
      [new_list_id, new_position, card_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.json({ message: 'Card moved successfully' });
  } catch (error) {
    console.error('moveCard:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateCardTitle = async (req, res) => {
  try {
    const cardId = req.params.id;
    const { title } = req.body;
    
    if (!title || String(title).trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const result = await db.query(
      'UPDATE cards SET title = $1 WHERE id = $2',
      [String(title).trim(), cardId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.json({ message: 'Card title updated successfully' });
  } catch (error) {
    console.error('updateCardTitle:', error);
    res.status(500).json({ message: error.message });
  }
};
