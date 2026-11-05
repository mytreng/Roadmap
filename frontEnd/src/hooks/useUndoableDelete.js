import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { parseApiError } from "../api/errors";
import { useToast } from "../context/ToastContext";
import { clearPending, markPending } from "../lib/pendingDeletes";

export const UNDO_WINDOW_MS = 6000;

/**
 * "Delete now, really delete later."
 *
 * 1. The item disappears from the UI immediately (`removeFromCache`).
 * 2. A toast offers Undo for a few seconds.
 * 3. Only when that window closes do we send the real DELETE request.
 *
 * Undo is therefore free: nothing happened on the server yet, so we only
 * need to refetch to bring the item back.
 */
export function useUndoableDelete() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useCallback(
    ({
      key, // "section:12" - identifies the item in pendingDeletes
      queryKey, // cache entry that holds the item
      message, // toast text
      removeFromCache, // () => void - optimistic removal
      commit, // () => Promise - the real DELETE
      afterCommit, // () => void - e.g. refresh related queries
      errorMessage = "Failed to delete.",
    }) => {
      let finished = false;

      markPending(key);
      queryClient.cancelQueries({ queryKey });
      removeFromCache();

      const restore = () => {
        clearPending(key);
        queryClient.invalidateQueries({ queryKey });
      };

      const timer = setTimeout(async () => {
        if (finished) return;
        finished = true;

        try {
          await commit();
          clearPending(key);
          afterCommit?.();
        } catch (error) {
          // Already gone on the server? Then the user got what they wanted.
          if (parseApiError(error).kind === "notFound") {
            clearPending(key);
            afterCommit?.();
            return;
          }

          restore();
          toast.error(parseApiError(error, errorMessage).message);
        }
      }, UNDO_WINDOW_MS);

      toast.show({
        type: "info",
        message,
        duration: UNDO_WINDOW_MS,
        action: {
          label: "Undo",
          onClick: () => {
            if (finished) return;
            finished = true;
            clearTimeout(timer);
            restore();
          },
        },
      });
    },
    [queryClient, toast],
  );
}
