const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const downloadPath = path.resolve("./download");

function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-z0-9]/gi, "_") // Replace special characters with underscores
    .replace(/_+/g, "_") // Replace multiple underscores with single
    .replace(/^_+|_+$/g, "") // Trim underscores from start/end
    .substring(0, 100); // Limit filename length
}

async function scrapeNewContracts(options = {}) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    const PAGE_SIZE = 1;
    const RES = [];

    // // Set up download behavior
    // await client.send("Page.setDownloadBehavior", {
    //   behavior: "allow",
    //   downloadPath: "./downloads", // Specify your download directory
    // });

    await page.goto(
      `https://sam.gov/search/?page=1&pageSize=${PAGE_SIZE}&sort=-modifiedDate&sfm%5BsimpleSearch%5D%5BkeywordRadio%5D=ALL&sfm%5BsimpleSearch%5D%5BkeywordTags%5D%5B0%5D%5Bkey%5D=roof&sfm%5BsimpleSearch%5D%5BkeywordTags%5D%5B0%5D%5Bvalue%5D=roof&sfm%5Bstatus%5D%5Bis_active%5D=true`,
      { waitUntil: "networkidle2" }
    );

    await page.setViewport({ width: 800, height: 800 });

    const searchInput = await page.$(
      "#filtersBody > sds-filters > div > formly-form > formly-field > sam-formly-wrapper-animation > div > ng-component > formly-group > formly-field:nth-child(1) > sam-formly-wrapper-animation > div > ng-component > div > sds-tabs > div.sds-tabs__content > sds-tab-panel:nth-child(1) > div > formly-field > sam-formly-wrapper-animation > div > ng-component > formly-group > formly-field:nth-child(2) > sam-formly-wrapper-animation > div > app-keyword-formly-field-text > app-keyword-text > div > input"
    );

    await searchInput.type("roof");
    await searchInput.press("Enter");

    const parentSelector =
      "#main-container > app-frontend-search-home > div > div > div > div.desktop\\:grid-col-8.tablet-lg\\:grid-col-12.mobile-lg\\:grid-col-12 > search-list-layout > div:nth-child(2) > div > div > sds-search-result-list";
    const parentElement = await page.$(parentSelector);

    if (!parentElement) return "No such element";

    const LINK = await page.evaluate(() => {
      const parentElement = document.querySelector(
        "#main-container > app-frontend-search-home > div > div > div > div.desktop\\:grid-col-8.tablet-lg\\:grid-col-12.mobile-lg\\:grid-col-12 > search-list-layout > div:nth-child(2) > div > div > sds-search-result-list"
      );
      if (!parentElement) {
        throw new Error("Parent element not found");
      }

      const anchorTags = parentElement.querySelectorAll(
        "#main-container > app-frontend-search-home > div > div > div > div.desktop\\:grid-col-8.tablet-lg\\:grid-col-12.mobile-lg\\:grid-col-12 > search-list-layout > div:nth-child(2) > div > div > sds-search-result-list > div > div > app-opportunity-result > div > div.grid-col-12.tablet\\:grid-col-9 > div:nth-child(1) > div > h3 > a"
      );

      const links = [];
      anchorTags.forEach((anchor) => {
        if (anchor.href) {
          links.push(anchor.href);
        }
      });

      return links;
    });

    const client = await page.createCDPSession();
    await client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: downloadPath,
    });

    // FILTER FOR EACH URL
    for (const link of LINK) {
      try {
        await page.goto(link, { waitUntil: "networkidle2" });

        // GET USEFUL CONTENT
        const content = await page.evaluate((el) => {
          return {
            place_of_performance: document.querySelector(
              "#classification-pop > div:nth-child(2)"
            ),
            department: document.querySelector(
              "#header-hierarchy-level > div > div:nth-child(2)"
            ),
            title:
              document.querySelector(
                "#main-container > ng-component > page > div > div > div.page-content.row > div.nine.wide.column > div.usa-width-three-fourths.br-double-after.ng-star-inserted > h1"
              )?.textContent || " ",
            active:
              document
                .querySelector(
                  "#header > div.sam-ui.padded.raised.segment > div.opportunity-top-left"
                )
                ?.textContent.trim() || " ",
            _id:
              document
                .querySelector(
                  "#header-solicitation-number > div > div.description"
                )
                ?.textContent.trim() || " ",
            updated_published_date:
              document.querySelector("#general-published-date")?.textContent ||
              "",
            original_published_date:
              document.querySelector("#general-original-published-date")
                .textContent || " ",
            contract_opp_type:
              document.querySelector("#general-type")?.textContent || "",
            original_inactive_type:
              document.querySelector("#general-original-published-date")
                ?.textContent || "",
            updated_inactive_date:
              document.querySelector("#general-original-archive-date")
                ?.textContent || " ",
            place_of_performance: "",
            original_set_aside:
              document.querySelector("#classification-original-set-aside")
                ?.textContent || "",
            product_service_code:
              document.querySelector("#classification-classification-code")
                ?.textContent || "",
            description:
              document.querySelector("#description")?.textContent || "",
            contracting_office_address:
              document.querySelector("#-contracting-office")?.textContent ||
              " ",
            primary_email:
              document.querySelector("#contact-primary-poc-email")
                ?.textContent || " ",
            primary_tel:
              document.querySelector("#contact-primary-poc-phone")
                ?.textContent || " ",
            department:
              document.querySelector(
                "#header-hierarchy-level > div > div:nth-child(2)"
              )?.textContent || " ",
            secondary_email:
              document.querySelector("#contact-secondary-poc-email")
                ?.textContent || "",
            secondary_tel:
              document.querySelector("#contact-secondary-poc-phone")
                ?.textContent || "",
          };
        });


        const baseFilename = sanitizeFilename(content.title) || 
        `opportunity_${content._id || Date.now()}`;
        console.log("🚀 ~ content ~ content:", content);

        console.log("scrolled------------1000");
        await page.evaluate((scrollDistance) => {
          window.scrollBy({
            top: scrollDistance,
            behavior: "smooth",
          });
        }, 50000);

        console.log("scrolled------------1000");
        await page.evaluate((scrollDistance) => {
          window.scrollBy({
            top: scrollDistance,
            behavior: "smooth",
          });
        }, 50000);

        console.log("scrolled------------1500");
        await page.mouse.wheel({ deltaY: 5000000 });
        console.log("scrolled------------19000");

        // Create downloads directory if it doesn't exist
        if (!fs.existsSync("./downloads")) {
          fs.mkdirSync("./downloads");
        }

        const db = await page
          .locator(
            "#attachments-links > div:nth-child(2) > span.download-button.ng-star-inserted > a > span:nth-child(2)"
          )
          .waitHandle();
        let mainJSON = {};
        if (db) {
          await db.click();

          // Enable downloads

          const lb = page.locator("#attachments-links > div:nth-child(3) > a");
          console.log("🚀 ~ scrapeNewContracts ~ lb:", lb);
          await lb.click();

          // const downloadedFile = {
          //   filename: downloadedFile,
          //   path: path.join(downloadPath, downloadedFile),
          //   size: fs.statSync(path.join(downloadPath, downloadedFile)).size,
          //   // Optional: Include file content as base64
          //   content: fs.readFileSync(
          //     path.join(downloadPath, downloadedFile),
          //     "base64"
          //   ),
          // };
          // console.log(
          //   "🚀 ~ scrapeNewContracts ~ downloadedFile:",
          //   downloadedFile
          // );
        }
      } catch (error) {
        console.error(`Error processing ${link}:`, error);
      }
    }

    console.log(RES);

    // res.send(RES);
  } catch (error) {
    console.log("🚀 ~ scrapeNewContracts ~ error:", error);
    throw error;
  } finally {
    // browser.close();
  }
}

scrapeNewContracts();
