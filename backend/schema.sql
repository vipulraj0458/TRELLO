-- PostgreSQL schema for trello_clone API
-- Run: psql -U postgres -d postgres -f schema.sql

CREATE TABLE IF NOT EXISTS boards (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  bgcolor VARCHAR(32) NOT NULL DEFAULT '#0079bf',
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
