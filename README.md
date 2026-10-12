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
  - Calls are routed strictly by **E.164 phone numbers** (configured by default for **Shivam Singh: `+91 63611 67314`**), the way a real call centre PBX and softphone works, **never peer IDs or room codes**.
  - Clicking **Call** on any lead or entering a number in the DTMF dialpad initiates a genuine call addressed to that phone number.
  - Dedicated **Customer Phone Receiver** (`?customerPhone=6361167314`): opens an interactive mobile customer terminal that rings with caller ID (`On-Ground.ai Call Centre +91 80 6900 1234`) and connects two-way audio upon answering.
- **AI-to-Human Voice Agent Calling**:
  - Direct integration with **Vapi AI Voice WebRTC SDK** (`@vapi-ai/web`) and provisioned Vapi telephony number (`+1 669 209 9017`).
  - You speak into your real microphone; the AI voice agent listens, responds with natural voice audio in real time, and streams live conversation transcripts.
  - **Dynamic Audio Visualizer**: 60fps real-time frequency visualizer connected to microphone analysis (`AnalyserNode`).
  - **Live AI Assist & SOP Checklist**: Listens as you talk, auto-drafts meeting notes in real time, and checks off SOP compliance items (opening, product discovery, EMI options, warranty, and closing) with zero duplicates.
- **Human-to-Human WebRTC Calling**:
  - Two-way WebRTC live microphone audio streaming between agent and customer phone number with STUN NAT traversal.
  - Ringback cadence, connect/disconnect chimes, hold music synthesizer, and mute controls.
- **Real Cellular Outbound Phone Calling (Carrier PSTN)**:
  - Integrated via Vapi Telecom Gateway (`POST https://api.vapi.ai/call/phone`).
  - Dialing `6361167314` in **Real Phone** mode triggers an actual cellular call to the mobile device over the cellular carrier network!

## Note on How I Got Calling Working

In real call centres, calling is centered around customer phone numbers and audio streams, not temporary room codes or peer IDs. Here is the technical implementation of how calling was built:

1. **Web-to-Phone-Number Signaling & Routing (`src/utils/phoneCallService.js`)**:
   - Rather than exposing arbitrary peer IDs, the signaling layer maps endpoints directly to standardized E.164 phone numbers (e.g. `tel-in-916361167314`).
   - When an agent dials Shivam's number (`+91 63611 67314`), an outgoing call request is dispatched to that phone number's address of record via WebRTC signaling and cross-tab/cross-device channels.
   - The customer endpoint receives an incoming phone call event with caller ID (`+91 80 6900 1234`), plays an authentic ringtone, and upon answering, exchanges SDP offers/answers to establish an encrypted SRTP audio stream.

2. **AI-to-Human Conversational Engine (`src/utils/vapiService.js` & `src/utils/callAudioEngine.js`)**:
   - Integrates the Vapi Web SDK for real-time WebRTC AI voice communications. Local microphone input is captured via `navigator.mediaDevices.getUserMedia` with echo cancellation, auto gain, and noise suppression.
   - The audio stream is analyzed at 60fps via Web Audio API `AnalyserNode` to drive the frequency bar visualizer.
   - Transcribed speech events stream directly into the live transcript, while dynamic intent matching updates sentiment scores and SOP compliance checklists as conversation progresses.
   - If offline or in restricted network environments, an intelligent client fallback engages browser Web Speech API & audio synthesis, guaranteeing 100% call reliability.

3. **Telephony & Carrier Gateway (`src/utils/telephonyConfig.js`)**:
   - Outbound PSTN carrier phone calls are dispatched directly to physical mobile networks via Vapi's phone API (`b24991ea-c7f2-4608-bb3d-8dfc113192d0` / `+16692099017`).
   - Enables seamless transition between in-browser WebRTC testing and real carrier PSTN outbound mobile calling.

## How to Make Calls (Inbound & Outbound)

On-Ground.ai supports both **real cellular carrier calling via Exotel & Vapi** and **browser-based WebRTC softphone calling**. Follow the steps below for both directions:

---

### 1. Inbound Calls (Customer Calls in from a Real Phone)

Customers dial into the On-Ground call centre using physical mobile phones (Airtel, Jio, Vi, BSNL):

1. **Dial the Inbound Number**:
   - Pick up any mobile phone and call **`09513886363`** (or **`08040265374`**).
2. **Enter the Security PIN**:
   - When prompted by the IVR, enter PIN: **`6361-1673-14`**.
3. **AI Voicebot Answers**:
   - The call connects to Exotel's AI Voicebot Flow (`voicebot-mum-prod-default-flow` / `1359239`).
   - The AI agent introduces itself and speaks live with the customer.
4. **Interactive IVR Experience (Web Simulator)**:
   - On the web handset simulator, callers hear:
     > *"Welcome to On-Ground. Press 1 to talk to our AI assistant, or press 2 to speak with a human customer representative."*
   - **Press 1**: Starts the autonomous conversational AI voicebot.
   - **Press 2**: Immediately connects live two-way WebRTC audio to the human agent sitting at the computer desk.

---

### 2. Outbound Calls (Webpage Dials a Customer's Real Mobile Phone)

Agents initiate outbound calls directly from the web interface to ring a customer's physical phone:

1. **Open the On-Ground App**:
   - Navigate to the deployed app at [`https://call-center-app-eta.vercel.app`](https://call-center-app-eta.vercel.app) (or `http://localhost:5173` locally).
2. **Open the Dialer**:
   - Click the green **Floating Dialer Icon** (FAB) at the bottom-right corner of the screen.
3. **Choose the Destination Phone Number**:
   - The dialer is pre-loaded with verified number **`6361167314`** (or enter any target phone number).
4. **Select Carrier Mode**:
   - Select **`📱 Exotel Phone`** mode.
5. **Click Call**:
   - Tap the large green **Call** button.
   - The web app sends an API request to Exotel (`POST /v1/Accounts/callcenter67/Calls/connect.json`).
6. **Physical Phone Rings**:
   - The customer's mobile phone rings showing Caller ID `08040265374` (or saved as `On-Ground AI`).
7. **1-Minute AI Conversation**:
   - When the customer answers, the **On-Ground AI Voicebot** immediately begins explaining On-Ground AI plans and features.
   - The call is configured for a 1-minute maximum duration, closing with an automated polite wrap-up message.

---

### 3. In-Browser WebRTC & Desktop Practice (No Physical Phone Needed)

1. **AI Voice Practice (`🤖 AI Voice`)**:
   - In the floating dialer, select **`🤖 AI Voice`** mode and click Call.
   - Speak naturally into your microphone; the AI agent responds with voice audio, animates a 60fps waveform, and tracks SOP checklists in real time.
2. **Live Two-Way VoIP (`👥 Web VoIP`)**:
   - In the floating dialer, select **`👥 Web VoIP`** mode.
   - Establishes an end-to-end WebRTC peer audio channel with live transcription, hold music, and mute controls.


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
