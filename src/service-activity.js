export function summarizeServiceActivity(events) {
  const list = Array.isArray(events) ? events : [];
  const commandSet = new Set();
  let automated = 0;
  let manual = 0;

  for (const event of list) {
    if (event.automated === true) {
      automated++;
    } else {
      manual++;
    }
    if (event.command && event.command !== "") {
      commandSet.add(event.command);
    }
  }

  return {
    total: list.length,
    automated,
    manual,
    command_names: [...commandSet].sort(),
  };
}
