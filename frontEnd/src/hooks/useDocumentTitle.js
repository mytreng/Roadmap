import { useEffect } from "react";

const APP_NAME = "Roadmap";

/** Sets the browser tab title for the current page. */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${APP_NAME}` : APP_NAME;
  }, [title]);
}
