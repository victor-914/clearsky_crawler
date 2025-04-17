const fs = require("fs");
const path = require("path");
const os = require("os");
const { promisify } = require("util");
const extract = require("extract-zip");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");
const xlsx = require("xlsx");

// Promisify fs functions
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

const tempDir = path.join(os.tmpdir(), "file_processor_temp");

// Temporary directory for zip extraction

async function ensureTempDir() {
  try {
    await mkdir(tempDir, { recursive: true });
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }
}

 function cleanFileName(filePath) {
  const basename = path.basename(filePath);
  // Remove .crdownload extension if present
  if (basename.endsWith(".crdownload")) {
    return {
      cleanedPath: filePath.replace(/\.crdownload$/, ""),
      wasCrdownload: true,
    };
  }
  return {
    cleanedPath: filePath,
    wasCrdownload: false,
  };
}

 async function extractTextFromFile(filePath) {
  const { cleanedPath } = cleanFileName(filePath);
  const ext = path.extname(cleanedPath).toLowerCase();

  try {
    switch (ext) {
      case ".pdf":
        const pdfData = await readFile(cleanedPath);
        const pdfText = await pdf(pdfData);
        return {
          content: pdfText.text,
          preview: pdfText.text.substring(0, 200),
        };

      case ".docx":
      case ".doc":
        const docxResult = await mammoth.extractRawText({ path: cleanedPath });
        return {
          content: docxResult.value,
          preview: docxResult.value.substring(0, 200),
        };

      case ".xlsx":
      case ".xls":
        const workbook = xlsx.readFile(cleanedPath);
        let xlsxText = "";
        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          xlsxText += xlsx.utils.sheet_to_csv(sheet) + "\n\n";
        });
        return {
          content: xlsxText,
          preview: xlsxText.substring(0, 200),
        };

      case ".txt":
      case ".csv":
      case ".json":
        const textContent = await readFile(cleanedPath, "utf8");
        return {
          content: textContent,
          preview: textContent.substring(0, 200),
        };

      default:
        return {
          content: null,
          preview: `[Binary file - no text extraction for ${ext}]`,
        };
    }
  } catch (err) {
    return {
      content: null,
      preview: `[Error extracting text: ${err.message}]`,
    };
  }
}

 async function processZipFile(zipPath, relativePath) {
  await ensureTempDir();
  const { cleanedPath } = cleanFileName(zipPath);
  const extractPath = path.join(tempDir, path.basename(cleanedPath, ".zip"));

  try {
    await extract(cleanedPath, { dir: extractPath });
    console.log(`\nExtracted ZIP contents from: ${relativePath}`);
    return await processDirectory(
      extractPath,
      path.join(relativePath, path.basename(cleanedPath))
    );
  } catch (err) {
    return { error: `ZIP extraction failed: ${err.message}` };
  }
}

 async function processFile(filePath, relativePath) {
  const { cleanedPath, wasCrdownload } = cleanFileName(filePath);
  const ext = path.extname(cleanedPath).toLowerCase();
  const stats = await stat(cleanedPath);

  const fileInfo = {
    name: path.basename(cleanedPath),
    path: relativePath,
    fullPath: cleanedPath,
    extension: ext,
    size: stats.size,
    isDirectory: false,
    wasCrdownload,
    createdAt: stats.birthtime,
    modifiedAt: stats.mtime,
  };

  if (ext === ".zip") {
    fileInfo.zipContents = await processZipFile(filePath, relativePath);
  } else {
    const { content, preview } = await extractTextFromFile(filePath);
    fileInfo.content = content;
    fileInfo.preview = preview;
  }

  return fileInfo;
}

  async function processDirectory(dirPath, relativePath = "") {
  const result = {
    name: path.basename(dirPath),
    path: relativePath || path.basename(dirPath),
    fullPath: dirPath,
    isDirectory: true,
    files: [],
    directories: [],
    fileCount: 0,
    directoryCount: 0,
  };

  try {
    const items = await readdir(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const itemRelativePath = path.join(relativePath, item);

      try {
        const itemStat = await stat(fullPath);

        if (itemStat.isDirectory()) {
          const subDir = await processDirectory(fullPath, itemRelativePath);
          result.directories.push(subDir);
          result.directoryCount += 1 + subDir.directoryCount;
          result.fileCount += subDir.fileCount;
        } else {
          const file = await processFile(fullPath, itemRelativePath);
          result.files.push(file);
          result.fileCount++;
        }
      } catch (err) {
        console.error(`Error processing ${fullPath}:`, err.message);
        result.files.push({
          name: item,
          path: itemRelativePath,
          error: err.message,
        });
      }
    }
  } catch (err) {
    result.error = err.message;
  }

  return result;
}


module.exports = processDirectory


// async function main() {
//   try {
//     // Change this to your download folder path
//     const downloadFolder =
//       "/home/victor/Desktop/work/ai_bid_agent/crawler/downloads";

//     console.log(
//       "⏳ Processing files... This may take a while for large directories...\n"
//     );
//     const results = await processDirectory(downloadFolder);

//     const result = k.map((itemA) => {
//       const match = results.directories.find((itemB) => itemB.name === itemA.title);
//       return match ? { ...itemA, ...match } : itemA;
//     });

//     console.log("🚀 ~ result ~ result:", result)

//   } catch (err) {
//     console.error("❌ Error:", err);
//   }
// }

// // Run the main function
// main();
