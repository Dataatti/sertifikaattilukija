import type { NextApiRequest, NextApiResponse } from 'next';
import { syncSFTCertificates } from 'services/sft';
import { getErrorMessage } from 'utils/utils';

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // 1. step
    const ok = await syncSFTCertificates();
    res.status(200).json(ok);
  } catch (error) {
    res.status(500).json({ msg: getErrorMessage(error) });
  }
};

export default handler;
