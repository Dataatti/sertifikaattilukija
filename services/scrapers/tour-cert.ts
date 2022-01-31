import { getErrorMessage, sleep } from 'utils/utils';
import { upsertCompanyCertificates } from 'utils/database';
import type { Knex } from 'knex';
import { processTourCert } from '.';

/**
 * Function for parsing https://www.tourcert.org/wp-content/themes/tc_theme/search-ajax-test.php?page=1&vis=0&typ=undefined&s=Finland&cat=&cert=&lang=en
 * @returns status as boolean, true = ok
 */
export const scrapeTourCert = async (db: Knex<any, unknown[]>) => {
  for (let i = 0; i < 5; i++) {
    try {
      const res = await fetch(
        'https://www.tourcert.org/wp-content/themes/tc_theme/search-ajax-test.php?page=1&vis=0&typ=undefined&s=Finland&cat=&cert=&lang=en'
      );
      const html = await res.text();
      const data = processTourCert(html);
      await upsertCompanyCertificates(data, db);
      return true;
    } catch (error) {
      console.error('Something went wrong with scrapeTourCert, try again after delay');
      console.error(getErrorMessage(error));
      await sleep(30 * 1000);
    }
  }
  return false;
};
