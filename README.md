# Pamoja Cell: Certified Second-Life Packs
=======

**Global Energy Hackathon 2026 | Brief 02: Second life for e-motorcycle batteries | Track: New Technologies & Hardware**

> Making retired e-motorcycle batteries trustworthy, so they power kiosks and cold rooms instead of ending up in informal dumps.

## The idea

A pack's grade decides where it goes. Each retired pack is tested with a commercial battery tester, graded by fixed rules, and sent to the load it can safely carry. Every pack gets a QR passport so its history is tracked until recycling.

| Grade | Rule (provisional) | Destination |
|---|---|---|
| A | SOH 70% or more, resistance rise 50% or less, no damage | Cold storage and clinics |
| B | SOH 50 to under 70%, or resistance rise 50 to 100% | Kiosk power and lighting |
| Reject | SOH under 50%, resistance rise over 100%, peak temperature over 60 C, or any swelling or leak | Recycler |

Safety decisions are made by these rules only. AI (Grok) explains results and suggests checks. It never changes a grade.

## What the demo does

- Grades a pack from tester readings and shows its destination, the reason, and estimated backup hours.
- Creates a QR passport for each graded pack.
- Imports a CSV of recorded results and grades every row (`pack_id, soh, resistance_rise_pct, peak_temp_c, damage`).
- Shows a simulated fleet, and a schematic site map with a simulated live feed: Kiosk 12 overheats, turns amber, then red, the unit isolates, and a mock SMS appears.
- Optional: "Ask Grok about this pack" for plain-language explanations.

## Run it on your computer

You need [Node.js](https://nodejs.org) 18 or newer (check with `node --version`). No packages to install.

```bash
git clone https://github.com/YOUR-USERNAME/pamoja-cell.git
cd pamoja-cell
node server.js
```

Open http://localhost:3000. Everything works except the Grok panel, which needs a key (next step).

## Turn on Grok

1. Create an API key in the xAI console (https://console.x.ai) and add credits.
2. Copy the example settings file and edit it:
   ```bash
   cp .env.example .env
   ```
   Put your key in `XAI_API_KEY=`. Check the exact model name in the xAI docs (https://docs.x.ai) and set `XAI_MODEL=` if the default does not work.
3. Restart the server with `node server.js`. The panel badge changes to "Grok connected".

The key stays on the server in `.env`, which is git-ignored. Never paste it into `docs/index.html` or commit it. If a key is ever exposed, delete it in the xAI console and create a new one.

## Put it on GitHub

```bash
git init
git add .
git commit -m "Pamoja Cell demo"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/pamoja-cell.git
git push -u origin main
```

Create the empty repository on github.com first (New repository, no README). Check `git status` shows no `.env` before you commit.

## Share it as a link

- **Static demo, no AI (free):** on GitHub open Settings, then Pages, choose branch `main` and folder `/docs`. Your demo appears at `https://YOUR-USERNAME.github.io/pamoja-cell/`. The Grok panel shows "AI off" there, because GitHub Pages cannot keep a secret key.
- **Demo with Grok:** deploy `server.js` on a Node host such as Render or Railway. Start command `node server.js`. Add `XAI_API_KEY` (and `XAI_MODEL`) in the host's environment settings, not in the code. The server limits questions per minute and per day (`MAX_REQUESTS_PER_DAY`) to protect your credits.

## Project layout

```
docs/index.html   the demo page (also what GitHub Pages serves)
server.js         serves the page and forwards AI questions to xAI
.env.example      settings template
```

## Real vs simulated (disclosure)

| Component | Status |
|---|---|
| Battery testing and grading footage | Real, recorded with a commercial battery tester |
| Grading rules and thresholds | Designed, provisional, to be calibrated on field data |
| Fleet chart | Simulated (30 packs) |
| Site map, live feed, SMS alerts | Simulated, locations illustrative |
| Final pack with BMS, IoT module and QR passport | Designed, simulated in this demo |
| Demo page and server | Built during the hackathon sprint |

**Prior work:** Pamoja Cell existed before this event, including a working two-pack prototype with BMS displays.
**AI tools used:** xAI Grok (in-app explanations), [list any others, e.g. Claude, Lovable]
**Open-source code and datasets:** QRCode.js (qrcodejs 1.0.0), IBM Plex fonts. Threshold choices draw on published battery end-of-life guidance (TWAICE end-of-life guide; arXiv 2512.01294). IEC 62619:2022 covers first-life batteries and leaves reuse out of scope.

## Limits

- Thresholds are provisional. A quick test estimates health but cannot guarantee how a pack ages, so continuous monitoring is part of the design.
- Backup hours assume 2.0 kWh rated energy, 80% depth of discharge and 90% inverter efficiency. These are assumptions.
- "Certified" here means our published protocol. Formal certification with an accredited body, a regulator and an insurer is the next step.

## Team

| Name | Role |
|---|---|
| [Name] | [Role] |

**Mentor:** [Name]

*Built for the Global Energy Hackathon 2026, hosted by Anneru Solutions.*
