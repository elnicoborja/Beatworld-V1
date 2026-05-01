/**
 * KlaviyoBeatworld — public client subscribe (no backend).
 * Account: hola@nicoborja.com / company YxFZNy / list XWMAX8 (Beat World)
 *
 * Endpoint: POST /client/subscriptions/ — purpose-built for browser
 * forms. The act of POSTing a profile + list relationship IS the
 * subscription; no `subscriptions` consent block needed here. (That
 * block is for the SERVER-side /api/profiles endpoint, not this one.)
 *
 * Empty/null property values are stripped client-side because Klaviyo's
 * stricter accounts reject them with 400.
 */

const KLAVIYO_COMPANY_ID = 'YxFZNy';
const KLAVIYO_LIST_ID    = 'XWMAX8';
const KLAVIYO_REVISION   = '2024-10-15';

function cleanProperties(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) continue;
    if (typeof v === 'string' && v.trim() === '') continue;
    out[k] = v;
  }
  return out;
}

export async function subscribeBeatworldEmail({
  email,
  firstName,
  customSource = 'beatworld',
  properties = {},
} = {}) {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return { ok: false, error: 'invalid_email' };
  }

  const cleanProps = cleanProperties({ source: 'beatworld', ...properties });

  const profileAttrs = {
    email,
    properties: cleanProps,
  };
  if (firstName && firstName.trim()) profileAttrs.first_name = firstName.trim();

  const body = {
    data: {
      type: 'subscription',
      attributes: {
        custom_source: customSource,
        profile: { data: { type: 'profile', attributes: profileAttrs } },
      },
      relationships: {
        list: { data: { type: 'list', id: KLAVIYO_LIST_ID } },
      },
    },
  };

  try {
    const res = await fetch(
      'https://a.klaviyo.com/client/subscriptions/?company_id=' + KLAVIYO_COMPANY_ID,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'revision': KLAVIYO_REVISION,
        },
        body: JSON.stringify(body),
      }
    );

    if (res.status === 202 || res.ok) {
      console.log('[Klaviyo] subscribed:', email, 'source:', customSource);
      return { ok: true };
    }

    let detail = '';
    try { detail = await res.text(); } catch (_) {}
    console.error('[Klaviyo] FAILED', {
      status: res.status,
      statusText: res.statusText,
      response: detail,
      sentBody: body,
    });
    return { ok: false, error: 'http_' + res.status };
  } catch (e) {
    console.warn('[Klaviyo] subscribe failed:', e);
    return { ok: false, error: 'network' };
  }
}
