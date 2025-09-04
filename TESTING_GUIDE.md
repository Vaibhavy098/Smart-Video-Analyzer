# Smart Video Analyzer - Testing Guide

## 🚀 Quick Setup

### 1. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 2. Install Node.js Dependencies (Backend)
```bash
cd Backend
npm install selenium-webdriver
```

### 3. Chrome WebDriver Setup
The Python scripts will automatically manage ChromeDriver using `webdriver-manager`. For JavaScript, make sure Chrome is installed.

## 🧪 Running Tests

### JavaScript Testing (Selenium + Node.js)
```bash
cd Backend
node videoTest.js
```
- Tests video playback using Selenium WebDriver
- Measures startup time, buffering, and basic metrics
- Automatically sends results to your backend API

### Python Testing - Full Analysis
```bash
cd tests
python playback_test.py
```
- Combines Selenium automation with OpenCV video analysis
- Tests your React frontend at http://localhost:3000
- Measures freeze detection, startup time, and buffering

### Python Testing - Freeze Detection Only
```bash
cd tests
python freeze_detector.py "path/to/video.mp4" "Video Name"
```
- Analyzes local video files for freeze detection
- Uses OpenCV to compare consecutive frames
- Sends results to backend API

## 📊 What Gets Measured

- **Startup Time**: Time from play button to first frame
- **Buffering Count**: Number of buffering events
- **Buffering Duration**: Total time spent buffering
- **Average Resolution**: Video quality detection
- **Freeze Percentage**: Percentage of frames that appear frozen

## 🔧 Troubleshooting

### Chrome Issues
- Make sure Google Chrome is installed
- For headless mode issues, remove `--headless` flag in Python scripts

### Video File Issues
- Ensure video files are in supported formats (MP4, AVI, MOV)
- For online videos, check URL accessibility
- OpenCV supports most common video formats

### Backend Connection
- Make sure your backend server is running on port 5000
- Check that the `/api/videos/add` endpoint is working
- Verify CORS settings allow connections from test scripts

## 📈 Viewing Results

1. Start your backend: `node server.js` (from Backend directory)
2. Start your frontend: `npm start` (from frontend directory)
3. Run any test script
4. View results in your React dashboard at http://localhost:3000

## 🎯 Example Test URLs

For JavaScript testing:
- Direct MP4: `https://www.w3schools.com/html/mov_bbb.mp4`
- Your React app: `http://localhost:3000`

For Python testing:
- Download sample videos or use your React app as the test target
