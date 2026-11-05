// Items the user deleted but that are still inside the "Undo" window.
// Keys look like "roadmap:5", "section:12", "step:40".
//
// Queries filter these out when they (re)fetch, so a background refetch can't
// bring a just-deleted item back to life before the real DELETE is sent.
const pending = new Set();

export const markPending = (key) => pending.add(key);
export const clearPending = (key) => pending.delete(key);
export const isPendingDelete = (key) => pending.has(key);
export const hasPendingDeletes = () => pending.size > 0;
