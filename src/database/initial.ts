import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();
console.log(process.env.ADMIN_USERNAME)
const username = process.env.ADMIN_USERNAME || 'default_admin';
const email = process.env.ADMIN_EMAIL || 'admin@example.com';
const password = process.env.ADMIN_PASSWORD || 'password';
const role = 'administrator';

interface UserCountResult {
  count: number;
}

export function setupDatabase() {
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err.message);
      return;
    }

    const db = new sqlite3.Database('./database.sqlite3', (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to the SQLite database.');
      }
    });

    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`;

    db.run(createUsersTable, (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
        return;
      }
      db.get<UserCountResult>('SELECT COUNT(*) AS count FROM users', (err, row) => {
        if (err) {
          console.error('Error checking users table:', err.message);
          return;
        }

        if (row && row.count === 0) {
          const insertUser = `
            INSERT INTO users (username, password_hash, email, role)
            VALUES (?, ?, ?, ?);`;

          db.run(insertUser, [username, hashedPassword, email, role], (err) => {
            if (err) {
              console.error('Error inserting initial user:', err.message);
            } else {
              console.log('Initial admin user inserted successfully.');
            }
          });
        } else {
          console.log('Users table already contains data. Skipping initial user insertion.');
        }
      });
    });
  });
}
