import { describe, expect, it } from 'vitest'
import { clampIndex, clampPage, pageCount, paginate } from './pagination'
import { buildMonthGrid, shiftMonth, toIso } from './calendar'
import { formatTimer, nowTime } from './format'

describe('pagination', () => {
  const items = [1, 2, 3, 4, 5, 6]
  it('splits six items into three pages of two', () => {
    expect(pageCount(6, 2)).toBe(3)
    expect(paginate(items, 1, 2)).toEqual([1, 2])
    expect(paginate(items, 3, 2)).toEqual([5, 6])
  })
  it('clamps out-of-range pages', () => {
    expect(clampPage(0, 6, 2)).toBe(1)
    expect(clampPage(9, 6, 2)).toBe(3)
    expect(pageCount(0, 2)).toBe(1)
  })
  it('clamps record index at both ends', () => {
    expect(clampIndex(-1, 5)).toBe(0)
    expect(clampIndex(5, 5)).toBe(4)
  })
})

describe('calendar', () => {
  it('rolls December forward to January of the next year', () => {
    expect(shiftMonth({ year: 2026, month: 11 }, 1)).toEqual({ year: 2027, month: 0 })
  })
  it('rolls January back to December of the previous year', () => {
    expect(shiftMonth({ year: 2027, month: 0 }, -1)).toEqual({ year: 2026, month: 11 })
  })
  it('handles multi-month jumps', () => {
    expect(shiftMonth({ year: 2026, month: 9 }, 14)).toEqual({ year: 2027, month: 11 })
    expect(shiftMonth({ year: 2026, month: 9 }, -10)).toEqual({ year: 2025, month: 11 })
  })
  it('aligns 1 October 2026 under Thursday', () => {
    const grid = buildMonthGrid({ year: 2026, month: 9 })
    expect(grid.slice(0, 4)).toEqual([null, null, null, null])
    expect(grid[4]).toEqual({ iso: '2026-10-01', day: 1 })
    expect(grid.filter(Boolean)).toHaveLength(31)
  })
  it('knows leap-year February', () => {
    expect(buildMonthGrid({ year: 2028, month: 1 }).filter(Boolean)).toHaveLength(29)
    expect(toIso(2026, 0, 5)).toBe('2026-01-05')
  })
})

describe('format', () => {
  it('formats timers and clock times', () => {
    expect(formatTimer(75)).toBe('01:15')
    expect(nowTime(new Date(2026, 9, 9, 14, 5))).toBe('2:05pm')
    expect(nowTime(new Date(2026, 9, 9, 0, 7))).toBe('12:07am')
  })
})

describe('callConversation', () => {
  it('matches EMI keywords to EMI response and high sentiment', async () => {
    const { matchAiResponse } = await import('./callConversation')
    const resp = matchAiResponse('ai-to-human', 'Can you tell me about the EMI options?')
    expect(resp.customerReply).toContain('0% interest no-cost EMI')
    expect(resp.sentiment).toBeGreaterThanOrEqual(90)
    expect(resp.sopPoint).toBe('EMI / Financing Mention')
  })

  it('matches discount keyword to festive offer', async () => {
    const { matchAiResponse } = await import('./callConversation')
    const resp = matchAiResponse('ai-to-human', 'Is there any discount or festive deal?')
    expect(resp.customerReply).toContain('festive offer')
    expect(resp.sentiment).toBeGreaterThanOrEqual(85)
  })

  it('matches warranty keyword to 3-year warranty info', async () => {
    const { matchAiResponse } = await import('./callConversation')
    const resp = matchAiResponse('ai-to-human', 'What is the warranty coverage?')
    expect(resp.customerReply).toContain('3-year')
  })
})

describe('callAudioEngine', () => {
  it('generates real-time visualizer levels array', async () => {
    const { callAudio } = await import('./callAudioEngine')
    const levels = callAudio.getVisualizerLevels('customer')
    expect(levels).toBeInstanceOf(Array)
    expect(levels.length).toBeGreaterThan(0)
    expect(levels[0]).toBeGreaterThan(0)
  })
})

describe('phoneCallService & telephony', () => {
  it('sanitizes and formats E.164 phone numbers for call centre dialing', async () => {
    const { sanitizePhoneNumber, formatPhoneNumber } = await import('./phoneCallService')
    expect(sanitizePhoneNumber('+91 98450 61245')).toBe('919845061245')
    expect(sanitizePhoneNumber('98450-61245')).toBe('9845061245')
    expect(formatPhoneNumber('9845061245')).toBe('+91 98450 61245')
  })

  it('provides default Vapi and Call Centre telephony configuration', async () => {
    const { getTelephonyConfig } = await import('./telephonyConfig')
    const config = getTelephonyConfig()
    expect(config.vapiPublicKey).toBe('affb096d-8be5-4554-a320-f2920f64e166')
    expect(config.vapiAssistantId).toBe('94354921-6e0a-4533-a7b0-68acfbadf50f')
    expect(config.callCentreNumber).toBe('+91 80 9578 1284')
    expect(config.defaultCustomerPhone).toBe('+91 63611 67314')
  })
})
