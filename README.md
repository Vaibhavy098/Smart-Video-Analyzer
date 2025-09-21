# 🎬 Smart Video Quality Analyzer

A comprehensive video quality testing and analysis platform that measures video playback performance, detects freezing, and provides real-time analytics.

## ✨ Features

- **Automated Video Testing**: Selenium-powered testing for startup time and buffering analysis
- **Freeze Detection**: OpenCV-based frame analysis to detect video freezing
- **Real-time Dashboard**: React frontend with live charts and analytics
- **RESTful API**: Express.js backend with MySQL database
- **Multi-language Support**: Both JavaScript (Node.js) and Python testing scripts
- **Socket.io Integration**: Real-time updates for test results

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **Socket.io Client** - Real-time updates

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Socket.io** - WebSocket communication
- **CORS** - Cross-origin resource sharing

### Testing & Analysis
- **Selenium WebDriver** - Browser automation (JavaScript & Python)
- **OpenCV** - Computer vision and video analysis
- **ChromeDriver** - Browser automation driver

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14+)
- **Python** (v3.8+)
- **MySQL** (v5.7+)
- **Google Chrome** browser

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/smart-video-analyzer.git
cd smart-video-analyzer
```

### 2. Database Setup
```bash
mysql -u root -p < schema.sql
```

### 3. Environment Variables
```bash
cp .env.example Backend/.env
# Edit Backend/.env with your actual database credentials
```
**⚠️ Important:** See [SECURITY.md](SECURITY.md) for credential management

### 4. Backend Setup
```bash
cd Backend
npm install
node server.js
```

### 5. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 6. Python Testing Setup
```bash
pip install -r requirements.txt
```

## 📊 Usage

### Web Interface
1. Open http://localhost:3000
2. Enter a video URL in the player
3. View analytics in the dashboard

### Automated Testing

#### JavaScript Testing
```bash
cd Backend
node videoTest.js
```

#### Python Testing
```bash
# Full analysis (Selenium + OpenCV)
cd tests
python playback_test.py

# Freeze detection only
python freeze_detector.py "video.mp4" "Test Video"
```

## 🔧 Configuration

### Database Configuration
Update `Backend/db.js` with your MySQL credentials:
```javascript
const db = mysql.createConnection({
  host: "localhost",
  user: "your_username",
  password: "your_password",
  database: "video_analyzer"
});
```

### Environment Variables
Create a `.env` file in the Backend directory:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=video_analyzer
PORT=5000
```

## 📈 API Endpoints

- `GET /api/videos` - Retrieve all video test results
- `POST /api/videos/add` - Add new test results
- `GET /api/health` - Health check endpoint

## 🧪 Testing

The project includes comprehensive testing scripts:

- **JavaScript**: Browser automation with Selenium WebDriver
- **Python**: Computer vision analysis with OpenCV
- **Manual**: Web interface for interactive testing

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for detailed instructions.

## 📁 Project Structure

```
smart-video-analyzer/
├── Backend/
│   ├── routes/
│   ├── server.js
│   ├── db.js
│   ├── videoTest.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── tests/
│   ├── playback_test.py
│   └── freeze_detector.py
├── schema.sql
├── requirements.txt
├── TESTING_GUIDE.md
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔍 Troubleshooting

### Common Issues

1. **Chrome WebDriver**: Ensure Chrome browser is installed
2. **Database Connection**: Verify MySQL service is running
3. **Port Conflicts**: Default ports are 3000 (frontend) and 5000 (backend)
4. **Python Dependencies**: Run `pip install -r requirements.txt`

### Support

- Create an issue on GitHub
- Check the [TESTING_GUIDE.md](TESTING_GUIDE.md) for setup help

## 📊 Sample Results

The analyzer provides metrics including:
- **Startup Time**: 1.2-3.5 seconds typical range
- **Buffering Events**: Count and duration
- **Freeze Detection**: Percentage of frozen frames
- **Resolution Analysis**: Video quality assessment

---


