#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏥 Hakim AI Health Assistant - Backend Setup');
console.log('=============================================\n');

// Check if Node.js version is sufficient
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required');
  console.error(`Current version: ${nodeVersion}`);
  process.exit(1);
}

console.log('✅ Node.js version check passed');

// Check if package.json exists
const packagePath = path.join(__dirname, 'package.json');
if (!fs.existsSync(packagePath)) {
  console.error('❌ package.json not found. Please run this script from the backend directory.');
  process.exit(1);
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies');
  process.exit(1);
}

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('\n🔧 Creating .env file...');
  
  const envTemplate = `# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=hakimAI
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development
SESSION_SECRET=your-session-secret-key-change-in-production

# OpenAI Configuration (Optional - for AI chat features)
OPENAI_API_KEY=your-openai-api-key

# Fayda Integration (Optional - for Ethiopian digital ID)
CLIENT_ID=your-fayda-client-id
CLIENT_SECRET=your-fayda-client-secret
PRIVATE_KEY=your-base64-encoded-private-key
ALGORITHM=RS256
AUTHORIZATION_ENDPOINT=https://esignet.ida.fayda.et/authorize
TOKEN_ENDPOINT=https://esignet.ida.fayda.et/token
USERINFO_ENDPOINT=https://esignet.ida.fayda.et/userinfo
REDIRECT_URI=http://localhost:3000/callback

# Email Configuration (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password

# File Upload Configuration (Optional)
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ .env file created');
  console.log('⚠️  Please edit .env file with your actual configuration values');
}

// Check if database schema exists
const schemaPath = path.join(__dirname, 'database', 'schema.sql');
if (!fs.existsSync(schemaPath)) {
  console.error('❌ Database schema not found');
  console.error('Please ensure the database/schema.sql file exists');
  process.exit(1);
}

console.log('\n📊 Database setup instructions:');
console.log('1. Create a MySQL database named "hakimAI"');
console.log('2. Run the schema: mysql -u root -p hakimAI < database/schema.sql');
console.log('3. Update the database credentials in .env file');

console.log('\n🚀 Next steps:');
console.log('1. Edit .env file with your configuration');
console.log('2. Set up the MySQL database');
console.log('3. Run: npm run dev (for development)');
console.log('4. Run: npm start (for production)');

console.log('\n📚 Documentation:');
console.log('- Read README.md for detailed setup instructions');
console.log('- Check API documentation in README.md');

console.log('\n🎉 Setup completed!');
console.log('Happy coding! 🚀'); 