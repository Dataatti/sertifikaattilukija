import type { NextApiResponse } from 'next';
import { scrapeGreenKey } from 'services/scrapers/green-key';
import { checkCors, corsOptions } from 'utils/cors';
import { databaseHoc, NextRequestWithDb } from 'utils/database';
import { getErrorMessage } from 'utils/utils';

export const handler = async (req: NextRequestWithDb, res: NextApiResponse) => {
  try {
    await checkCors(req, res, corsOptions);
    // 1. step
    const ok = await scrapeGreenKey(req.db);
    res.status(200).json(ok);
  } catch (error) {
    res.status(500).json({ msg: getErrorMessage(error) });
  }
};

export default databaseHoc()(handler);
