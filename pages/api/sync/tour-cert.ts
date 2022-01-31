import type { NextApiResponse } from 'next';
import { scrapeTourCert } from 'services/scrapers/tour-cert';
import { checkCors, corsOptions } from 'utils/cors';
import { databaseHoc, NextRequestWithDb } from 'utils/database';
import { getErrorMessage } from 'utils/utils';

export const handler = async (req: NextRequestWithDb, res: NextApiResponse) => {
  try {
    // 1. step
    await checkCors(req, res, corsOptions);
    const ok = await scrapeTourCert(req.db);
    res.status(200).json(ok);
  } catch (error) {
    res.status(500).json({ msg: getErrorMessage(error) });
  }
};

export default databaseHoc()(handler);
