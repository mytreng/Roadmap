import { useEffect, useRef, useState } from "react";

/**
 * A button that only fires after being held down (mouse, touch or keyboard).
 * Releasing early cancels. Protects destructive actions from accidental clicks.
 */
export default function HoldButton({
  onComplete,
  duration = 1200,
  disabled = false,
  className = "btn-danger",
  children,
}) {
  const [holding, setHolding] = useState(false);
  const timer = useRef(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  const cancel = () => {
    clearTimeout(timer.current);
    timer.current = null;
    setHolding(false);
  };

  const start = () => {
    if (disabled || timer.current) return;

    setHolding(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      setHolding(false);
      onCompleteRef.current();
    }, duration);
  };

  // Don't fire after the component is gone.
  useEffect(() => () => clearTimeout(timer.current), []);

  const isActionKey = (event) => event.key === " " || event.key === "Enter";

  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={`${typeof children === "string" ? children : "Confirm"} (press and hold)`}
      className={`${className} relative touch-none overflow-hidden select-none`}
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onBlur={cancel}
      onContextMenu={(event) => event.preventDefault()}
      onKeyDown={(event) => {
        if (isActionKey(event)) {
          event.preventDefault();
          if (!event.repeat) start();
        }
      }}
      onKeyUp={(event) => isActionKey(event) && cancel()}
    >
      {/* Fill that grows while holding */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 bg-black/25 ease-linear"
        style={{
          width: holding ? "100%" : "0%",
          transitionProperty: "width",
          transitionDuration: holding ? `${duration}ms` : "150ms",
        }}
      />

      <span className="relative">{holding ? "Keep holding…" : children}</span>
    </button>
  );
}
