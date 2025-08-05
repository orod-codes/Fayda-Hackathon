# Hakim AI Health Assistant - Backend API

A comprehensive healthcare management system backend built with Node.js, Express, and MySQL. This system supports multiple user roles including Super Admin, Hospital Admin, Doctor, and Patient.

## 🏗️ Architecture

### User Roles & Permissions

1. **Super Admin** - System-wide management
   - Manage hospitals
   - Manage all users
   - System settings
   - System statistics

2. **Hospital Admin** - Hospital-specific management
   - Manage doctors in their hospital
   - View patients
   - Manage appointments
   - Hospital statistics

3. **Doctor** - Medical professional features
   - Patient management
   - Appointments
   - Consultations
   - Prescriptions
   - Medical records

4. **Patient** - Healthcare consumer features
   - Book appointments
   - View consultations
   - View prescriptions
   - Upload medical records
   - Search doctors/hospitals

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hakmin-health-assistant/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=hakimAI
   DB_PORT=3306

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=24h

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # OpenAI Configuration
   OPENAI_API_KEY=your-openai-api-key

   # Fayda Integration (Optional)
   CLIENT_ID=your-fayda-client-id
   CLIENT_SECRET=your-fayda-client-secret
   AUTHORIZATION_ENDPOINT=https://esignet.ida.fayda.et/authorize
   TOKEN_ENDPOINT=https://esignet.ida.fayda.et/token
   USERINFO_ENDPOINT=https://esignet.ida.fayda.et/userinfo
   REDIRECT_URI=http://localhost:3000/callback
   ```

4. **Set up the database**
   ```bash
   # Create database
   mysql -u root -p
   CREATE DATABASE hakimAI;
   USE hakimAI;
   
   # Run the schema
   source database/schema.sql;
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📊 Database Schema

The system uses a comprehensive MySQL database with the following main tables:

- **users** - Base user information
- **hospitals** - Hospital information
- **hospital_admins** - Hospital administrator profiles
- **doctors** - Doctor profiles and specializations
- **patients** - Patient profiles and medical info
- **appointments** - Appointment scheduling
- **consultations** - Medical consultations
- **prescriptions** - Medication prescriptions
- **medical_records** - Patient medical records
- **notifications** - System notifications
- **chat_messages** - Chat functionality
- **system_settings** - System configuration
- **audit_logs** - Activity logging

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication with role-based access control.

### Authentication Flow

1. **Register/Login** - Get JWT token
2. **Include token** in Authorization header: `Bearer <token>`
3. **Role-based access** - Each endpoint checks user permissions

### Example Authentication

```javascript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { token } = await response.json();

// Use token in subsequent requests
const userData = await fetch('/api/auth/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## 📚 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | User login |
| POST | `/change-password` | Change password |
| GET | `/profile` | Get user profile |
| PUT | `/profile` | Update user profile |
| POST | `/logout` | Logout user |
| GET | `/verify` | Verify token |

### Super Admin (`/api/super-admin`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/hospitals` | Get all hospitals |
| POST | `/hospitals` | Create hospital |
| PUT | `/hospitals/:id` | Update hospital |
| DELETE | `/hospitals/:id` | Delete hospital |
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user details |
| PATCH | `/users/:id/status` | Update user status |
| DELETE | `/users/:id` | Delete user |
| GET | `/settings` | Get system settings |
| PUT | `/settings` | Update system settings |
| GET | `/statistics` | Get system statistics |

### Hospital Admin (`/api/hospital-admin`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/doctors` | Get hospital doctors |
| POST | `/doctors` | Add doctor |
| PUT | `/doctors/:id` | Update doctor |
| DELETE | `/doctors/:id` | Remove doctor |
| GET | `/patients` | Get patients |
| GET | `/patients/:id` | Get patient details |
| GET | `/appointments` | Get appointments |
| PATCH | `/appointments/:id/status` | Update appointment status |
| GET | `/statistics` | Get hospital statistics |

### Doctor (`/api/doctor`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get doctor profile |
| PUT | `/profile` | Update doctor profile |
| GET | `/appointments` | Get appointments |
| PATCH | `/appointments/:id/status` | Update appointment status |
| GET | `/consultations` | Get consultations |
| POST | `/consultations` | Create consultation |
| PUT | `/consultations/:id` | Update consultation |
| GET | `/prescriptions` | Get prescriptions |
| POST | `/prescriptions` | Create prescription |
| PATCH | `/prescriptions/:id/status` | Update prescription status |
| GET | `/patients` | Get patients |
| GET | `/patients/:id` | Get patient details |
| GET | `/statistics` | Get doctor statistics |

### Patient (`/api/patient`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get patient profile |
| PUT | `/profile` | Update patient profile |
| GET | `/appointments` | Get appointments |
| POST | `/appointments` | Book appointment |
| PATCH | `/appointments/:id/cancel` | Cancel appointment |
| GET | `/consultations` | Get consultations |
| GET | `/prescriptions` | Get prescriptions |
| GET | `/medical-records` | Get medical records |
| POST | `/medical-records` | Upload medical record |
| GET | `/doctors` | Search doctors |
| GET | `/hospitals` | Search hospitals |
| GET | `/statistics` | Get patient statistics |

### Chat (`/api/chat`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chat` | Send chat message |

## 🔧 Configuration

### Environment Variables

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hakimAI
DB_PORT=3306

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Server
PORT=5000
NODE_ENV=development

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Fayda Integration
CLIENT_ID=your-fayda-client-id
CLIENT_SECRET=your-fayda-client-secret
AUTHORIZATION_ENDPOINT=https://esignet.ida.fayda.et/authorize
TOKEN_ENDPOINT=https://esignet.ida.fayda.et/token
USERINFO_ENDPOINT=https://esignet.ida.fayda.et/userinfo
REDIRECT_URI=http://localhost:3000/callback
```

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - Different permissions for different user types
- **Password Hashing** - bcrypt for secure password storage
- **Rate Limiting** - Prevent abuse of API endpoints
- **Input Validation** - Comprehensive request validation
- **SQL Injection Protection** - Parameterized queries
- **CORS Configuration** - Cross-origin resource sharing
- **Helmet Security** - Security headers

## 📈 Features

### For Super Admins
- System-wide user management
- Hospital management
- System settings configuration
- Comprehensive statistics

### For Hospital Admins
- Doctor management within their hospital
- Patient overview
- Appointment management
- Hospital-specific statistics

### For Doctors
- Patient management
- Appointment scheduling
- Consultation recording
- Prescription management
- Medical record access

### For Patients
- Appointment booking
- Medical record upload
- Doctor/hospital search
- Consultation history
- Prescription tracking

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### Example API Calls

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@example.com","password":"password123"}'

# Get profile (with token)
curl -X GET http://localhost:5000/api/doctor/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🚀 Deployment

### Docker Deployment

```bash
# Build image
docker build -t hakim-ai-backend .

# Run container
docker run -p 5000:5000 --env-file .env hakim-ai-backend
```

### Production Considerations

1. **Environment Variables** - Set all production environment variables
2. **Database** - Use production MySQL instance
3. **SSL/TLS** - Enable HTTPS in production
4. **Monitoring** - Set up application monitoring
5. **Backup** - Regular database backups
6. **Rate Limiting** - Configure appropriate rate limits

## 📝 API Documentation

### Request/Response Format

All API endpoints follow a consistent format:

**Success Response:**
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

### Pagination

List endpoints support pagination:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for better healthcare management** 