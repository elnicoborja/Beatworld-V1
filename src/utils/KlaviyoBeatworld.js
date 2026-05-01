/**
 * KlaviyoBeatworld — public client subscribe (no backend).
 * Account: hola@nicoborja.com / company YxFZNy  / list XWMAX8 (Beat World)
 */

const KLAVIYO_COMPANY_ID = 'YxFZNy';
const KLAVIYO_LIST_ID    = 'XWMAX8';
const KLAVIYO_REVISION   = '2024-10-15';

export async function subscribeBeatworldEmail({
  email,
  firstName,
  customSource = 'beatworld',
  properties = {},
} = {}) {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return { ok: false, error: 'invalid_email' };
  }

  const profileAttrs = {
    email,
    properties: { source: 'beatworld', ...properties },
    subscriptions: {
      email: { marketing: { consent: 'SUBSCRIBED' } },
    },
  };
  if (firstName) profileAttrs.first_name = firstName;

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
