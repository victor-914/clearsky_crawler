import puppeteer from "puppeteer";

async function scrapeNewContracts(options = {}) {
  const {
    keyword = "roof",
    pageSize = 5,
    headless = false,
    baseUrl = "https://sam.gov/search/",
    viewport = { width: 800, height: 800 },
  } = options;

  const browser = await puppeteer.launch({ headless });
  const results = [];

  try {
    const page = await browser.newPage();
    await page.setViewport(viewport);

    // Navigate to search page
    await page.goto(
      `${baseUrl}?page=1&pageSize=${pageSize}&sort=-modifiedDate&sfm%5BsimpleSearch%5D%5BkeywordRadio%5D=ALL&sfm%5BsimpleSearch%5D%5BkeywordTags%5D%5B0%5D%5Bkey%5D=${keyword}&sfm%5BsimpleSearch%5D%5BkeywordTags%5D%5B0%5D%5Bvalue%5D=${keyword}&sfm%5Bstatus%5D%5Bis_active%5D=true`,
      { waitUntil: "networkidle2" }
    );

    // Enter search keyword
    const searchInput = await page.$(
      "#filtersBody > sds-filters > div > formly-form > formly-field > sam-formly-wrapper-animation > div > ng-component > formly-group > formly-field:nth-child(1) > sam-formly-wrapper-animation > div > ng-component > div > sds-tabs > div.sds-tabs__content > sds-tab-panel:nth-child(1) > div > formly-field > sam-formly-wrapper-animation > div > ng-component > formly-group > formly-field:nth-child(2) > sam-formly-wrapper-animation > div > app-keyword-formly-field-text > app-keyword-text > div > input"
    );

    if (searchInput) {
      await searchInput.type(keyword);
      await searchInput.press("Enter");
    }

    // Get all contract links from search results
    const links = await page.evaluate(() => {
      const parentElement = document.querySelector(
        "#main-container > app-frontend-search-home > div > div > div > div.desktop\\:grid-col-8.tablet-lg\\:grid-col-12.mobile-lg\\:grid-col-12 > search-list-layout > div:nth-child(2) > div > div > sds-search-result-list"
      );
      if (!parentElement) return [];

      const anchorTags = parentElement.querySelectorAll(
        "div > div > app-opportunity-result > div > div.grid-col-12.tablet\\:grid-col-9 > div:nth-child(1) > div > h3 > a"
      );

      return Array.from(anchorTags)
        .map((anchor) => anchor.href)
        .filter(Boolean);
    });

    // Scrape each contract page
    for (const link of links) {
      try {
        await page.goto(link, { waitUntil: "networkidle2" });

        const content = await page.evaluate(() => ({
          place_of_performance:
            document.querySelector("#classification-pop > div:nth-child(2)")
              ?.textContent || "",
          department:
            document.querySelector(
              "#header-hierarchy-level > div > div:nth-child(2)"
            )?.textContent || "",
          title:
            document
              .querySelector(
                "#main-container > ng-component > page > div > div > div.page-content.row > div.nine.wide.column > div.usa-width-three-fourths.br-double-after.ng-star-inserted > h1"
              )
              ?.textContent?.trim() || "",
          active:
            document
              .querySelector(
                "#header > div.sam-ui.padded.raised.segment > div.opportunity-top-left"
              )
              ?.textContent?.trim() || "",
          _id:
            document
              .querySelector(
                "#header-solicitation-number > div > div.description"
              )
              ?.textContent?.trim() || "",
          updated_published_date:
            document.querySelector("#general-published-date")?.textContent ||
            "",
          original_published_date:
            document.querySelector("#general-original-published-date")
              ?.textContent || "",
          contract_opp_type:
            document.querySelector("#general-type")?.textContent || "",
          original_inactive_type:
            document.querySelector("#general-original-published-date")
              ?.textContent || "",
          updated_inactive_date:
            document.querySelector("#general-original-archive-date")
              ?.textContent || "",
          original_set_aside:
            document.querySelector("#classification-original-set-aside")
              ?.textContent || "",
          product_service_code:
            document.querySelector("#classification-classification-code")
              ?.textContent || "",
          description:
            document.querySelector("#description")?.textContent || "",
          contracting_office_address:
            document.querySelector("#-contracting-office")?.textContent || "",
          primary_email:
            document.querySelector("#contact-primary-poc-email")?.textContent ||
            "",
          primary_tel:
            document.querySelector("#contact-primary-poc-phone")?.textContent ||
            "",
          secondary_email:
            document.querySelector("#contact-secondary-poc-email")
              ?.textContent || "",
          secondary_tel:
            document.querySelector("#contact-secondary-poc-phone")
              ?.textContent || "",
          url: link,
        }));

        // Try to get attachments if needed
        const attachmentsElement = await page.$(
          "#attachments-links > div.ng-star-inserted > div:nth-child(2)"
        );
        if (attachmentsElement) {
          // Add attachment handling logic here if needed
        }

        results.push(content);
      } catch (error) {
        console.error(`Error processing ${link}:`, error);
      }
    }

    return results;
  } catch (error) {
    console.error("Scraping error:", error);
    throw error;
  } finally {
    await browser.close();
  }
}

scrapeNewContracts();
