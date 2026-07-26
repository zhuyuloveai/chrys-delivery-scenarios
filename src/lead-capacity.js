export function leadCapacity(items) {
  if (!Array.isArray(items)) {
    return { total: 0, active: 0, inactive: 0 }
  }

  const total = items.length
  const active = items.filter(item => item && item.active === true).length
  const inactive = total - active

  return { total, active, inactive }
}
