import time
import cv2
import numpy as np
import requests
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

# ==============================
# Freeze Detection (OpenCV)
# ==============================
def detect_freeze(video_path):
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        print("❌ Could not open video")
        return 0

    frame_count = 0
    freeze_count = 0
    prev_frame = None

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        if prev_frame is not None:
            diff = cv2.absdiff(prev_frame, frame_gray)
            non_zero_count = np.count_nonzero(diff)

            # Threshold for detecting a freeze
            if non_zero_count < 100:
                freeze_count += 1

        prev_frame = frame_gray
        frame_count += 1

    cap.release()

    freeze_percent = (freeze_count / frame_count) * 100 if frame_count > 0 else 0
    return freeze_percent


# ==============================
# Selenium Test
# ==============================
def playback_test(video_url, video_path, video_name):
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # run without opening window
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    try:
        # Try to use ChromeDriverManager for automatic driver management
        from webdriver_manager.chrome import ChromeDriverManager
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    except ImportError:
        # Fallback to system PATH or local chromedriver
        print("⚠️  webdriver-manager not installed. Trying system chromedriver...")
        try:
            driver = webdriver.Chrome(options=chrome_options)  # Use system PATH
        except:
            print("❌ Please install chromedriver or run: pip install webdriver-manager")
            return

    try:
        driver.get(video_url)
        print(f"✅ Loaded video URL: {video_url}")
        
        video = driver.find_element(By.TAG_NAME, "video")
        print("✅ Found video element")
    except Exception as e:
        print(f"❌ Error loading video: {e}")
        driver.quit()
        return

    # Startup time
    start = time.time()
    driver.execute_script("arguments[0].play()", video)
    time.sleep(2)  # wait for video to start
    startup_time = time.time() - start

    # Simulate buffering
    driver.execute_script("arguments[0].pause()", video)
    time.sleep(1)
    driver.execute_script("arguments[0].play()", video)
    buffering_count = 1
    buffering_duration = 1.0

    # Resolution (mock for now, could parse video.src)
    avg_resolution = "1080p"

    driver.quit()

    # Freeze Detection
    freeze_percent = detect_freeze(video_path)

    # Combine results
    data = {
        "video_name": video_name,
        "startup_time": round(startup_time, 2),
        "buffering_count": buffering_count,
        "buffering_duration": buffering_duration,
        "avg_resolution": avg_resolution,
        "freeze_percent": round(freeze_percent, 2)
    }

    # Send to backend
    try:
        res = requests.post("http://localhost:5000/api/videos/add", json=data)
        print("📡 Data sent to backend:", res.json())
    except Exception as e:
        print("❌ Error sending data:", e)

    print("✅ Final Results:", data)


# ==============================
# Run Test
# ==============================
if __name__ == "__main__":
    # Example usage:
    playback_test(
        video_url="http://localhost:3000",  # React frontend running on port 3000
        video_path="https://www.w3schools.com/html/mov_bbb.mp4",  # Use online video for testing
        video_name="Sample Integrated Test"
    )
