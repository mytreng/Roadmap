import { userKey } from "../hooks/queries";

/** Call after a successful login/register: store token + seed the user cache. */
export function startSession(queryClient, { token, user }) {
  // Never let one account see another account's cached data.
  queryClient.clear();
  localStorage.setItem("token", token);
  if (user) queryClient.setQueryData(userKey, user);
}

/** Drop the token AND every cached response (they belong to the old user). */
export function endSession(queryClient) {
  localStorage.removeItem("token");
  queryClient.clear();
}
