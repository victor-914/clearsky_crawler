const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const processDirectory = require("./helpers");
const app = express();
const PORT = 4100;

// For JSON bodies
app.use(express.json()); // replaces bodyParser.json()

// For URL-encoded form data
app.use(express.urlencoded({ extended: true })); // replaces bodyParser.urlencoded()

app.post("/download_files", async (req, res) => {
  const data = req.body;
  // Define download directory
  const downloadDir = path.join(__dirname, "downloads");
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
  }

  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-web-security",
    ],
  });

  try {
    const page = await browser.newPage();
    const client = await page.createCDPSession();

    // Set up download behavior
    await client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: downloadDir,
    });

    console.log("...........................running data");

    // Loop through each object in the array
    for (const item of data) {
      console.log(`Processing ${item.name}...`);

      // Create a subdirectory for this category
      const categoryDir = path.join(downloadDir, item.title);
      if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir);
      }

      // Update download path for this category
      await client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: categoryDir,
      });

      // Loop through each link in the current object
      for (const link of item.links) {
        try {
          console.log(`Downloading ${link}...`);

          // Navigate to the download link
          await page.goto(link, {
            waitUntil: "networkidle2",
            timeout: 60000,
          });

          // Wait for download to complete (simple approach)
          await page.waitForTimeout(5000);

          // Process the most recently downloaded file
          const files = fs.readdirSync(categoryDir);
          if (files.length > 0) {
            // Get the most recent file (simple approach)
            const mostRecentFile = files
              .map((file) => ({
                name: file,
                path: path.join(categoryDir, file),
              }))
              .sort(
                (a, b) =>
                  fs.statSync(b.path).mtime.getTime() -
                  fs.statSync(a.path).mtime.getTime()
              )[0];

            // Extract content
            await extractContent(mostRecentFile.path);
          }
        } catch (error) {
          console.error(`Error processing ${link}:`, error.message);
        }
      }
    }

    console.log("All downloads and extractions completed!");
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await browser.close();

    try {
      // Change this to your download folder path
      const downloadFolder =
        "/home/victor/Desktop/work/ai_bid_agent/crawler/extractor_server/downloads";

      console.log(
        "⏳ Processing files... This may take a while for large directories...\n"
      );
      const results = await processDirectory(downloadFolder);

      const result = data.map((itemA) => {
        const match = results.directories.find(
          (itemB) => itemB.name === itemA.title
        );
        return match ? { ...itemA, ...match } : itemA;
      });

      console.log("🚀 ~ result ~ result:", result);

      res.send(result);

      fs.rm("/home/victor/Desktop/work/ai_bid_agent/crawler/extractor_server/downloads", { recursive: true, force: true }, (err) => {
        if (err) {
          console.error("Error deleting folder:", err);
          return;
        }
        console.log("Folder deleted successfully");
      });
    } catch (err) {
      console.error("❌ Error:", err);
    }

    // Run the main function
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
