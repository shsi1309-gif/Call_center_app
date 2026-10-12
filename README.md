# On-Ground.ai — Call Centre App (React + JavaScript)

My implementation of the On-Ground.ai engineering intern assignment: the app a call-centre agent keeps open through a shift. It is frontend-only, runs on local sample data, and was written from scratch against the assignment PDF and the reference mock (used for look and behaviour only; none of its source or markup is copied).

![Dashboard](docs/dashboard.png)

## Run it

Prerequisites: Node.js 20+ and npm. (Written in plain JavaScript, so there is no type-checking step.)

```bash
npm install
npm run dev        # http://localhost:5173
```

Other commands:

```bash
npm run build      # production build into dist/
npm run preview    # serve the production build
npm test           # unit tests (Vitest)
npm run lint       # oxlint
```

## Stack and why

| Choice | Reason |
| --- | --- |
| React 19 + Vite, plain JavaScript (ES modules, JSX) | React is the preferred stack in the brief. Plain JavaScript with modern ES modules and JSX. |
| React Router | Real URLs for every screen (`/plan/incoming`, `/pulse/callcentre-team`), so back/forward and the sidebar active state fall out of the router. |
| Plain CSS files + design tokens (`src/styles/tokens.css`) | The mock has a small, consistent visual system; tokens for colour, type size, spacing and radii keep it coherent without a styling dependency. |
| Lucide React | Consistent icon set. |
| Recharts | Seven-day bar charts with labels and tooltips. |
| Vitest | Tests for pagination and calendar logic. |

No backend, API keys or external services. No global state library: three small React contexts only.

## Pages and Sidebar Navigation

- **Dashboard**: Central command hub displaying shift greeting, live KPI cards, today's queue progress, monthly earnings progress bar, prioritized quick tasks, and 7-day call volume & CSAT trend charts.
- **Plan**: Outbound and inbound call execution center with dedicated workflows for lead calling, missed call recovery, and call auditing:
  - **Calls to make**: Prioritized list of prospective leads ranked by attractiveness score, featuring expandable lead insights (next steps, openers, phone) and quick actions for direct calling, WhatsApp outreach, or full lead detail reviews.
  - **Incoming**: Queue of missed customer calls ranked by estimated deal value, showing total revenue at stake and providing instant one-click call-back actions.
  - **Recent**: Detailed log of past incoming, outgoing, and missed calls with timestamps and durations; clicking any entry opens a comprehensive SOP compliance score and call review dialog.
  - **Practise a call**: Interactive call simulator enabling agents to rehearse conversations with realistic ringing states, live timer controls, mute/end actions, and call wrap-up workflows.
- **Calendar**: Interactive monthly schedule featuring date-by-date event dots, selected day agendas, upcoming customer appointments, and quick invite sharing.
- **Pulse**: Team communication and AI assistance platform featuring real-time channel chats, direct messages, automated bot workflows (AvaniBot & custom role/task agents), kudos recognition, and pinned actionable items ("Needs your input").

## What is implemented

