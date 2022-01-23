import type { NextApiRequest, NextApiResponse } from 'next';
import { scrapeWWFGreenOffice } from 'services/scrapers/wwf-green-office';
import { getErrorMessage } from 'utils/utils';

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // 1. step
    const ok = await scrapeWWFGreenOffice();
    res.status(200).json(ok);
  } catch (error) {
    res.status(500).json({ msg: getErrorMessage(error) });
  }
};

export default handler;