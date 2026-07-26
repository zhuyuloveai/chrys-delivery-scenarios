export function dataIsolatedCount(items) {
  const list = Array.isArray(items) ? items : [];
  return {
    total: list.length,
    valid: list.filter((item) => item?.valid === true).length,
  };
}
