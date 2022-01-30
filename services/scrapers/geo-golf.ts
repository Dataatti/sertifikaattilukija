import { getErrorMessage, sleep } from 'utils/utils';
import { upsertCompanyCertificates } from 'utils/database';
import type { Knex } from 'knex';
import { processGEOGolf } from '.';

/**
 * Function for parsing https://sustainable.golf/system/get-directory.json?formattedAddress=&boundsNorthEast=&boundsSouthWest=
 * @returns status as boolean, true = ok
 */
export const scrapeGEOGolf = async (db: Knex<any, unknown[]>) => {
  for (let i = 0; i < 5; i++) {
    try {
      const res = await fetch(
        'https://sustainable.golf/system/get-directory.json?formattedAddress=&boundsNorthEast=&boundsSouthWest='
      );
      const json = await res.json();
      const data = processGEOGolf(json);
      await upsertCompanyCertificates(data, db);
      return true;
    } catch (error) {
      console.error('Something went wrong with scrapeGEOGolf, try again after delay');
      console.error(getErrorMessage(error));
      await sleep(30 * 1000);
    }
  }
  return false;
};
