import type { NextApiResponse } from 'next';
import { getCompanyInformation } from 'services/company';
import { databaseHoc, NextRequestWithDb } from 'utils/database';
import { getErrorMessage } from 'utils/utils';

export const handler = async (req: NextRequestWithDb, res: NextApiResponse) => {
  try {
    // 1. step
    const ok = await getCompanyInformation(req.db);
    res.status(200).json(ok);
  } catch (error) {
    res.status(500).json({ msg: getErrorMessage(error) });
  }
};

export default databaseHoc()(handler);
