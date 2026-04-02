import { getAuditTrail } from './_lib/store.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const limit = Number.parseInt(req.query?.limit || '100', 10);
  const safeLimit = Number.isNaN(limit) ? 100 : Math.min(Math.max(limit, 1), 300);
  const events = await getAuditTrail(safeLimit);
  return res.status(200).json({ events });
}
