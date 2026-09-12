# Nevada DMV Written Test

Unofficial practice app for the Nevada Class C knowledge (written) test. Built with Expo + Expo Router and ready to host as a static web app on Netlify.

**This is not the Nevada DMV, and it is not an official exam.** Questions and flashcards are study aids based on the [Nevada Driver Handbook](https://dmv.nv.gov/pdfforms/dlbook.pdf). Always confirm current law at [dmv.nv.gov](https://dmv.nv.gov/).

## Official test facts (NV DMV)

| Item | Value |
| --- | --- |
| Questions | 25 multiple choice |
| Passing score | 80% (20 correct) |
| Stop rule | Test can end at 20 correct or 6 incorrect |
| Source | [Nevada Driver Handbook (PDF)](https://dmv.nv.gov/pdfforms/dlbook.pdf) |

## App modes

- **Practice Test** — 25 random questions, same length as the official knowledge test
- **Study Bank** — full handbook question set
- **Quick 20** — shorter drill
- **True / False** — two-option items only
- **Weak Areas** — questions missed at least twice
- **Study** — key-fact flashcards and road-sign shapes/colors
- **Progress** — streaks, recent runs, weak-area drill

Progress is stored on-device (web: browser storage; native: AsyncStorage).

## Run locally

Requires Node 20+.

```bash
npm ci --legacy-peer-deps
npm run web          # Expo web (http://localhost:8081)
npm test             # Jest
npm run typecheck    # tsc --noEmit
npm run build:web    # static export to dist/
```

iOS / Android (Expo Go or a native build):

```bash
npm start
```

## Deploy (Netlify)

`netlify.toml` already points the build at `npm run build:web` and publishes `dist/`, with an SPA fallback so quiz routes work.

1. Connect [this GitHub repo](https://github.com/KUR3Kevin/NevadaDMVWrittenTest) to a Netlify site.
2. Confirm Node 20 and `NPM_FLAGS=--legacy-peer-deps`.
3. Deploy the `main` branch.

No API keys or backend services are required.

## Accuracy notes

Content was checked against the current Nevada Driver Handbook and NV DMV testing pages. High-impact corrections include:

- HOV / diamond lanes in Nevada are **2+ occupants**, not 3+
- Uphill parking **with a curb**: wheels **away from** the curb
- 12 demerit points in 12 months: **6-month license suspension** (not an automatic $500 fine)
- Official knowledge test length is **25 questions**, not 50
- Crossing-guard, pedestrian, child-restraint, and Move Over wording aligned to the handbook

Laws change. If the handbook and this app disagree, trust the handbook.

## GitHub

- Repo: https://github.com/KUR3Kevin/NevadaDMVWrittenTest
- Default branch: `main`
- Stack: Expo SDK 54, React Native 0.81, TypeScript, Jest, Netlify

## License

MIT. See [LICENSE](LICENSE).
