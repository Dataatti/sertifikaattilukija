import type { NextApiRequest, NextApiResponse } from 'next';
import { getCompanyInformation } from 'services/company';

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // 1. step
    const ok = await getCompanyInformation();
    res.status(200).json(ok);
  } catch (error) {
    let message;
    if (error instanceof Error) {
      message = error.message;
    } else {
      message = String(error);
    }
    res.status(500).json({ msg: message });
  }
};

export default handler;
