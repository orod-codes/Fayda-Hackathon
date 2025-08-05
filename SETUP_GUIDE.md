# Setup Guide - Database Authentication

This guide will help you set up the database and authentication system to replace the mock data.

## Prerequisites

1. **MySQL Database** - Make sure you have MySQL installed and running
2. **Node.js** - Version 16 or higher
3. **Backend Server** - The Express.js backend should be running

## Step 1: Database Setup

### 1.1 Create Database
```sql
CREATE DATABASE hakimAI CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 1.2 Run Database Schema
```bash
# Navigate to backend directory
cd backend

# Run the schema file
mysql -u root -p hakimAI < database/schema.sql
```

## Step 2: Environment Configuration

### 2.1 Backend Environment
Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=hakimAI
DB_PORT=3306

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# OpenAI Configuration (for chat feature)
OPENAI_API_KEY=your_openai_api_key_here

# Fayda Integration (optional)
CLIENT_ID=your_fayda_client_id
CLIENT_SECRET=your_fayda_client_secret
TOKEN_ENDPOINT=https://esignet.ida.fayda.et/token
USERINFO_ENDPOINT=https://esignet.ida.fayda.et/userinfo
REDIRECT_URI=http://localhost:3000/callback
```

### 2.2 Frontend Environment
Create a `.env.local` file in the root directory:

```env
# Backend API URL
BACKEND_URL=http://localhost:5000

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 3: Install Dependencies

### 3.1 Backend Dependencies
```bash
cd backend
npm install
```

### 3.2 Frontend Dependencies
```bash
# From root directory
npm install
```

## Step 4: Seed Database with Sample Data

```bash
cd backend
node scripts/seed-data.js
```

This will create sample users with the following credentials:

- **Patient**: `patient@example.com` / `password123`
- **Doctor**: `doctor@example.com` / `password123`
- **Hospital Admin**: `admin@hospital.com` / `password123`
- **Super Admin**: `superadmin@hakim.com` / `password123`

## Step 5: Start the Servers

### 5.1 Start Backend Server
```bash
cd backend
npm start
```

The backend should start on `http://localhost:5000`

### 5.2 Start Frontend Server
```bash
# From root directory
npm run dev
```

The frontend should start on `http://localhost:3000`

## Step 6: Test Authentication

1. **Open your browser** and go to `http://localhost:3000/patient/login`
2. **Try logging in** with the sample credentials:
   - Email: `patient@example.com`
   - Password: `password123`
3. **Or register a new account** by clicking "Register Here"

## Troubleshooting

### Database Connection Issues
- Make sure MySQL is running
- Verify database credentials in `.env` file
- Check if the database `hakimAI` exists

### Backend Server Issues
- Check if port 5000 is available
- Verify all environment variables are set
- Check console for error messages

### Frontend Issues
- Make sure the backend is running on port 5000
- Check browser console for network errors
- Verify `BACKEND_URL` in `.env.local`

### Common Errors

1. **"Database connection failed"**
   - Check MySQL service is running
   - Verify database credentials
   - Ensure database exists

2. **"User already exists"**
   - The user is already in the database
   - Try different email/phone or use existing credentials

3. **"Invalid credentials"**
   - Double-check email/phone and password
   - Use the sample credentials from the seeding script

## API Endpoints

The backend provides these authentication endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

## Next Steps

After successful authentication setup:

1. **Test all user roles** - Try logging in as different user types
2. **Test registration** - Create new patient accounts
3. **Explore the dashboard** - Navigate through the patient dashboard
4. **Add more features** - Implement additional functionality as needed

## Support

If you encounter any issues:

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure both frontend and backend servers are running
4. Test database connectivity manually

The authentication system is now fully functional with real database storage instead of mock data! 