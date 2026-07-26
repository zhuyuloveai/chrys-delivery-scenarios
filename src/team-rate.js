export function teamSuccessRate(items) {
  if (!Array.isArray(items)) {
    return { total: 0, successful: 0, failed: 0, rate: 0 }
  }

  const total = items.length
  if (total === 0) {
    return { total: 0, successful: 0, failed: 0, rate: 0 }
  }

  const successful = items.filter(item => item && item.ok === true).length
  const failed = total - successful
  const rate = successful / total

  return { total, successful, failed, rate }
}
