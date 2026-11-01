# Pamoja Cell: Certified Second-Life Packs

**Global Energy Hackathon 2026 | Brief 02: Second life for e-motorcycle batteries | Track: New Technologies & Hardware**

> Making retired e-motorcycle batteries trustworthy, so they power kiosks and cold rooms instead of ending up in informal dumps.

## The idea

A pack's grade decides where it goes. Each retired pack is tested with a commercial battery tester, graded by fixed rules, and sent to the load it can safely carry. Every pack gets a QR passport so its history is tracked until recycling.

| Grade | Rule (provisional) | Destination |
|---|---|---|
| A | SOH 70% or more, resistance rise 50% or less, no damage | Cold storage and clinics |
| B | SOH 50 to under 70%, or resistance rise 50 to 100% | Kiosk power and lighting |
| Reject | SOH under 50%, resistance rise over 100%, peak temperature over 60 C, or any swelling or leak | Recycler |

Safety decisions are made by these rules only. AI (Groq) explains results and suggests checks. It never changes a grade.

## What the demo does

- Grades a pack from tester readings and shows its destination, the reason, and estimated backup hours.
- Creates a QR passport for each graded pack.
- Imports a CSV of recorded results and grades every row (`pack_id, soh, resistance_rise_pct, peak_temp_c, damage`).
- Shows a simulated fleet, and a schematic site map with a simulated live feed: Kiosk 12 overheats, turns amber, then red, the unit isolates, and a mock SMS appears.
- Optional: "Ask Groq about this pack" for plain-language explanations.

## Run it on your computer

You need [Node.js](https://nodejs.org) 18 or newer (check with `node --version`). No packages to install.

```bash
git clone [https://github.com/YOUR-USERNAME/pamoja-cell.git](https://github.com/YOUR-USERNAME/pamoja-cell.git)
cd pamoja-cell
node server.js