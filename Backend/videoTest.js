const { Builder, By } = require("selenium-webdriver");
const axios = require("axios");

async function runVideoTest(videoUrl, videoName) {
  console.log(`⚙️  Starting video test for: ${videoName}`);
  console.log(`🔗 Video URL: ${videoUrl}`);
  
  let driver;
  try {
    driver = await new Builder().forBrowser("chrome").build();
  } catch (err) {
    console.error("❌ Failed to start Chrome browser. Make sure Chrome is installed.");
    return;
  }

  try {
    // Load video page
    console.log("🌍 Loading video page...");
    await driver.get(videoUrl);
    console.log("✅ Page loaded successfully");

    console.log("🔍 Looking for video element...");
    const videoElement = await driver.findElement(By.tagName("video"));
    console.log("✅ Video element found");

    // Start time
    const startTime = Date.now();

    await driver.executeScript("arguments[0].play()", videoElement);

    // Wait until video starts playing
    await driver.wait(async () => {
      return await driver.executeScript("return arguments[0].currentTime > 0", videoElement);
    }, 10000);

    const startupTime = (Date.now() - startTime) / 1000;

    // Collect buffering stats (dummy for now)
    let bufferingCount = await driver.executeScript(`
      let count = 0;
      arguments[0].addEventListener("waiting", () => count++);
      return count;
    `, videoElement);

    // Example average resolution (mock)
    let avgResolution = "1080p";

    // Freeze percent detection (mock, real ML will come later)
    let freezePercent = Math.random() * 5;

    // Send results to backend
    await axios.post("http://localhost:5000/api/videos/add", {
      video_name: videoName,
      startup_time: startupTime,
      buffering_count: bufferingCount,
      buffering_duration: 2.3, // placeholder
      avg_resolution: avgResolution,
      freeze_percent: freezePercent
    });

    console.log(`✅ Test complete for ${videoName}`);
  } catch (err) {
    console.error("❌ Error running test:", err);
  } finally {
    await driver.quit();
  }
}

// Example usage:
runVideoTest("https://www.w3schools.com/html/mov_bbb.mp4", "Sample Video");
