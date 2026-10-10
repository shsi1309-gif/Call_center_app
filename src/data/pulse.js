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
  'callcentre-agent': thread('cca', [
    ['callcentre-agent', '9:02am', 'Good morning Arvind. You have 2 callbacks due today, the next one is at 4:30pm.'],
    ['callcentre-agent', '9:03am', 'Two hot leads (Mukunda, Kavitha R.) have been untouched for 24h. Want me to queue them first?'],
    ['You', '9:05am', 'Yes, queue Mukunda first.'],
    ['callcentre-agent', '9:05am', 'Done. Mukunda is now at the top of Calls to make.'],
  ]),
  'cross-sell-agent': thread('xs', [
    ['cross-sell-agent', '10:10am', 'Your attach rate is 24%, up 2 points this week. Team target is 30%.'],
    [
      'cross-sell-agent',
      '10:11am',
      'Tip: customers who buy an Ortho GRID attach a pillow set 41% of the time when it is offered before the quote.',
    ],
    ['You', '10:14am', 'Got it, I will offer pillows first.'],
  ]),
  'sop-agent': thread('sop', [
    ['sop-agent', '9:30am', 'SOP adherence is 81%, up 2 points. Greeting and closing questions are strong.'],
    ['sop-agent', '9:31am', 'Warranty mention is missing on 3 of your last 8 calls. That is the biggest gap.'],
    ['You', '9:40am', 'Will add it to my pitch.'],
  ]),
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
  avanibot: thread('ab', [
    [
      'AvaniBot',
      '9:00am',
      'Hey! I\'m AvaniBot ✨ Ask me things like "what are my action items from Sunita", or tap the ✨ icon inside any channel to search just that channel.',
    ],
  ]),
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
