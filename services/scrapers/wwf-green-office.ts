import * as cheerio from 'cheerio';
import { getErrorMessage, sleep } from 'utils/utils';
import { upsertCompanyCertificates } from 'utils/database';
import type { Knex } from 'knex';

export const scrapeCertificates = (html: string): ApiCompanyCertificate[] => {
  const $ = cheerio.load(html);
  const output: ApiCompanyCertificate[] = [];
  $(
    '#content .container-fluid.text-block.go-pillar .text-block__text > p:nth-of-type(-n+2) > a'
  ).each((index, node) => {
    // Trim whitespace and trailing comma
    const companyName = $(node).text().trim().replace(/(,$)/g, '');
    if (companyName) {
      output.push({ companyName, certificateId: 'wwf-green-office' });
    }
  });
  return output;
};

/**
 * Function for scraping wwf.fi/greenoffice/asiakkaat
 * @returns status as boolean, true = ok
 */
export const scrapeWWFGreenOffice = async (db: Knex<any, unknown[]>) => {
  for (let i = 0; i < 5; i++) {
    try {
      const res = await fetch('https://wwf.fi/greenoffice/asiakkaat/');
      const html = await res.text();
      const data = scrapeCertificates(html);
      await upsertCompanyCertificates(data, db);
      return true;
    } catch (error) {
      console.error('Something went wrong with scrapeWWFGreenOffice, try again after delay');
      console.error(getErrorMessage(error));
      await sleep(30 * 1000);
    }
  }
  return false;
};
