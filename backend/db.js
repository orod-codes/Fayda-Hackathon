import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQLite database connection
const dbPath = path.join(__dirname, '..', 'database', 'hakim_ai.db');
const database = new Database(dbPath);

// Enable foreign keys
database.pragma('foreign_keys = ON');

// Test database connection
const testConnection = async () => {
  try {
    database.prepare('SELECT 1').get();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

// Initialize database with schema
const initializeDatabase = async () => {
  try {
    // Check if users table exists and has the new columns
    let needsMigration = false;
    try {
      const result = database.prepare('PRAGMA table_info(users)').all();
      const hasHospitalId = result.some(col => col.name === 'hospital_id');
      const hasStatus = result.some(col => col.name === 'status');
      needsMigration = !hasHospitalId || !hasStatus;
    } catch (error) {
      // Table doesn't exist, so we need to create it
      needsMigration = true;
    }
    
    if (needsMigration) {
      console.log('🔄 Running database migration...');
      const migrationPath = path.join(__dirname, '..', 'database', 'migrate.sql');
      
      if (fs.existsSync(migrationPath)) {
        const migration = fs.readFileSync(migrationPath, 'utf8');
        const statements = migration.split(';').filter(stmt => stmt.trim());
        
        database.transaction(() => {
          for (const statement of statements) {
            if (statement.trim()) {
              try {
                database.exec(statement.trim());
              } catch (error) {
                // Some migration steps might fail if already applied, that's okay
                console.log('Migration step skipped:', error.message);
              }
            }
          }
        })();
        
        console.log('✅ Database migration completed successfully');
      }
    }
    
    // Now run the full schema to ensure everything is up to date
    const schemaPath = path.join(__dirname, '..', 'database', 'schema_sqlite.sql');
    
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      // Split and execute statements individually for SQLite
      const statements = schema.split(';').filter(stmt => stmt.trim());
      
      database.transaction(() => {
        for (const statement of statements) {
          if (statement.trim()) {
            try {
              database.exec(statement.trim());
            } catch (error) {
              // Some statements might fail if already applied, that's okay for INSERT OR IGNORE
              if (!error.message.includes('already exists') && !error.message.includes('UNIQUE constraint')) {
                console.log('Schema step skipped:', error.message);
              }
            }
          }
        }
      })();
      
      console.log('✅ Database schema initialized successfully');
    } else {
      console.log('⚠️ Schema file not found, skipping initialization');
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

// Convert PostgreSQL placeholders ($1, $2) to SQLite (?, ?)
const convertQuery = (sql, params) => {
  let convertedSql = sql;

  // Replace PostgreSQL $1, $2, etc. with ? for SQLite
  for (let i = 0; i < params.length; i++) {
    convertedSql = convertedSql.replace(`$${i+1}`, '?');
  }

  return { sql: convertedSql, params };
};

// Database utility functions
const db = {
  // Execute a query with parameters
  query: async (sql, params = []) => {
    const { sql: convertedSql } = convertQuery(sql, params);
    try {
      const stmt = database.prepare(convertedSql);
      if (convertedSql.trim().toUpperCase().startsWith('SELECT')) {
        return stmt.all(params);
      } else {
        const result = stmt.run(params);
        return { insertId: result.lastInsertRowid, changes: result.changes };
      }
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },

  // Execute a single query and return the first result
  queryOne: async (sql, params = []) => {
    const { sql: convertedSql } = convertQuery(sql, params);
    try {
      return database.prepare(convertedSql).get(params) || null;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },

  // Execute a transaction
  transaction: async (callback) => {
    const transaction = database.transaction(() => {
      return callback(database);
    });
    return transaction();
  },

  // Test connection
  testConnection,
  
  // Initialize database
  initializeDatabase
};

export default db;
