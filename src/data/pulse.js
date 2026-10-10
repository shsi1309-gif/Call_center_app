export const ROLE_AGENTS = [{ id: 'callcentre-agent', name: 'callcentre-agent', sub: 'Call Centre Agent' }]

export const TASK_AGENTS = [
  { id: 'cross-sell-agent', name: 'cross-sell-agent', sub: 'Your Attach rate · 5 members', metric: '24%', delta: '▲2', color: '#7c3aed' },
  { id: 'sop-agent', name: 'sop-agent', sub: 'Your SOP adherence · 5 members', metric: '81%', delta: '▲2', color: '#0f766e' },
  { id: 'lead-conversion-agent', name: 'lead-conversion-agent', sub: 'Lead Conversion Agent', metric: '', delta: '', color: '#be123c' },
  { id: 'capture-agent', name: 'capture-agent', sub: 'Your Capture coverage · 5 members', metric: '78%', delta: '▲1', color: '#0f766e' },
]

export const CHANNELS = [
  { id: 'callcentre-team', name: 'callcentre-team', topic: 'Call Centre · Koramangala', members: 12 },
  { id: 'all-stores', name: 'all-stores', topic: 'Company-wide announcements', members: 84 },
  { id: 'avani-coaching', name: 'avani-coaching', topic: 'Coaching from AvaniBot', members: 2 },
  { id: 'manage-shipment', name: 'manage-shipment', topic: 'Deliveries and dispatch', members: 9 },
  { id: 'quotation-tickets', name: 'quotation-tickets', topic: 'Quotation approvals', members: 7 },
  { id: 'new-hire-onboarding', name: 'new-hire-onboarding', topic: 'Welcome to the team', members: 21 },
]

export const DMS = [
  { id: 'dm-sunita', name: 'Sunita Rao', initials: 'SR', badge: 'MGR' },
  { id: 'dm-priya', name: 'Priya Krishnan', initials: 'PK', badge: '' },
  { id: 'dm-raju', name: 'Raju Kumar', initials: 'RK', badge: '' },
]

export const KUDOS = { newCount: 3, total: 12, quote: '"Great work with Mukunda — closed that objection beautifully!" — Sunita Rao' }

const initialsOf = (name) =>
  name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

function thread(id, rows) {
  return rows.map(([author, time, text], i) => ({
    id: `${id}-${i}`,
    author: author === 'You' ? 'You' : author,
    initials: author === 'You' ? 'AR' : initialsOf(author),
    time,
    text,
    mine: author === 'You',
  }))
}

