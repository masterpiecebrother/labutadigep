import { kv } from '@vercel/kv';

const STATE_KEY = 'sistema-cgpe:state:v1';
const AUDIT_KEY = 'sistema-cgpe:audit:v1';

function hasKvConfig() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function sanitizeState(payload) {
  const safe = payload || {};
  if (!safe.users || !safe.tasks || !safe.systemConfig) return null;
  return {
    users: Array.isArray(safe.users) ? safe.users : [],
    tasks: Array.isArray(safe.tasks) ? safe.tasks : [],
    systemConfig: safe.systemConfig && typeof safe.systemConfig === 'object' ? safe.systemConfig : null,
  };
}

export async function getAppState() {
  if (hasKvConfig()) {
    const stored = await kv.get(STATE_KEY);
    return sanitizeState(stored);
  }

  return sanitizeState(globalThis.__SISTEMA_CGPE_STATE__);
}

export async function saveAppState(payload) {
  const nextState = sanitizeState(payload);
  if (!nextState) throw new Error('Invalid state payload.');

  if (hasKvConfig()) {
    await kv.set(STATE_KEY, nextState);
    return nextState;
  }

  globalThis.__SISTEMA_CGPE_STATE__ = nextState;
  return nextState;
}

function normalizeEvent(event) {
  if (!event || typeof event !== 'object') return null;
  return {
    id: event.id || `evt_${Date.now()}`,
    timestamp: event.timestamp || new Date().toISOString(),
    actorId: event.actorId || 'unknown',
    actorName: event.actorName || 'Sistema',
    action: event.action || 'state.updated',
    details: event.details || '',
  };
}

export async function addAuditEvent(event) {
  const safeEvent = normalizeEvent(event);
  if (!safeEvent) return null;

  if (hasKvConfig()) {
    const existing = (await kv.get(AUDIT_KEY)) || [];
    const next = [safeEvent, ...existing].slice(0, 300);
    await kv.set(AUDIT_KEY, next);
    return safeEvent;
  }

  if (!globalThis.__SISTEMA_CGPE_AUDIT__) {
    globalThis.__SISTEMA_CGPE_AUDIT__ = [];
  }
  globalThis.__SISTEMA_CGPE_AUDIT__ = [safeEvent, ...globalThis.__SISTEMA_CGPE_AUDIT__].slice(0, 300);
  return safeEvent;
}

export async function getAuditTrail(limit = 100) {
  const safeLimit = Math.min(Math.max(limit, 1), 300);
  if (hasKvConfig()) {
    const events = (await kv.get(AUDIT_KEY)) || [];
    return events.slice(0, safeLimit);
  }

  const events = globalThis.__SISTEMA_CGPE_AUDIT__ || [];
  return events.slice(0, safeLimit);
}
