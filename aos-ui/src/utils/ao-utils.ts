export function prettyEntityId(entityId: string) {
  if (!entityId || entityId.length <= 10) {
    return entityId;
  }
  return entityId.slice(0, 5) + '...' + entityId.slice(-5);
}
