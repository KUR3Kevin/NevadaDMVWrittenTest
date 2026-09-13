---
title: Nevada DMV Written Test
tags:
  - project
  - nevada
  - dmv
  - quiz
  - expo
  - netlify
aliases:
  - NevadaDMVWrittenTest
  - NV written test app
updated: 2026-09-13
status: near-public
github: https://github.com/KUR3Kevin/NevadaDMVWrittenTest
---

# Nevada DMV Written Test

Unofficial study quiz for the Nevada Class C knowledge test. Expo + Expo Router app, web-first on Netlify, with iOS/Android still possible through Expo.

**Not affiliated with the Nevada DMV.** Source of truth is the [Nevada Driver Handbook](https://dmv.nv.gov/pdfforms/dlbook.pdf).

## Links

- GitHub: [KUR3Kevin/NevadaDMVWrittenTest](https://github.com/KUR3Kevin/NevadaDMVWrittenTest)
- Official handbook PDF: https://dmv.nv.gov/pdfforms/dlbook.pdf
- Official DMV: https://dmv.nv.gov/
- EAS project id: `f8fc7d65-a08e-4af4-aef5-fcc46e991361`

## Official exam (do not mix up with the study bank)

| Item | Fact |
| --- | --- |
| Length | **25** multiple-choice questions |
| Pass | **80%** = **20** correct |
| Stop rule | Can end at 20 correct or 6 incorrect |
| Common myth | It is **not** a 50-question / 40-to-pass test |

## App

- Practice Test = 25 questions (exam length)
- Study Bank = full question set (58 as of 2026-09-12)
- Quick 20 / True-False / Weak Areas
- Study tab: key facts + road-sign shapes
- Progress stored locally (AsyncStorage / browser)

## Accuracy pass (2026-09-12)

Checked against the Nevada Driver Handbook. Fixes that were wrong in the first bank:

- **HOV is 2+ people in Nevada**, not 3+. Motorcycles eligible. Pets do not count.
- **Uphill + curb: wheels AWAY from the curb.** Downhill: toward the curb. Uphill without curb: toward the shoulder.
- **12 demerit points / 12 months = 6-month suspension**, not an automatic $500 fine. 3–11 points can take traffic school once a year to drop 3 points.
- **Crossing guard:** wait until the guard is **completely out of the crosswalk**.
- **Pedestrians in crosswalks/intersections have ROW.** The old “all of the above / can’t walk a bike” item was wrong.
- **Under 2:** rear-facing restraint in the **back seat**.
- **Move Over (NRS 484B.607):** slow below posted limit and leave the adjacent lane if you can.
- **Blind pedestrian ROW** applies when using a white cane or guide dog (NRS 484B.290).

## Publish checklist

Done in the 2026-09-12 debug pass:

- [x] Handbook accuracy fixes
- [x] Practice Test mode matches 25-question exam
- [x] README, MIT license, unofficial disclaimer in-app
- [x] Netlify SPA fallback + security headers
- [x] Jest + typecheck + web export scripts
- [x] GitHub Actions CI
- [x] Age-friendly navigation: Home/Study/Scores/Help tabs, Start Here card, labeled Exit, 44px+ tap targets
- [x] Web does not prompt for native notifications
- [x] 2026-09-13 debug: in-app Leave/Reset dialogs (no `window.confirm`), local-timezone study streaks, dimmed used-up answers, missing-results fallback

Still Kure’s call before a public launch:

- [ ] Connect the GitHub repo to Netlify and ship a production URL
- [ ] Set GitHub repo description + topics (`nevada`, `dmv`, `quiz`, `expo`, `netlify`)
- [ ] Ignore Dependabot PRs that jump Expo packages from SDK 54 to 57
- [ ] Optional: close or merge draft PR #11 (stabilize builds) after this branch lands — this branch already includes the Metro / lockfile / script fixes
- [ ] Optional App Store / Play listing later; web can ship first

## Local commands

```bash
npm ci --legacy-peer-deps
npm run web
npm test
npm run typecheck
npm run build:web
```

## Vault copy

This note lives in the GitHub repo at `docs/obsidian/Nevada DMV Written Test.md` so it can be copied into **Kure's Brain** if iCloud is not mounted on the machine that edited it.
