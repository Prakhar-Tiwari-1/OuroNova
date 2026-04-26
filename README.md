# OuroNova

**Circular renovation, engineered.**

OuroNova closes the loop on construction waste in France by connecting homeowners, contractors, and material buyers on a single platform, unlocking the €21,800 average in stackable public aid that 68% of eligible French homeowners never claim, and turning demolition debris into marketplace revenue instead of landfill cost.

Built for **EuroTeQaThon 2026** at École Polytechnique.  
Theme: *Enhance connections: people, technology and nature.*

---

## The Problem

Three broken links in one chain:

- **Homeowners** (Camille, Paris 11e) qualify for thousands in renovation subsidies but never claim them; the paperwork spans four ministries.
- **Contractors** (Karim, Lyon) pay €120/tonne to dump materials worth €220; there is no trusted marketplace to sell salvage.
- **Buyers** (Élodie, Marseille) drive 60 km hoping to find reclaimed oak; supply is fragmented and unverified.

---

## What OuroNova Does

| Flow | Who | What |
|---|---|---|
| Photo analysis | Homeowner | AI identifies upgrades, matches reclaimed materials, stacks applicable French subsidies |
| Cost estimate | Homeowner | Three renovation tiers with embodied carbon, reclaimed %, and net-after-subsidy cost |
| Subsidy navigator | Homeowner | Live eligibility check across MaPrimeRénov', CEE, Éco-PTZ, TVA 5.5%, regional bonuses |
| Marketplace | Buyer | Browse verified reclaimed materials within 25 km, quality-graded, carbon cost shown upfront |
| List a material | Contractor | AI drafts the listing from one photo: material, grade, price, description |
| Impact dashboard | User | CO₂ avoided, waste diverted, subsidies unlocked, shareable impact card |

---

## Tech Stack

- **React 18** (CDN, no build step)
- **Babel Standalone** (JSX transpiled in-browser)
- **Vanilla CSS** with `oklch` design tokens
- **No backend**, fully static, demo data in `data.js`

---

## Running Locally

No install required. Serve the folder with any static server:

```bash
python -m http.server 3000
# then open http://localhost:3000
```

Or open `index.html` directly in a browser.

---

## SDGs Addressed

| Goal | Target | How |
|---|---|---|
| **SDG 12** Responsible Consumption | 12.5: reduce waste through reuse | Marketplace diverts materials from landfill |
| **SDG 11** Sustainable Cities | 11.6: reduce environmental impact of cities | Local circular renovation within 25 km radius |
| **SDG 9** Industry & Innovation | 9.4: sustainable infrastructure | Digital infrastructure giving contractors economic incentive to salvage |

---

## Year 1 Targets

- 500 t CO₂ avoided
- 100 t waste diverted from landfills
- €150k subsidies unlocked for homeowners
- 1,000+ sustainable renovation decisions

---

## Team

| Name | Role |
|---|---|
| Prakhar Tiwari | CEO |
| Nai Maria | CFO |
| Ziqi Meng | CTO |

École Polytechnique (l'X) · EuroTeQaThon 2026
