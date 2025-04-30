import { openByUrlWithToken } from '@/lib/barriers';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.query.token;

  const open = await openByUrlWithToken(token as string)
  if(open.status === 'error') {
    res.status(500).json({ message: `error: ${open.error}` });
  }

  res.status(200).json({ message: 'success' });
}
