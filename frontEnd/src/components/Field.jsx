import { useId } from "react";

/** Label + control + inline validation message, wired up for accessibility. */
export default function Field({
  label,
  error,
  as: Control = "input",
  className = "",
  id,
  ...props
}) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const errorId = `${fieldId}-error`;

  return (
    <div>
      {label && (
        <label htmlFor={fieldId} className="label">
          {label}
        </label>
      )}

      <Control
        id={fieldId}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`input ${className}`}
        {...props}
      />

      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
