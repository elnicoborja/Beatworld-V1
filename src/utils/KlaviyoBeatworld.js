/**
 * KlaviyoBeatworld — fire-and-forget public client subscribe.
 *
 * Beat World is a Vite static site (no backend), so we use Klaviyo's
 * CORS-enabled /client/subscriptions endpoint. The public company ID
 * is safe to ship in the browser — that's exactly what it's for.
 *
 * Account: hola@nicoborja.com / company YxFZNy / list Y92T2b
 *
 * Every Beat World signup gets `source: beatworld` as a profile property,
 * so in Klaviyo you can either:
 *   (a) build a new flow filtered by `source equals beatworld` for the
 *       Beat World welcome email, OR
 *   (b) branch the existing welcome flow on `source` so Beat World leads
 *       get level-specific copy.
 *
 * Recommended: (a) with a NEW list (e.g. "Beat World") so the El Sound
 * System welcome flow doesn't fire on these signups. Tell Klaviyo to give
 * you the new list ID and swap KLAVIYO_LIST_ID below.
 */

const KLAVIYO_COMPANY_ID = 'YxFZNy';
const KLAVIYO_LIST_ID    = 'Y92T2b';
const KLAVIYO_REVISION   = '2024-10-15';

/**
 * @param {object} args
 * @param {string} args.email             — required, must contain "@"
 * @param {string} [args.firstName]       — optional, sets profile.first_name
 * @param {string} [args.customSource]    — defaults to 'beatworld'
 * @param {object} [args.properties]      — merged into profile.properties
 * @returns {Promise<{ok:boolean, error?:string}>}
 */
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
  };
  if (firstName) profileAttrs.first_name = firstName;

  const body = {
    data: {
      type: 'subscription',
      attributes: {
        custom_source: customSource,
        profile: {
          data: {
            type: 'profile',
            attributes: profileAttrs,
          },
        },
      },
      relationships: {
        list: { data: { type: 'list', id: KLAVIYO_LIST_ID } },
      },
    },
  };

  try {
    const res = await fetch(
      `https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_COMPANY_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'revision': KLAVIYO_REVISION,
        },
        body: JSON.stringify(body),
      }
    );

    // Klaviyo returns 202 Accepted on success.
    if (res.status === 202 || res.ok) {
      console.log('[Klaviyo] subscribed:', email, 'source:', customSource);
      return { ok: true };
    }

    const text = await res.text().catch(() => '');
    console.warn('[Klaviyo] non-202 response:', res.status, text);
    return { ok: false, error: `http_${res.status}` };
  } catch (e) {
    console.warn('[Klaviyo] subscribe failed:', e);
    return { ok: false, error: 'network' };
  }
}
