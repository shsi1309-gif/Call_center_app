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