/** Seeded conversation for every Pulse destination, keyed by route id. */
export const INITIAL_MESSAGES = {
  'callcentre-team': [
    ...thread('cct', [
      ['Sunita Rao', '2:05pm', '👥 STAKEHOLDERS: @You (Arvind R.), whole call centre shift'],
      ['Sunita Rao', '2:05pm', '📋 ISSUE DEFINITION: Greeting-in-first-10s QA score is at 71% this week, below our 85% target.'],
      [
        'Sunita Rao',
        '2:05pm',
        "➡️ SUGGESTED RESOLUTION: Let's push that up 💪 — open every call with the greeting script. I'll check back Friday.",
      ],
      ['You', '2:10pm', 'On it! Will make sure I open every call with the greeting script 🙌'],
      ['Sunita Rao', '2:14pm', 'Great attitude Arvind 🌟'],
    ]),
  ],
  'callcentre-agent': [
    {
      id: 'cca-1',
      author: 'AvaniBot',
      initials: 'AB',
      time: '9:00am',
      badge: '',
      text: "Good morning Arvind. Today's digest is pinned at the top: incoming context and the tasks allocated to you.",
      mine: false,
    },
    {
      id: 'cca-2',
      author: 'AvaniBot',
      initials: 'AB',
      time: '1:00pm',
      badge: 'Nudge',
      text: 'Reminder: Priya Iyer still needs an update.',
      mine: false,
    },
    {
      id: 'cca-3',
      author: 'AvaniBot',
      initials: '5:00pm',
      time: '5:00pm',
      badge: 'Reminder',
      text: 'Your end-of-day update goes to your manager at 6:00pm. Finish your tasks if you can.',
      mine: false,
    },
  ],
  'cross-sell-agent': [
    {
      id: 'xs-1',
      author: 'AvaniBot',
      initials: 'AB',
      time: '9:00am',
      badge: '',
      text: "Good morning Arvind. Today's attach rate digest is pinned at the top: incoming context and the tasks allocated to you.",
      mine: false,
    },
    {
      id: 'xs-2',
      author: 'AvaniBot',
      initials: 'AB',
      time: '1:00pm',
      badge: 'Nudge',
      text: 'Reminder: Meera S. still needs an update.',
      mine: false,
    },
    {
      id: 'xs-3',
      author: 'AvaniBot',
      initials: '5:00pm',
      time: '5:00pm',
      badge: 'Reminder',
      text: 'Your end-of-day update goes to your manager at 6:00pm. Finish your tasks if you can.',
      mine: false,
    },
  ],
  'sop-agent': [
    {
      id: 'sop-1',
      author: 'AvaniBot',
      initials: 'AB',
      time: '9:00am',
      badge: '',
      text: "Good morning Arvind. Today's sop adherence digest is pinned at the top: incoming context and the tasks allocated to you.",
      mine: false,
    },
    {
      id: 'sop-2',
      author: 'AvaniBot',
      initials: 'AB',
      time: '1:00pm',
      badge: 'Nudge',
      text: 'Reminder: Talk at 11:40am still needs an update.',
      mine: false,
    },
    {
      id: 'sop-3',
      author: 'AvaniBot',
      initials: '5:00pm',
      time: '5:00pm',
      badge: 'Reminder',
      text: 'Your end-of-day update goes to your manager at 6:00pm. Finish your tasks if you can.',
      mine: false,
    },
  ],
  'lead-conversion-agent': thread('lc', [
    [
      'lead-conversion-agent',
      '8:45am',
      'Ritu S. (score 96) asked for a final price on WhatsApp 2 days ago. She is your best chance to close today.',
    ],
    ['lead-conversion-agent', '8:46am', 'Suggested opener is ready in Calls to make.'],
  ]),
  'capture-agent': thread('cap', [
    ['capture-agent', '11:00am', 'Capture coverage is 78%, up 1 point. 2 walk-ins yesterday left without a number.'],
    ['capture-agent', '11:01am', 'Ask for the WhatsApp number before showing the price. It lifts capture by about 12 points.'],
  ]),
  'customer-discussions': thread('cd', [
    ['Faizan A. (WhatsApp)', '10:05am', 'Is the Ortho GRID Pro available in king size this week?'],
    ['You', '10:12am', 'Yes, I can arrange delivery on Monday. Shall I send the quote?'],
    ['Faizan A. (WhatsApp)', '10:15am', 'Please do, thanks!'],
  ]),
  'all-stores': thread('all', [
    ['Rashmi Sehgal', '10:22am', 'New Ortho Grid campaign from 1 June! Hero offer is 0% EMI for 12 months.'],
    ['Mukunda Dwarkanath', '10:30am', 'Store training deck is in the shared drive. Please go through it this week.'],
  ]),
  'avani-coaching': thread('av', [
    [
      'AvaniBot',
      '9:01am',
      'Your warranty score dropped 12% this week. Mention the 10-year warranty once the customer shows price interest.',
    ],
    ['AvaniBot', '9:02am', 'Want a 2-minute practice call on this? Use Practise a call in the sidebar.'],
  ]),
  'manage-shipment': thread('ship', [
    ['Dispatch Bot', '10:05am', '📦 Ortho Grid Pro, order #4821: ready for delivery ✓'],
    ['Dispatch Bot', '10:40am', '📦 Smart Luxe, order #4825: packed, pickup at 2pm'],
  ]),
  'quotation-tickets': thread('qt', [
    ['Quotation Bot', '9:12am', '🎫 Quotation approval for Mukunda (Ortho GRID + pillows): awaiting approval'],
    ['Sunita Rao', '9:40am', 'Approved at 8% discount.'],
  ]),
  'new-hire-onboarding': thread('nh', [
    ['HR Team', '8:30am', '🎉 Welcome to the team! Your first-week checklist is pinned in the shared drive.'],
  ]),
  'dm-sunita': thread('dms', [
    ['Sunita Rao', '12:40pm', '🌟 Great work with Mukunda, keep it up'],
    ['You', '12:42pm', 'Thank you! Sending the quote now.'],
  ]),
  'dm-priya': thread('dmp', [['Priya Krishnan', '9:55am', 'Can you cover my 3pm slot today?']]),
  'dm-raju': thread('dmr', [['Raju Kumar', 'Yesterday', 'Nice cross-sell on the Tranquo chair! 🔥']]),
  avanibot: [
    {
      id: 'ab-1',
      author: 'You',
      initials: 'AR',
      time: 'Just now',
      text: 'Give me my daily brief',
      mine: true,
    },
    {
      id: 'ab-2',
      author: 'AvaniBot',
      initials: 'AB',
      time: 'Just now',
      badge: 'BOT',
      text: `🌟 Here's today's brief
• Avg Handle Time: 4m 12s ▼8% — nice improvement
• Warranty score down 12% this week — worth a look in #avani-coaching
• Greeting-in-first-10s at 71% — Sunita wants this pushed up
• You've got 3 new kudos waiting 🏆

Want me to open avani-coaching, or pull up your kudos?`,
      mine: false,
    },
  ],
}

/** Channels whose counterpart is a bot, with the reply it gives to any message. */
export const AUTO_REPLIES = {
  avanibot: {
    author: 'AvaniBot',
    text: 'Thanks for asking. Today: 2 callbacks due, 2 hot leads untouched, greeting QA at 71%. Open Calls to make to start.',
  },
  'avani-coaching': { author: 'AvaniBot', text: 'Noted. I will track that and check in after your next 5 calls.' },
  'callcentre-agent': { author: 'callcentre-agent', text: 'Understood, I have updated your plan for the shift.' },
  'cross-sell-agent': { author: 'cross-sell-agent', text: 'Noted. I will watch your attach rate on the next calls.' },
  'sop-agent': { author: 'sop-agent', text: 'Noted. I will flag it if it is missed on your next calls.' },
  'lead-conversion-agent': { author: 'lead-conversion-agent', text: 'Understood, I have re-ranked your leads.' },
  'capture-agent': { author: 'capture-agent', text: 'Noted. I will track capture coverage on your next walk-ins.' },
}

/** Unread counts at the start of the session. */
export const INITIAL_UNREAD = {
  'callcentre-agent': 2,
  'cross-sell-agent': 2,
  'sop-agent': 2,
  'lead-conversion-agent': 2,
  'capture-agent': 2,
  'customer-discussions': 2,
  'callcentre-team': 1,
  'all-stores': 4,
  'avani-coaching': 1,
  'manage-shipment': 1,
  'quotation-tickets': 1,
  'new-hire-onboarding': 0,
}

export const welcomeMessages = (name) => [
  { id: `${name}-w1`, author: 'AvaniBot', initials: 'AB', time: '9:00am', mine: false, text: `Welcome to ${name}. Say hello!` },
]
