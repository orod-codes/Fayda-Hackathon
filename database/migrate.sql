-- Migration script to add new columns to existing database

-- Add hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  license_number TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by INTEGER,
  FOREIGN KEY (approved_by) REFERENCES users (id)
);

-- Add new columns to users table if they don't exist
-- SQLite doesn't support ADD COLUMN IF NOT EXISTS, so we need to check and add carefully

-- First, let's add the columns one by one with error handling
-- Note: SQLite ADD COLUMN will fail if column already exists, so we'll use a different approach

-- Create a new users table with all required columns
CREATE TABLE IF NOT EXISTS users_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fayda_id TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK(role IN ('patient', 'doctor', 'hospital_admin', 'super_admin')),
  hospital_id INTEGER,
  license_number TEXT,
  status TEXT DEFAULT 'approved' CHECK(status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by INTEGER,
  FOREIGN KEY (hospital_id) REFERENCES hospitals (id),
  FOREIGN KEY (approved_by) REFERENCES users (id)
);

-- Copy data from old users table to new users table
INSERT OR IGNORE INTO users_new (id, fayda_id, role, created_at, status)
SELECT id, fayda_id, role, created_at, 'approved' as status FROM users;

-- Drop old users table and rename new table
DROP TABLE users;
ALTER TABLE users_new RENAME TO users;

-- Insert sample hospital
INSERT OR IGNORE INTO hospitals (name, address, phone, email, license_number, status) VALUES
('Tikur Anbessa Specialized Hospital', 'Addis Ababa, Ethiopia', '+251111234567', 'info@tikuranbessa.edu.et', 'HOSP-001', 'approved');

-- Update existing doctor to be associated with the hospital
UPDATE users SET hospital_id = 1, status = 'approved' WHERE fayda_id = '6230247319356120' AND role = 'doctor';
