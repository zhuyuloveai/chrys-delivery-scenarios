export function manualUnknownNote(entries) {
  const list = Array.isArray(entries) ? entries : [];
  const manual_notes = list.filter((entry) => entry && entry.source === "manual").length;
  const unresolved_notes = list.filter((entry) => entry && entry.resolved !== true).length;

  return {
    total_notes: list.length,
    manual_notes,
    unresolved_notes,
    has_unresolved_manual_note:
      list.some((entry) => entry && entry.source === "manual" && entry.resolved !== true),
  };
}
