const DEFAULT_MESSAGE = "Something went wrong. Please try again.";

const flattenFieldErrors = (errors) => {
  if (!errors || typeof errors !== "object") return {};

  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [
      field,
      Array.isArray(messages) ? messages[0] : String(messages),
    ]),
  );
};

/**
 * Normalizes any axios error into a predictable shape so the UI never has to
 * poke at `error.response?.data?.message` directly.
 *
 * {
 *   kind: "network" | "timeout" | "canceled" | "auth" | "forbidden" |
 *         "notFound" | "validation" | "rateLimit" | "server" | "unknown",
 *   status: number | null,
 *   message: string,                 // safe to show to the user
 *   fieldErrors: { [field]: string },// Laravel-style validation errors
 *   retryable: boolean,
 * }
 */
export function parseApiError(error, fallback = DEFAULT_MESSAGE) {
  // Cached by the response interceptor so we only parse once.
  if (error?.apiError) {
    return fallback !== DEFAULT_MESSAGE && error.apiError.kind === "unknown"
      ? { ...error.apiError, message: fallback }
      : error.apiError;
  }

  const base = { status: null, fieldErrors: {}, retryable: false };

  if (error?.code === "ERR_CANCELED") {
    return { ...base, kind: "canceled", message: "" };
  }

  // No response at all: offline, DNS, CORS, server down, or timeout.
  if (error?.isAxiosError && !error.response) {
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return {
        ...base,
        kind: "timeout",
        retryable: true,
        message: "The request took too long. Please try again.",
      };
    }

    return {
      ...base,
      kind: "network",
      retryable: true,
      message:
        typeof navigator !== "undefined" && navigator.onLine === false
          ? "You appear to be offline. Check your connection and try again."
          : "Can't reach the server. Please try again in a moment.",
    };
  }

  // Not an HTTP error (e.g. a thrown `new Error("...")` in our own code).
  if (!error?.response) {
    return { ...base, kind: "unknown", message: error?.message || fallback };
  }

  const { status, data, headers } = error.response;
  const serverMessage =
    typeof data?.message === "string" && data.message.trim()
      ? data.message
      : null;
  const fieldErrors = flattenFieldErrors(data?.errors);
  const firstFieldError = Object.values(fieldErrors)[0];

  if (status === 422) {
    return {
      kind: "validation",
      status,
      fieldErrors,
      retryable: false,
      message: firstFieldError || serverMessage || "Please check your input.",
    };
  }

  if (status === 401) {
    return {
      ...base,
      kind: "auth",
      status,
      message: serverMessage || "Your session has expired. Please log in again.",
    };
  }

  if (status === 403) {
    return {
      ...base,
      kind: "forbidden",
      status,
      message: serverMessage || "You don't have permission to do that.",
    };
  }

  if (status === 404) {
    return {
      ...base,
      kind: "notFound",
      status,
      message: "We couldn't find what you were looking for.",
    };
  }

  if (status === 429) {
    const retryAfter = Number(headers?.["retry-after"]);
    return {
      ...base,
      kind: "rateLimit",
      status,
      retryable: true,
      message: retryAfter
        ? `Too many requests. Please wait ${retryAfter}s and try again.`
        : "Too many requests. Please slow down and try again shortly.",
    };
  }

  // 5xx: never leak raw exception text from the backend to the user.
  if (status >= 500) {
    return {
      ...base,
      kind: "server",
      status,
      retryable: true,
      message:
        fallback !== DEFAULT_MESSAGE
          ? `${fallback} Our server hit a problem, please try again.`
          : "Our server hit a problem. Please try again in a moment.",
    };
  }

  return {
    ...base,
    kind: "unknown",
    status,
    fieldErrors,
    message: serverMessage || fallback,
  };
}

/** Shorthand when you only need the text. */
export const getErrorMessage = (error, fallback) =>
  parseApiError(error, fallback).message;

export const isCanceled = (error) => parseApiError(error).kind === "canceled";
