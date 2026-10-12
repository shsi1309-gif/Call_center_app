// AI Conversation Engine for Live Voice Calls
// Simulates realistic real-time conversation flows with intelligent responses,
// dynamic sentiment tracking, and automatic call summary generation.

export const CONVERSATION_SCENARIOS = {
  'ai-to-human': {
    leadName: 'Shivam Singh',
    product: 'Tranquo Massager Chair · ₹24,990',
    initialGreeting:
      'Hello Shivam! This is Arvind from The Sleep Company. I saw you contacted our On-Ground AI Helpline (+91 80 9578 1284) about the Tranquo Massager and Smart Luxe. Am I catching you at a good time?',
    quickPrompts: [
      { id: 'emi', label: '💳 Offer 0% EMI', text: 'Can you tell me about the EMI options available?' },
      { id: 'discount', label: '🏷️ 10% Festive Discount', text: 'Is there any discount or ongoing festival offer on this?' },
      { id: 'warranty', label: '🛡️ 3-Year Warranty', text: 'What kind of warranty and home service do you provide?' },
      { id: 'trial', label: '🏡 Free Home Demo', text: 'Can I test it or get a home demo before buying?' },
      { id: 'close', label: '✅ Confirm & Book', text: 'Looks great! How soon can you deliver it if I place the order?' },
    ],
    responses: [
      {
        keywords: ['emi', 'finance', 'installment', 'per month', 'monthly'],
        customerReply:
          'Yes, absolutely! We have 0% interest no-cost EMI starting at just ₹2,082 per month for 12 months with all major credit cards and Bajaj Finserv. Zero down payment needed!',
        sentiment: 92,
        sentimentLabel: 'Very Positive',
        sopPoint: 'EMI / Financing Mention',
      },
      {
        keywords: ['discount', 'offer', 'price', 'deal', 'cost', 'expensive', 'rate'],
        customerReply:
          'Great timing! With our festive offer right now, you get an instant ₹2,500 cash discount plus a free neck contour pillow worth ₹1,999. Your final price is only ₹22,490.',
        sentiment: 88,
        sentimentLabel: 'Positive',
        sopPoint: 'Product Pitch',
      },
      {
        keywords: ['warranty', 'guarantee', 'service', 'break', 'defect', 'repair'],
        customerReply:
          'The Tranquo Massager comes with a comprehensive 3-year on-site motor and mechanism warranty. If anything goes wrong, our technician visits your doorstep within 24 hours at zero cost.',
        sentiment: 85,
        sentimentLabel: 'Positive',
        sopPoint: 'Warranty Mention',
      },
      {
        keywords: ['demo', 'trial', 'test', 'experience', 'visit'],
        customerReply:
          'We can arrange a free in-store VIP demo at our Koramangala flagship store today, or our delivery specialist can bring an experience unit directly to your home!',
        sentiment: 90,
        sentimentLabel: 'High Intent',
        sopPoint: 'Needs Discovery',
      },
      {
        keywords: ['confirm', 'book', 'order', 'deliver', 'buy', 'payment', 'great'],
        customerReply:
          'Fantastic! I have locked in your festive price of ₹22,490 with free express doorstep delivery tomorrow afternoon. I am sending the WhatsApp payment link and receipt now.',
        sentiment: 98,
        sentimentLabel: 'Deal Closed',
        sopPoint: 'Closing / Callback Booking',
      },
    ],
    defaultReply:
      'I understand completely! The Tranquo features 8-zone deep-tissue rollers with heat therapy, perfectly suited for back pain relief after work hours. Would you like me to send the product specs on WhatsApp?',
  },

  'human-to-human': {
    leadName: 'Shivam Singh (Customer)',
    product: 'Smart Luxe Mattress · ₹34,990',
    initialGreeting:
      'Connecting WebRTC softphone... Two-way carrier-grade audio channel established with Shivam (+91 63611 67314). Microphones live.',
    quickPrompts: [
      { id: 'greet', label: '👋 Standard Greeting', text: 'Hello Shivam, thank you for taking my call!' },
      { id: 'pitch', label: '🛏️ Recommend Smart Luxe', text: 'Based on your search, the Smart Luxe with Patented Grid is ideal for back support.' },
      { id: 'hold', label: '⏸️ Put on Hold', text: 'Please give me one moment while I check warehouse inventory.' },
      { id: 'transfer', label: '🔄 Transfer to Manager', text: 'Transferring call to Store Supervisor Rohit Kumar...' },
    ],
    responses: [
      {
        keywords: ['hello', 'greeting', 'hi', 'call'],
        customerReply: 'Hi Arvind, yes I was looking for a mattress for chronic lower back pain. Can you help me choose the right firmness?',
        sentiment: 78,
        sentimentLabel: 'Engaged',
        sopPoint: 'Opening & Intent Confirm',
      },
      {
        keywords: ['smart luxe', 'grid', 'mattress', 'back support'],
        customerReply: 'That sounds really good. Does it sink in too much or does it give firm ergonomic support?',
        sentiment: 84,
        sentimentLabel: 'Positive',
        sopPoint: 'Needs Discovery',
      },
      {
        keywords: ['hold', 'inventory', 'moment'],
        customerReply: '[Hold Music Playing - Ambient Chords] Caller is waiting patiently on line.',
        sentiment: 75,
        sentimentLabel: 'On Hold',
        sopPoint: 'Customer Courtesy',
      },
      {
        keywords: ['transfer', 'manager', 'rohit'],
        customerReply: 'Supervisor Rohit has joined the conference bridge. Audio merged successfully.',
        sentiment: 89,
        sentimentLabel: 'Escalated',
        sopPoint: 'Closing / Callback Booking',
      },
    ],
    defaultReply:
      'Sounds great, Arvind. If you can send me the final quote and trial terms on WhatsApp, I will discuss with my family and confirm tonight.',
  },

  'real-phone': {
    leadName: 'Shivam Singh (PSTN Cellular)',
    product: 'Tranquo Smart Massager · ₹24,990',
    initialGreeting:
      'Ringing mobile carrier phone +91 63611 67314 via Vapi Telecom Gateway. Handset connected.',
    quickPrompts: [
      { id: 'greet', label: '👋 Standard Greeting', text: 'Hello Shivam, calling from The Sleep Company call centre.' },
      { id: 'pitch', label: '🪑 Explain Massager', text: 'Our Tranquo chair has 8-zone body mapping rollers.' },
      { id: 'emi', label: '💳 0% EMI Offer', text: 'You can get this on zero down-payment ₹2,082/mo EMI.' },
    ],
    responses: [
      {
        keywords: ['hello', 'hi', 'sleep company'],
        customerReply: 'Yes hello, this is Shivam speaking. Tell me more.',
        sentiment: 85,
        sentimentLabel: 'Connected',
        sopPoint: 'Opening & Intent Confirm',
      },
    ],
    defaultReply: 'Great to speak with you! Let me send the complete catalog and warranty details to +91 63611 67314 on WhatsApp.',
  },
}

export function matchAiResponse(scenarioKey, userText) {
  const scenario = CONVERSATION_SCENARIOS[scenarioKey] || CONVERSATION_SCENARIOS['ai-to-human']
  const lower = userText.toLowerCase()

  for (const resp of scenario.responses) {
    if (resp.keywords.some((kw) => lower.includes(kw))) {
      return resp
    }
  }

  return {
    customerReply: scenario.defaultReply,
    sentiment: 80,
    sentimentLabel: 'Positive',
    sopPoint: 'Needs Discovery',
  }
}
