# Klaviyo Flow — Beat World (list XWMAX8)

**Goal:** convert Vibe Jam play traffic into producers who care about both Beat World level drops AND SOUND OS as the bigger story. 3 emails over 14 days. Personal, bilingual-tolerant, no spam.

**Account:** hola@nicoborja.com · company `YxFZNy` · list `XWMAX8` (Beat World)

---

## Flow structure

```
┌─ TRIGGER: Added to list "Beat World" (XWMAX8)
│  Filter: First time added (skip re-adds)
│
├─ Email 1 — Welcome  (delay: 5 min)
│  Smart Sending: OFF (this one always sends)
│
├─ Wait 3 days
│
├─ Email 2 — Sneak peek of YOUR level
│  Smart Sending: ON
│  Conditional content blocks branch on requested_region
│
├─ Wait 11 days
│
├─ Email 3 — SOUND OS bridge  (T+14 days)
│  Smart Sending: ON
│
└─ Exit
```

**Global settings on every send:**
- Quiet Hours: 8 AM – 9 PM recipient timezone
- Unsubscribe link: auto (legal requirement)
- Reply-to: hola@nicoborja.com
- From name: "Nico from Beat World" (or "Nico Borja" if you want personal-first)

---

## Klaviyo dashboard setup

1. **Flows → Create Flow → Start from scratch**
2. Name: `Beat World — Welcome + Nurture`
3. Trigger: **List → Beat World (XWMAX8) → Added to list**
4. Trigger filter: `Has been added to list zero times before` (so re-adds don't re-trigger)
5. Profile filter: `Email is set AND Can receive email marketing`

Then drag in 3 email actions with the wait-times above.

---

## Email 1 — Welcome (T+5 min)

**From name:** Nico Borja
**From email:** hola@nicoborja.com
**Subject A/B test:**
- A: `You're on the list 🎛️`
- B: `Your {{ person.requested_region|default:"next level" }} level — first to know`

**Preheader:** `And a tiny ask before you go.`

**Body (paste into Klaviyo's drag-drop editor as a single Text block):**

```
Hey {{ person.first_name|default:"producer" }} —

You just joined the Beat World list, which means I owe you an email
when your {{ person.requested_region|default:"next" }} level ships.

Quick context: I built Beat World 2.0 solo in 4 days for Cursor Vibe
Jam 2026. Two playable cities right now — NYC boom-bap and Puerto Rico
reggaetón. Four more locked behind COMING SOON cards.

You signed up for Level {{ person.requested_level|default:"a future" }}
({{ person.requested_genre|default:"a genre I'm cooking" }} on the
{{ person.requested_piece|default:"local rig" }}). I'll ping you when
the samples are mixed and the rig sprite is painted.

In the meantime — if you haven't shared your beat yet, the SHARE button
on the review screen drops a 1080×1080 PNG ready for X / Instagram.

→ https://beatworld.nicoborja.com/?ref=klaviyo-welcome

If a friend would like this, forward this email — they can sign up right
inside the game.

— Nico
Bogotá · architect-turned-DJ · @nicoborja
```

**CTA button (below text block):** `MAKE ANOTHER BEAT →` linking to `https://beatworld.nicoborja.com/?ref=klaviyo-welcome-cta`

---

## Email 2 — Sneak peek (T+3 days)

**Subject A/B:**
- A: `Behind the {{ person.requested_region|default:"next" }} level (peek)`
- B: `Sneak peek: your level is taking shape`

**Preheader:** `And what I'm sampling for it.`

**Body — uses Klaviyo conditional content blocks branching on `requested_region`:**

Top of email (always shown):

```
Hey {{ person.first_name|default:"producer" }} —

Quick update from the studio.
```

Then add a Klaviyo Show/Hide conditional block per region. In the editor,
add a Text block, then click Show/Hide → Conditional → "Show if person
property requested_region equals X". Repeat for each region:

**IF requested_region = Brazil:**
```
L3 is Rio. I've been deep-diving baile funk this week. The rig is going
to be the carro de som — a 12-foot soundtruck stack, neon-painted, the
whole truck IS the venue. Trying to source samples from Rio producers
right now.
```

**IF requested_region = Andean:**
```
L4 is leaning Andean. The rig: a hand-built wooden bass cabinet,
weatherproofed for cold mountain nights. Genre mixes folkloric Andean
instruments with sub-heavy bass. Charango on FM synth-bass — that kind
of energy.
```

**IF requested_region = Mexico:**
```
L5 is Mexico City sonidero culture. The rig is a full sonidero stage
with hand-painted backdrops, animated dancers, the works. Cumbia
rebajada samples being curated this month.
```

**IF requested_region = Jamaica:**
```
L6 is a Kingston dub-shack stack — Tubby's lab energy, spring reverb
tanks visible, the rig you build a lifetime around.
```

**IF requested_region is empty (directory signup):**
```
I've got 4 cities on deck and you'll be the first to hear when each
one is ready. Order of arrival: Brazil → Andean → Mexico → Jamaica.
```

Then bottom (always shown):

```
Two ways you can help while I cook:

1. Play through NYC + PR if you haven't, screenshot your favorite
beat, share with @nicoborja on X. I'm collecting them.

2. Forward this email to one friend who'd like making beats. The list
is small and personal right now — that's the point.

→ Replay your level: https://beatworld.nicoborja.com/?ref=klaviyo-peek

— Nico
```

**CTA:** `REPLAY YOUR LEVEL →`

---

## Email 3 — SOUND OS bridge (T+14 days)

**Subject A/B:**
- A: `Beat World was a proof. Here's what it was proving.`
- B: `What I'm actually building (Beat World was the demo)`

**Preheader:** `SOUND OS — for artists who want to be more than algorithms.`

**Body:**

```
Hey {{ person.first_name|default:"producer" }} —

Real talk: Beat World was a love letter. It was also a proof of concept.

I'm building SOUND OS — an operating system for indie artists who want
to be more than algorithms. The thesis: music marketing isn't video
clips anymore, it's playable scenes. Real interactivity. Real character
pages. Real soundsystem identity.

Beat World took 4 days because the foundation was already there. SOUND
OS is what's underneath.

→ elsoundsystem.com?ref=beatworld-bridge

Three doors from here:

1. PRODUCER / ARTIST — you want to grow without selling your soul to
the algorithm. SOUND OS is for you. Visit the link above.

2. BUILDER / DEV — you liked the Beat World tech (vanilla JS + Three.js
+ Tone.js + Claude Code in 4 days). Reply with "tech" and I'll add you
to a smaller list that gets the deep-dives.

3. NEITHER — that's fine. You'll get the next Beat World level email
and nothing else. I respect the inbox.

— Nico
Bogotá · {{ now|date:"F Y" }}

P.S. Reply to this email. I read everything. Tell me what you cooked,
what city should come next, what soundsystem culture I'm missing.
```

**CTA:** `SEE SOUND OS →` linking to `https://elsoundsystem.com/?ref=beatworld-bridge`

---

## Spanish version (optional — toggle by `properties.language`)

If a chunk of signups come from your LATAM push, set up a parallel Spanish
flow. Same 3-email cadence. Cheap version: clone the flow, translate the
copy, add a profile filter `language equals es` on the Spanish flow and
`language not equals es` on the English flow.

Or simpler: bilingual EN-then-ES inside each email. Costs you 30% open
rates from Spanish readers who scroll past English.

I'd ship English-only for the first 14 days, see open rates, then
translate IF Spanish-speaking signups exceed 30% of the list.

---

## Properties available for personalization

Every signup carries these (set by the Beat World code):

| Property | Example | Where set |
|---|---|---|
| `source` | `beatworld` | always |
| `requested_level` | `3` | level-unlock signups |
| `requested_region` | `Brazil` | level-unlock signups |
| `requested_genre` | `Baile Funk` | level-unlock signups |
| `requested_piece` | `BAILE FUNK TRUCK` | level-unlock signups |
| `producer_name` | `Nico` | both |
| `producer_city` | `Bogotá, Colombia` | both |
| `producer_maps_url` | `https://maps.google.com/...` | both |
| `current_clout` | `127` | both |
| `latest_beat_name` | `Coney Island Boom` | directory signups |
| `latest_beat_city` | `new-york` | directory signups |
| `latest_beat_rating` | `4` | directory signups |

`custom_source` (separate field, not a profile property) carries the
entry point: `beatworld_l3_unlock`, `beatworld_l4_unlock`, ...,
`beatworld_directory`. Useful for filters on a future segmented send.

---

## A/B test ideas (pick one per email)

- **Email 1:** test `🎛️` emoji in subject vs. plain text. Personal
emails often win without emoji.
- **Email 2:** test from-name `Nico Borja` vs. `Nico from Beat World`.
- **Email 3:** test "Real talk:" opener vs. "Hey {{ first_name }}, real
talk —". The named opener usually wins.

---

## When to expand to 5+ emails

Don't, until your unsubscribe rate stays under 0.5% per send AND open
rates stay above 35%. If both hold for 100+ recipients, add:

- **Email 4 (Day 30):** Course 1 teaser — "Want to make beats for real?"
- **Email 5 (when next level ships):** Auto-send when L3 launches via
a flow trigger filter on launch date.

---

## Smoke test (do this BEFORE turning the flow live)

1. Klaviyo Flows → your flow → click each email → "Preview & Test"
2. Send to your own email with a fake profile that has all the properties
populated (`requested_region: Brazil`, `requested_level: 3`, etc.)
3. Open in Gmail desktop AND iPhone — check rendering
4. Click every link — verify they go to the right URL with the right
?ref= param
5. Reply to one — make sure the reply lands in hola@nicoborja.com,
not a no-reply
6. Check the conditional content actually shows/hides per region
(swap `requested_region` between Brazil/Andean/Jamaica/empty in your
test profile and re-preview)

When all 6 pass, set the flow status to **Live**.

---

## What success looks like (first 14 days post-Vibe Jam)

If 100 people sign up:
- Email 1 open rate: 50%+ (welcome emails always crush)
- Email 2 open rate: 30%+
- Email 3 open rate: 20%+
- Reply rate to Email 3: 1-3 replies (the "tech" segment)
- Unsubs: under 5

If you're below those numbers, the issue is usually subject lines or
send time. If you're above, you have a real audience.
