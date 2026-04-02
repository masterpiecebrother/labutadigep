import { addAuditEvent, getAppState, saveAppState } from './_lib/store.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const state = await getAppState();
    return res.status(200).json(state);
  }

  if (req.method === 'POST') {
    try {
      const next = await saveAppState(req.body);
      await addAuditEvent({
        id: `evt_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorId: req.headers['x-user-id'] || 'unknown',
        actorName: req.headers['x-user-name'] || 'Usuário',
        action: 'state.updated',
        details: `users=${next.users.length}; tasks=${next.tasks.length}`,
      });
      return res.status(200).json({ ok: true, state: next });
    } catch (error) {
      return res.status(400).json({ ok: false, error: error.message || 'Invalid payload' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
