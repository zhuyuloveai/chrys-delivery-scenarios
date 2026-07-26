export function summarizeSalesWindow(items) {
  const list = Array.isArray(items) ? items : [];

  let won = 0;
  let lost = 0;
  let open = 0;

  for (const item of list) {
    const stage = item.stage ?? null;
    if (stage === "won") {
      won++;
    } else if (stage === "lost") {
      lost++;
    } else {
      open++;
    }
  }

  const total = won + lost;
  const win_rate = total === 0 ? 0 : won / total;

  return {
    opportunities: list.length,
    won,
    lost,
    open,
    win_rate,
  };
}
