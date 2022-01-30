import * as cheerio from 'cheerio';
import { getErrorMessage, sleep } from 'utils/utils';
import { upsertCompanyCertificates } from 'utils/database';
import type { Knex } from 'knex';
import { processWWFGreenOffice } from '.';

/**
 * Function for scraping wwf.fi/greenoffice/asiakkaat
 * @returns status as boolean, true = ok
 */
export const scrapeWWFGreenOffice = async (db: Knex<any, unknown[]>) => {
  for (let i = 0; i < 5; i++) {
    try {
      const res = await fetch('https://wwf.fi/greenoffice/asiakkaat/');
      const html = await res.text();
      const data = processWWFGreenOffice(html);
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
