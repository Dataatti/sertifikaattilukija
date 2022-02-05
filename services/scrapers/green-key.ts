import { getErrorMessage, sleep } from 'utils/utils';
import { upsertCompanyCertificates } from 'utils/database';
import type { Knex } from 'knex';
import { processGreenKeyMain, processGreenKeyAland } from '.';

/**
 * Function for scraping https://greenkey.fi/kohteet/ and https://www.visitaland.com/fi/green-key/
 * @returns status as boolean, true = ok
 */
export const scrapeGreenKey = async (db: Knex<any, unknown[]>) => {
  for (let i = 0; i < 5; i++) {
    try {
      const responses = await Promise.all([
        fetch('https://greenkey.fi/kohteet/'),
        fetch('https://www.visitaland.com/fi/green-key/'),
      ]);
      const htmlMain = await responses?.[0].text();
      const htmlAland = await responses?.[1].text();
      const dataMain = processGreenKeyMain(htmlMain);
      const dataAland = processGreenKeyAland(htmlAland);
      const data = [...dataMain, ...dataAland];
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
