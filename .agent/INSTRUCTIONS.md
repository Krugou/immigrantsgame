# Project Standards & Enhancement Roadmap

This document serves as the "source of truth" for bringing **The Immigrants** to its maximum potential. Every update should align with these cinematic and technical standards.

## 📦 Package Policy

- **Always accept new packages.** If a feature or improvement benefits from a new npm dependency (e.g., `framer-motion`, `react-virtuoso`, `howler`), install it without hesitation. Do not skip improvements because they require a new package.

## 🏛️ Architecture & Clean Code

- **Domain-Driven Contexts**: Move game logic into dedicated service classes (e.g., `PopulationService`, `EraService`) to keep `GameContext` clean.
- **Strict Typing**: No `any` types. Use exhaustive enums for `TerritoryType`, `EraId`, and `EventCategory`.
- **Immutable State**: Use functional updates for state transitions to ensure predictability and easy debugging.
- **Service Worker Persistence**: Implement robust offline support and background syncing for a true PWA experience.
- **Modifier Engine**: Replace hardcoded `populationChange` values with a composable modifier pipeline: `Base Change × Territory Multiplier × Tech Bonus`. E.g., a Space Station might have a 1.5× multiplier for "Scientific" events.
- **Web Workers for the Game Loop**: Offload the 5-second tick logic to a Web Worker to guarantee 0 ms input lag on the main UI thread, especially when processing 50+ territories.
- **Server Actions for Admin**: Migrate the Express Admin API routes to Next.js Server Actions with `useActionState` (React 19) for full type safety and reduced backend surface area.

## 🎬 Cinematic UI/UX Standards

### The "Glass HUD" System

- **Glassmorphism & Grain**: Implement a global `glass` utility combining `backdrop-blur-md` with a subtle noise-texture SVG overlay to simulate a high-tech terminal display.
- **Dynamic Number Motion**: Use `AnimatePresence` for population changes — green `+8.0` floats upward and fades on immigration events; the total counter "rolls" like an odometer.
- **The "Scanner" Effect**: Add a CSS keyframe animation that sweeps a horizontal light beam down the screen every 10 seconds to simulate a satellite sweep of territories.

### Motion Orchestration

- Use `framer-motion` for complex transitions between dashboards and era overlays.
- The 5-second event tick should feel like a **heartbeat**, not a timer — pulse the HUD border on each tick.

### Glassmorphism & Depth

- Maintain the `cinematic-card` aesthetic with layers of blur, subtle borders, and dynamic shadows.

### Ambient Feedback

- **Soundscapes**: Integrate the Web Audio API for subtle hover clicks, ambient space-drones, and triumphant era-transition fanfares.
- **Haptics**: Trigger haptic feedback on mobile for major population milestones.
- **Aural Feedback System**: Different audio frequencies for "Good" vs. "Bad" events — a warm chime for immigration, a low rumble for disasters.

### Dynamic HUD

- The header and population counter should feel like a high-tech instrument panel (glitch effects on disasters, glow pulses on growth).

## ⚡ Performance Optimization

- **Memoization Strategy**: Use `useMemo` and `useCallback` aggressively for territory calculations and event generation.
- **Asset Pipelining**: Use WebP/AVIF for images. Implement lazy loading for late-game assets.
- **Virtualized Lists**: If the `EventLog` exceeds 100 entries, use virtualization to maintain 60FPS.
- **Web Vitals Monitoring**: Use the `useReportWebVitals` hook to track "Time to Interactive" specifically when large events trigger.

## ♿ Accessibility & Inclusivity

- **WCAG 2.1 AA Compliance**: All text must meet contrast ratios. Use `aria-live` for critical population events.
- **Keyboard Mastery**: The entire game should be playable via keyboard (shortcuts for `manualImmigration`, etc.).
- **High-Contrast Dark Mode**: Ensure a "High Visibility" variant for the cinematic theme.

## 🚀 The "Max Potential" Roadmap

To consider the game "fully realized," the following must be implemented:

### Phase 1 – Core Systems

1. [ ] **The Tech Tree**: A branching research system that alters territory multipliers.
2. [ ] **Global Trade & Transit**: Moving population _between_ territories with efficiency penalties.
3. [ ] **Era-Specific Mechanics**: Unique UI components and mini-games that unlock in later phases (e.g., Orbital Radar).
4. [ ] **Prestige System**: "Chronos Reset" – sacrifice population for permanent technical advancements.
5. [ ] **The Living Galaxy**: Dynamic background visuals that evolve as you colonize more of the solar system.

### Phase 2 – Advanced Gameplay

6. [ ] **Policy Cards**: Allow players to slot policies (e.g., "Open Borders" increases immigration probability but lowers stability).
7. [ ] **Resource Interdependency**: Energy (space stations require it, rural areas produce it), Oxygen/Stability (new metrics for the Space Age phase).
8. [ ] **Modifier Engine**: Composable multiplier chain per territory and event category.
9. [ ] **Visual Evolution**: The background morphs based on dominant territory type — Caves (earth tones, low light) → Cities (neon, high contrast) → Space (darkness, starfields, high-glow blues).

### Phase 3 – Developer & QA Tools

10. [ ] **Time-Travel Debugger**: In the Admin Dashboard, add a "Simulate 1 Hour" button that runs the loop at 100× speed for milestone and economy testing.
11. [ ] **Glass HUD Migration**: Full glassmorphism + noise-grain pass on all panels.
12. [ ] **Scanner Effect**: CSS satellite-sweep animation across the territory grid.
13. [ ] **Odometer Population Counter**: Digit-rolling animation via `framer-motion`.

_Every line of code should feel like it belongs in a premium, state-of-the-art space simulator._
