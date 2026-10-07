export class ApiError extends Error {
  constructor({ kind, status = null, message }) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
  }
}

const STATUS_MESSAGES = {
  400: "Some details look incorrect. Please review them and try again.",
  401: "Your session has expired or is invalid. Please sign in again.",
  403: "You don't have permission to do that in this context.",
  404: "We couldn't find what you were looking for.",
  409: "This conflicts with something that already exists.",
  413: "That file is too large to upload.",
  415: "That file type isn't supported.",
  422: "Some details look incorrect. Please review them and try again.",
  429: "Too many requests. Please wait a moment and try again.",
};

const UNSAFE = /(exception|traceback|stack|error:|sql|mongo|undefined|null|at\s+\S+\s+\()/i;

// Only short, human-readable validation messages are surfaced to users.
function safeServerMessage(data) {
  const msg = typeof data === "string" ? data : data?.message ?? data?.error;
  if (typeof msg !== "string") return null;
  const trimmed = msg.trim();
  if (!trimmed || trimmed.length > 160 || trimmed.includes("\n") || UNSAFE.test(trimmed)) return null;
  return trimmed;
}

export function toApiError(error) {
  if (error instanceof ApiError) return error;
  if (error?.code === "ERR_CANCELED") return new ApiError({ kind: "canceled", message: "Request canceled." });
  if (error?.response) {
    const { status, data } = error.response;
    const fromServer = [400, 409, 422].includes(status) ? safeServerMessage(data) : null;
    const message =
      fromServer ||
      STATUS_MESSAGES[status] ||
      (status >= 500 ? "Something went wrong on our side. Please try again shortly." : "The request couldn't be completed.");
    return new ApiError({ kind: status === 401 ? "unauthorized" : "http", status, message });
  }
  if (error?.code === "ECONNABORTED") {
    return new ApiError({ kind: "timeout", message: "The server took too long to respond. Please try again." });
  }
  if (error?.request) {
    return new ApiError({ kind: "network", message: "We couldn't reach the server. Check your connection and try again." });
  }
  return new ApiError({ kind: "unknown", message: "Something went wrong. Please try again." });
}

export const getErrorMessage = (err) =>
  err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
