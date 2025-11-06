export function uniqueId(prefix = ""): string {
  // compact and reasonably-unique id based on time + random hex
  const id = `${Date.now().toString(36)}-${Math.random()
    .toString(16)
    .slice(2, 10)}`;
  return prefix ? `${prefix}-${id}` : id;
}
