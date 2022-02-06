import type { NextApiResponse } from 'next';
import { scraper } from 'services/scrapers/scraper';
import { checkCors, corsOptions } from 'utils/cors';
import { databaseHoc, NextRequestWithDb } from 'utils/database';
import { getErrorMessage } from 'utils/utils';
import configs from 'services/scrapers/scrapers.json';

export const handler = async (req: NextRequestWithDb, res: NextApiResponse) => {
  try {
    await checkCors(req, res, corsOptions);

    const dataSource = req.query._id;
    const validDataSource = configs.some((config) => config.id === dataSource);
    if (!validDataSource) {
      throw new Error('Invalid data source!');
    }

    const ok = await scraper(req.db, req.query._id as string);

    res.status(200).json(ok);
  } catch (error) {
    res.status(500).json({ msg: getErrorMessage(error) });
  }
};

export default databaseHoc()(handler);
