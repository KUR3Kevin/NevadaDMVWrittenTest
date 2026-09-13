/** Calendar date in the user's local timezone (YYYY-MM-DD). */
export function localDateString(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function yesterdayLocalString(from = new Date()): string {
  const prior = new Date(from.getFullYear(), from.getMonth(), from.getDate() - 1)
  return localDateString(prior)
}
