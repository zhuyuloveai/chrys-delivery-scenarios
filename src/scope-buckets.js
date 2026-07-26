export function classifyActorBuckets(items) {
  if (!Array.isArray(items)) {
    return { people: 0, service_accounts: 0, unmapped: 0, total: 0 };
  }

  let people = 0;
  let service_accounts = 0;
  let unmapped = 0;

  for (const item of items) {
    if (item == null) {
      unmapped++;
      continue;
    }

    const type = item.actor_type;

    if (type === "person") {
      people++;
    } else if (type === "service") {
      service_accounts++;
    } else {
      unmapped++;
    }
  }

  return { people, service_accounts, unmapped, total: items.length };
}
