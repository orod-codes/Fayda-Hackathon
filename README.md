# Hakmin Health Assistant

A comprehensive AI-powered health assistance system designed for Ethiopia, supporting English, Amharic, and Afaan Oromo languages.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Get your OpenAI API key:**
   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Sign up or log in to your account
   - Navigate to "API Keys" in your dashboard
   - Click "Create new secret key"
   - Copy the key and paste it in your `.env.local` file

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 User Roles

### 👤 **Patient**
- **Authentication**: Fayda OIDC + Phone OTP verification
- **Features**: 
  - AI health chat with direct ChatGPT integration
  - Emergency detection and alerts
  - Medical history management
  - Document uploads
  - Medication reminders
  - Video consultations
  - Health device integration

### 👨‍⚕️ **Doctor**
- **Authentication**: Email/Password (created by Hospital Admin)
- **Features**:
  - Access patient data via Fayda ID search
  - View complete medical history
  - Review AI consultation logs
  - Add diagnoses and treatment notes
  - AI-powered drug interaction checks
  - Generate medical reports

### 🏥 **Hospital Admin**
- **Authentication**: Email/Password
- **Features**:
  - Create and manage doctor accounts
  - Monitor hospital activities
  - View analytics and reports
  - Manage hospital resources

### 👑 **Super Admin**
- **Authentication**: Email/Password
- **Features**:
  - System-wide management
  - Hospital and admin oversight
  - Security monitoring
  - Activity logs and analytics

## 🤖 ChatGPT Integration

The patient chat feature uses **direct ChatGPT integration** for intelligent health assistance:

- **Real-time responses** from OpenAI's GPT-3.5-turbo model
- **Multilingual support** (English, Amharic, Afaan Oromo)
- **Emergency detection** with automatic alerts
- **Cultural sensitivity** for Ethiopian context
- **Fallback mode** with intelligent demo responses when API key is not configured

### Demo Mode vs ChatGPT Mode

- **Without API Key**: Intelligent demo responses for common health questions
- **With API Key**: Full ChatGPT integration with real-time AI responses

## 🎨 Features

- **Modern UI/UX** with glass-morphism design
- **Light/Dark Mode** support across all pages
- **Responsive Design** for mobile and desktop
- **Role-based Access Control**
- **Multilingual Interface**
- **Real-time Chat** with AI health assistant
- **Emergency Detection** and alerts
- **Medical History Management**
- **Document Upload System**
- **Medication Reminders**

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **AI Integration**: OpenAI GPT-3.5-turbo
- **Authentication**: Fayda OIDC (Patients) + Email/Password (Staff)

## 📱 Pages Structure

```
/                    # Main landing page (role selection)
/patient             # Patient dashboard
/patient/login       # Patient login (Fayda + OTP)
/doctor              # Doctor dashboard  
/doctor/login        # Doctor login
/hospital-admin      # Hospital admin dashboard
/hospital-admin/login # Hospital admin login
/super-admin         # Super admin dashboard
/super-admin/login   # Super admin login
/chat                # AI health chat (patients only)
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for ChatGPT integration | Yes (for full AI features) |

### Demo Credentials

For testing purposes, you can use these demo credentials:

**Doctor Login:**
- Email: `doctor@hakmin.com`
- Password: `demo123`

**Hospital Admin Login:**
- Email: `admin@hakmin.com` 
- Password: `demo123`

**Super Admin Login:**
- Email: `superadmin@hakmin.com`
- Password: `demo123`

## 🚨 Emergency Features

The system includes automatic emergency detection for:
- Chest pain or pressure
- Severe bleeding
- Difficulty breathing
- Severe head injury
- Loss of consciousness
- Severe abdominal pain
- Signs of stroke

When emergency symptoms are detected, the system immediately advises calling emergency services.

## 🌍 Multilingual Support

The system supports three languages:
- **English** - Primary interface language
- **Amharic** - አማርኛ
- **Afaan Oromo** - Afaan Oromoo

All AI responses are provided in the user's preferred language.

## 📄 License

This project is designed for the Hakmin Health System in Ethiopia. 