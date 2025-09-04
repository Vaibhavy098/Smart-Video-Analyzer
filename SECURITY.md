# 🔒 Security Setup Guide

## Environment Variables Configuration

This project now uses environment variables for secure credential management.

### ⚠️ IMPORTANT: Before Publishing to GitHub

1. **Never commit `.env` files** - They contain sensitive credentials
2. **The `.env` file is already in `.gitignore`** - This prevents accidental commits
3. **Use `.env.example` as a template** for other developers

### 🔧 Local Development Setup

1. **Copy the example file:**
   ```bash
   cp .env.example Backend/.env
   ```

2. **Fill in your actual credentials:**
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_actual_password_here
   DB_NAME=video_analyzer
   ```

3. **Start the server:**
   ```bash
   cd Backend
   npm start
   ```

### 🚀 Production Deployment

For production environments:

1. **Set environment variables** in your hosting platform:
   - Heroku: Use dashboard or CLI
   - AWS: Use Systems Manager Parameter Store
   - DigitalOcean: Use App Platform environment variables
   - Vercel: Use environment variables in dashboard

2. **Never use `.env` files in production** - Use your platform's secure variable storage

### 🛡️ Security Best Practices

- ✅ **Use strong passwords** with special characters
- ✅ **Rotate credentials** regularly
- ✅ **Use different credentials** for development/production
- ✅ **Enable database SSL** in production
- ✅ **Limit database user permissions** to only necessary operations

### 🔍 Environment Variables Used

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_HOST` | MySQL host | localhost | Yes |
| `DB_USER` | MySQL username | root | Yes |
| `DB_PASSWORD` | MySQL password | - | Yes |
| `DB_NAME` | Database name | video_analyzer | Yes |
| `DB_PORT` | MySQL port | 3306 | No |
| `PORT` | Server port | 5000 | No |
| `NODE_ENV` | Environment | development | No |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 | No |

### 🚨 What Changed from Original

**Before (INSECURE):**
```javascript
// Hardcoded credentials in db.js
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Vaibhavsql0988@",  // ❌ Exposed in code
  database: "video_analyzer"
});
```

**After (SECURE):**
```javascript
// Environment-based configuration
require('dotenv').config();
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,  // ✅ From .env file
  database: process.env.DB_NAME || "video_analyzer"
});
```

This ensures credentials are never committed to version control! 🔐