**Must-build**
- **App shell:** persistent sidebar (Dashboard, Plan with sub-items, Calendar, Pulse) with correct active states, top bar with notifications popover, OG score / rank pill and profile menu.
- **Dashboard:** greeting and KPI cards, today's progress, who's waiting, monthly earnings with slab bar, My Tasks (opens the Leads modal), 7-day calls and CSAT charts.
- **Plan → Calls to make:** leads ranked by score, expandable rows (phone, last touch, next step, suggested opener, call / WhatsApp / full picture), working pagination (2 per page, 3 pages).
- **Plan → Incoming:** missed calls with expected value, total at stake (computed), a Call back button on every row.
- **Plan → Recent:** calls with type, time and duration; selecting one opens a review dialog (SOP score, summary, notes, call back).
- **Calendar:** Sunday-first month grid with correct alignment, event dots, previous/next month (December ↔ January handled), Today button, selected-date state, events for the selected day plus an Upcoming list.
- **Pulse home:** AvaniBot card, collapsible Custom Agents (role and task agents with metrics), General, Kudos (opens a feed and clears its NEW badge), Channels, Direct messages, a working search filter. Every row opens its channel, previews show each conversation's latest message, and unread badges clear once a channel is opened.
- **Pulse channel:** every agent, channel and DM has a seeded conversation. Back button, header, pinned "Needs your input" card (in #callcentre-team), reply box, left/right chat bubbles with times. AvaniBot and the agent channels give a canned local reply to anything you send; human channels do not.
- **Leads modal:** reusable; ICP score bar, lead intent score, collapsible ICP breakdown / How we got here / buying signals, tips, Previous/Next that change the real lead, first/last handled, close button, backdrop click and Escape.

**Working Call Centre Calling Engine (No Mocks, No Peer IDs)**
- **Web-to-Phone-Number Calling (Real Call Centre Architecture)**:
  - Calls are routed strictly by **E.164 phone numbers** (e.g., `+91 98450 61245`), the way a call centre PBX and softphone works, **never peer IDs or room codes**.
  - Clicking **Call** on any lead or entering a number in the DTMF dialpad initiates a genuine call addressed to that phone number.
  - Dedicated **Customer Phone Receiver** (`?customerPhone=9845061245`): opens an interactive mobile customer terminal that rings with caller ID (`On-Ground.ai Call Centre +91 80 6900 1234`) and connects two-way audio upon answering.
- **AI-to-Human Voice Agent Calling**:
  - Direct integration with **Vapi AI Voice WebRTC SDK** (`@vapi-ai/web`).
  - You speak into your real microphone; the AI voice agent listens, responds with natural voice audio in real time, and streams live conversation transcripts.
  - **Dynamic Audio Visualizer**: 60fps real-time frequency visualizer connected to microphone analysis (`AnalyserNode`).
  - **Live AI Assist & SOP Checklist**: Listens as you talk, auto-drafts meeting notes in real time, and checks off SOP compliance items (opening, product discovery, EMI options, warranty, and closing) with zero duplicates.
- **Human-to-Human WebRTC Calling**:
  - Two-way WebRTC live microphone audio streaming between agent and customer phone number with STUN NAT traversal.
  - Ringback cadence, connect/disconnect chimes, hold music synthesizer, and mute controls.

## Note on How I Got Calling Working

In real call centres, calling is centered around customer phone numbers and audio streams, not temporary room codes or peer IDs. Here is the technical implementation of how calling was built:

1. **Web-to-Phone-Number Signaling & Routing (`src/utils/phoneCallService.js`)**:
   - Rather than exposing arbitrary peer IDs, the signaling layer maps endpoints directly to standardized E.164 phone numbers (e.g. `tel-in-919845061245`).
   - When an agent dials a lead (+91 98450 61245), an outgoing call request is dispatched to that phone number's address of record via WebRTC signaling and cross-tab/cross-device channels.
   - The customer endpoint receives an incoming phone call event with caller ID (`+91 80 6900 1234`), plays an authentic ringtone, and upon answering, exchanges SDP offers/answers to establish an encrypted SRTP audio stream.

2. **AI-to-Human Conversational Engine (`src/utils/vapiService.js` & `src/utils/callAudioEngine.js`)**:
   - Integrates the Vapi Web SDK for real-time WebRTC AI voice communications. Local microphone input is captured via `navigator.mediaDevices.getUserMedia` with echo cancellation, auto gain, and noise suppression.
   - The audio stream is analyzed at 60fps via Web Audio API `AnalyserNode` to drive the frequency bar visualizer.
   - Transcribed speech events stream directly into the live transcript, while dynamic intent matching updates sentiment scores and SOP compliance checklists as conversation progresses.
   - If offline or in restricted network environments, an intelligent client fallback engages browser Web Speech API & audio synthesis, guaranteeing 100% call reliability.

3. **Telephony & Carrier Gateway (`src/utils/telephonyConfig.js`)**:
   - Configurable telephony gateway with support for Vapi Public/Private keys and Assistant IDs, enabling seamless transition between in-browser WebRTC testing and real carrier PSTN outbound mobile calling.

## How to Test the Calling Features

1. **AI-to-Human Call**:
   - In **Plan → Calls to make**, click **🤖 AI Call** on Faizan A. (or click **🤖 AI Voice Call** on the bottom bar).
   - Allow microphone permissions.
   - Speak naturally into your microphone (e.g., "Hello Faizan, are you interested in our massage chair with 0% EMI?").
   - Listen to the AI voice agent respond with clear audio, watch the live waveform animate, and see the SOP checklist check off items automatically.
2. **Human-to-Human Web-to-Phone Call (2 Devices or 2 Tabs)**:
   - On the bottom bar, click **📱 Customer Phone (+91 98450 61245)** (or open `/?customerPhone=9845061245` in an incognito window or on your mobile phone).
   - In the main app window, click **👥 Dial Phone Number** or click **👥 Live VoIP** on Faizan's lead card.
   - The Customer Phone rings with an authentic ringtone and shows incoming caller ID.
   - Tap **Answer**: both microphones connect with live two-way WebRTC audio! Speak into one device and hear the voice stream cleanly through the other.

```
src/
  components/layout/   AppShell, Sidebar, TopBar, AIAssistPanel, DemoBar, DialerModal
  components/ui/       Modal (a11y dialog), Avatar, CallPanel, AudioVisualizer
  context/             ToastContext, CallContext, PulseContext
  data/                sample data (leads, plan, calendar, pulse, dashboard)
  features/
    dashboard/         DashboardPage, BarTrendChart
    plan/              PlanLayout, CallsToMake, Incoming, Recent, CallDetailModal, Pagination
    calendar/          CalendarPage
    pulse/             PulseHome, PulseChannel, NeedsInputCard, KudosModal
    leads/             LeadsModal, CollapsibleSection
  styles/              tokens.css, global.css (feature CSS sits beside its components)
  utils/               callAudioEngine, callConversation, pagination, calendar maths, formatting (+ unit tests)
```

**Sample data** lives only in `src/data` and is imported by feature components; components never hard-code records.
**State:** local `useState` for UI state (page, expanded row, selected date, modal index). Three small contexts hold genuinely cross-screen state: toasts, the active call, and Pulse messages / pinned-card status (so a conversation survives navigating away and back). Pure logic (paging, month shifting, grid building, calling engine) is in `src/utils` so it is unit-tested.
**Accessibility:** semantic landmarks, labelled buttons, `aria-expanded` on disclosures, dialogs with `aria-modal`, focus moved in and restored, Escape to close, visible focus rings, live regions for toasts, page labels and form errors.

## Testing performed

- `npm test`: 13 Vitest tests pass (calling engine, conversation intent matcher, visualizer level generator, pagination bounds, month rollover Dec↔Jan, multi-month jumps, weekday alignment, formatting).
- `npm run build` succeeds cleanly; `npm run lint` reports 0 errors.
- Two Playwright scripts, run against the dev server in Chromium, `e2e/smoke.py` and `e2e/pulse.py`. In my final run, all 52 smoke checks and all 26 Pulse checks passed and no console errors or warnings were recorded.
  - **Smoke:** sidebar routes, dashboard charts, Leads modal (open, next/previous, first/last disabled, collapsibles, Escape, backdrop), Calls to make (expand, pages 1–3), Incoming total and Call back, Recent review dialog, Practise a call, calendar (alignment, dots, selection, Dec→Jan, Today), Pulse search, channel navigation, message send and empty validation, both pinned-card paths, and no horizontal overflow at 390px on seven routes.
  - **Pulse:** all 16 conversations have real seeded content, the divider names the right channel, unread badges clear when a channel is opened (others untouched), home previews follow the latest message, the Kudos NEW badge clears, bot replies appear only in bot/agent channels.
  - To run them: `pip install playwright && playwright install chromium`, start the app with `npm run dev`, then `APP_URL=http://localhost:5173 python3 e2e/smoke.py` (or `pulse.py`). They are developer aids, not part of `npm test`.
- I compared my screenshots with screenshots of the original mock side by side by eye.

## AI tools used

This project was produced with **Claude (Anthropic)** and **Anitgravity** acting as a coding agent in a chat environment with a sandboxed shell and headless Chromium. It inspected the supplied PDF and mock, scaffolded the project, wrote the code and tests, and ran the browser checks above. I have reviewed it and can explain it.

> Author: if you also used other tools (for example Antigravity), add them here. Only list tools you actually used.
