import cv2
import numpy as np
import requests
import sys

def detect_freeze(video_path, video_name):
    print(f"⚙️  Starting freeze detection for: {video_name}")
    print(f"📁 Video path: {video_path}")
    
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        print("❌ Error: Could not open video. Check if the file exists and OpenCV supports this format.")
        return

    frame_count = 0
    freeze_count = 0
    prev_frame = None

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        if prev_frame is not None:
            # Compare with previous frame
            diff = cv2.absdiff(prev_frame, frame_gray)
            non_zero_count = np.count_nonzero(diff)

            # If very little difference → possible freeze
            if non_zero_count < 100:  # threshold
                freeze_count += 1

        prev_frame = frame_gray
        frame_count += 1

    cap.release()

    # Calculate freeze percentage
    freeze_percent = (freeze_count / frame_count) * 100 if frame_count > 0 else 0

    print(f"✅ Freeze detected: {freeze_percent:.2f}% of video")

    # Send results to backend
    data = {
        "video_name": video_name,
        "startup_time": 1.5,   # placeholder (could combine with Selenium)
        "buffering_count": 1,  # placeholder
        "buffering_duration": 2.1,
        "avg_resolution": "1080p",
        "freeze_percent": freeze_percent
    }

    try:
        res = requests.post("http://localhost:5000/api/videos/add", json=data)
        print("📡 Data sent to backend:", res.json())
    except Exception as e:
        print("❌ Error sending data:", e)

# Example usage:
if __name__ == "__main__":
    # Pass video path as CLI argument
    if len(sys.argv) < 3:
        print("Usage: python freeze_detector.py <video_path> <video_name>")
        print("Example: python freeze_detector.py 'sample_video.mp4' 'Test Video'")
        print("Note: For online videos, download first or use playback_test.py instead")
    else:
        detect_freeze(sys.argv[1], sys.argv[2])
