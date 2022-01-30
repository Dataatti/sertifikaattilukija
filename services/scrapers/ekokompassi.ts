import { getErrorMessage, sleep } from 'utils/utils';
import { upsertCompanyCertificates } from 'utils/database';
import type { Knex } from 'knex';
import { processEkokompassi } from '.';

/**
 * Function for scraping https://ekokompassi.fi/asiakkaamme/
 * @returns status as boolean, true = ok
 */
export const scrapeEkokompassi = async (db: Knex<any, unknown[]>) => {
  for (let i = 0; i < 5; i++) {
    try {
      const res = await fetch('https://ekokompassi.fi/asiakkaamme');
      const html = await res.text();
      const data = processEkokompassi(html);
      await upsertCompanyCertificates(data, db);
      return true;
    } catch (error) {
      console.error('Something went wrong with scrapeEkokompassi, try again after delay');
      console.error(getErrorMessage(error));
      await sleep(30 * 1000);
    }
  }
  return false;
};
