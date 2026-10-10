export function pageCount(total, pageSize) {
  return Math.max(1, Math.ceil(total / pageSize))
}

export function clampPage(page, total, pageSize) {
  return Math.min(Math.max(1, page), pageCount(total, pageSize))
}

export function paginate(items, page, pageSize) {
  const safe = clampPage(page, items.length, pageSize)
  return items.slice((safe - 1) * pageSize, safe * pageSize)
}

/** Clamp an index into [0, length - 1]; used for the leads modal paging. */
export function clampIndex(index, length) {
  return Math.min(Math.max(0, index), Math.max(0, length - 1))
}
