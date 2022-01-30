import type { NextApiResponse } from 'next';
import { scrapeEkokompassi } from 'services/scrapers/ekokompassi';
import { syncSFTCertificates } from 'services/sft';
import { databaseHoc, NextRequestWithDb } from 'utils/database';
import { getErrorMessage } from 'utils/utils';

export const handler = async (req: NextRequestWithDb, res: NextApiResponse) => {
  try {
    // 1. step
    const ok = await scrapeEkokompassi(req.db);
    res.status(200).json(ok);
  } catch (error) {
    res.status(500).json({ msg: getErrorMessage(error) });
  }
};

export default databaseHoc()(handler);
