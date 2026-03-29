const db = require('../config/db');

async function initializeDB() {
  console.log('--- Initializing Database ---');
  try {
    // 1. Create Tables
    console.log('Creating/Updating tables...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS boards (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        bgcolor VARCHAR(32) NOT NULL DEFAULT '#0079bf',
        is_archived BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS lists (
        id SERIAL PRIMARY KEY,
        board_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        position INT NOT NULL DEFAULT 0,
        CONSTRAINT fk_lists_board FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_lists_board ON lists (board_id);

      CREATE TABLE IF NOT EXISTS cards (
        id SERIAL PRIMARY KEY,
        list_id INT NOT NULL,
        title VARCHAR(500) NOT NULL,
        position INT NOT NULL DEFAULT 0,
        description TEXT NULL,
        CONSTRAINT fk_cards_list FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_cards_list ON cards (list_id);
    `);
    
    // Check if is_archived column exists (migration-like step)
    const { rows: columns } = await db.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'boards' AND column_name = 'is_archived'
    `);
    if (columns.length === 0) {
        console.log('Adding is_archived column to boards table...');
        await db.query('ALTER TABLE boards ADD COLUMN is_archived BOOLEAN DEFAULT FALSE');
    }

    console.log('Tables verified.');

    // 2. Seed Default Board if empty
    const { rows: boardCheck } = await db.query('SELECT count(*) FROM boards');
    if (parseInt(boardCheck[0].count) === 0) {
      console.log('Seeding initial board data...');
      
      const { rows: board } = await db.query(
        "INSERT INTO boards (name, bgcolor) VALUES ('Initial', '#0079bf') RETURNING id"
      );
      const boardId = board[0].id;

      const { rows: list1 } = await db.query(
        "INSERT INTO lists (board_id, title, position) VALUES ($1, 'Backlog', 1) RETURNING id",
        [boardId]
      );
      const { rows: list2 } = await db.query(
        "INSERT INTO lists (board_id, title, position) VALUES ($1, 'Doing', 2) RETURNING id",
        [boardId]
      );
      const { rows: list3 } = await db.query(
        "INSERT INTO lists (board_id, title, position) VALUES ($1, 'Done', 3) RETURNING id",
        [boardId]
      );

      await db.query(
        "INSERT INTO cards (list_id, title, position) VALUES ($1, 'Setup production deployment', 1)",
        [list1[0].id]
      );
      await db.query(
        "INSERT INTO cards (list_id, title, position) VALUES ($1, 'Configure database', 1)",
        [list1[0].id]
      );
      
      console.log('Seeding complete. Default board ID is:', boardId);
    } else {
      console.log('Board data already exists. Skipping seed.');
    }

    console.log('Database Initialization SUCCESSFUL.');
  } catch (err) {
    console.error('Database Initialization FAILED:', err);
    throw err;
  }
}

// Run standalone if executed directly
if (require.main === module) {
  initializeDB().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = initializeDB;
