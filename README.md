# Pamoja Cell: Certified Second-Life Packs

**Global Energy Hackathon 2026 | Brief 02: Second life for e-motorcycle batteries | Track: New Technologies & Hardware**

> Making retired e-motorcycle batteries trustworthy, so they power kiosks and cold rooms instead of ending up in informal dumps.

## The problem

East Africa's e-motorcycle fleet is growing fast (Kenya registered 25,277 electric motorcycles in 2025, about 15% of new motorcycles). Every battery pack will retire from the bike while still holding most of its charge. Today there is no trusted way to know a used pack's health, no second-life safety standard, unclear liability, and no collection route. Small businesses on weak grids lose income to outages, and unsafe informal reuse and dismantling put neighborhoods at risk of fire and toxic exposure.

The gap is not wiring. It is a missing **trust and safety system**.

## Our solution

A grading, certification and tracking system. **A pack's grade decides where it goes.**

| Grade | Criteria (provisional) | Destination |
|---|---|---|
| A | Highest state of health, low resistance | Cold storage and clinics |
| B | Mid state of health | Kiosk power and lighting |
| Reject | Low SOH or any safety fault (swelling, leak, voltage collapse, overheating) | Recycler |

**How it works**
1. **Test:** each retired pack is tested with a commercial battery tester (voltage, internal resistance, capacity or SOH, temperature). No BMS access is needed, so it works with the data a small workshop actually has.
2. **Grade:** explicit, auditable rules assign the grade. A hard reject rule overrides everything else.
3. **Match:** the pack is assigned to the load its grade can safely support.
4. **Deploy:** protected second-life units with fusing, thermal cutoff, per-pack DC-DC stages (so mixed ages and capacities can run together) and a status LED.
5. **Track:** every pack gets a QR passport with its test history, grade, owner, site and events, plus SMS alerts when health drops.
6. **Take back:** end-of-life packs go to a recycler, with a recorded handoff.

**Business model:** the operator keeps ownership of the pack. The customer pays a monthly lease for a certified, monitored pack. The operator pays an intake and grading fee, and take-back and recycling add margin. Certification is what makes the lease possible.

## What is in this repo

- **Dashboard app:** enter tester readings manually (or load a sample pack) to get a grade, health score, recommended load, estimated backup hours and a plain-language explanation. It then generates a QR passport and adds the pack to the fleet view. Also includes a live-monitoring simulation with amber and red alerts and mock SMS, a business-model calculator (kiosk and cold-room tiers), and editable grading thresholds.
- **AI features:** remaining-life prediction with an uncertainty range, anomaly flags for unusual readings (sent to manual check), and a pack Q&A assistant. Safety decisions are made by explicit rules, never by AI.

## Real vs simulated (disclosure)

| Component | Status |
|---|---|
| Retired e-bike packs and battery tester grading (video) | **Real**, recorded before the event |
| Readings from tested packs | **Real**, shown in the "Real test data" tab |
| Grading and certification protocol and thresholds | Designed; **provisional**, to be calibrated on field data |
| Fleet of ~500 packs | **Simulated** (SOH mostly 70-80%, about 5% faulty, with sensor noise), labelled in the app |
| Final pack: BMS, IoT module, GSM alerts, QR passport | **Simulated** (designed, not built) |
| Dashboard and fleet tracking | **Built during the sprint** |
| Unit cost and business figures | Placeholders from Pamoja Cell's own cost model; to be validated for the kiosk tier |

**Prior work:** Pamoja Cell existed before this event (including a working two-pack prototype with BMS displays). Items marked "Real" were recorded before October 30, 2026.

**AI tools used:** [list: e.g. Lovable, Claude]
**Open-source code and datasets:** [list]
**Data sources for simulation ranges:** published battery-aging figures [add citations]

## Scoring alignment

- **Impact:** backup hours per retired pack, share of packs diverted from waste
- **Innovation:** a grade-to-load matching protocol with a QR passport and an ownership and take-back model
- **Sustainability:** documented second life and end-of-life route, self-funding lease model
- **Feasibility:** commodity tester and parts, explicit reject rule, mixed-pack protection
- **Scalability:** test throughput per station and share of a network's retired packs absorbed per year

## Limitations and roadmap

- Grade thresholds are provisional. Field data from a monitored pilot is needed to recalibrate.
- A quick test estimates health but cannot guarantee how a pack ages. Continuous monitoring covers this.
- "Certified" currently means our published protocol, aligned to IEC lithium-ion storage safety limits. Formal certification with an accredited body, a national regulator and an insurer is the next step.
- Operator cooperation is needed for packs locked to proprietary BMS platforms.
- One test station handles roughly 10 packs a day, so parallel test channels are required at scale.

## Team

| Name | Role |
|---|---|
| [Name] | [Role] |
| [Name] | [Role] |

**Mentor:** [Name] ([LinkedIn])

## Links

- Demo video: [link]
- Pitch deck: [link]
- One-page summary: [link]
- Live app: [link]

*Built for the Global Energy Hackathon 2026, hosted by Anneru Solutions.*
