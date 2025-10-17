import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '..', 'content.db'));

console.log('🔐 Updating admin credentials...');

const username = 'alec@antsa.ai';
const password = 'Telstra1234!';

try {
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  // Check if user exists
  const checkUser = db.prepare('SELECT * FROM users WHERE username = ?');
  const existingUser = checkUser.get(username);
  
  if (existingUser) {
    // Update existing user
    const updateStmt = db.prepare('UPDATE users SET password_hash = ? WHERE username = ?');
    updateStmt.run(hashedPassword, username);
    console.log(`✅ Updated password for ${username}`);
  } else {
    // Create new user
    const insertStmt = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
    insertStmt.run(username, hashedPassword);
    console.log(`✅ Created new admin user: ${username}`);
  }
  
  // Remove old admin user if exists
  const deleteStmt = db.prepare('DELETE FROM users WHERE username = ?');
  const result = deleteStmt.run('admin');
  if (result.changes > 0) {
    console.log('✅ Removed old "admin" user');
  }
  
  console.log('✅ Admin credentials updated successfully!');
  console.log(`   Username: ${username}`);
  console.log(`   Password: [SECURE]`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

db.close();

