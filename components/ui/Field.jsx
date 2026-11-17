import { cn } from "@/lib/cn";

/** Pembungkus label + hint + pesan error untuk semua kontrol form. */
export default function Field({ id, label, hint, error, required, children, className }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-charcoal">
          {label}
          {required && (
            <span className="ml-0.5 text-error-strong" aria-hidden="true">*</span>
          )}
        </label>
      )}
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-caption text-muted-strong">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-caption font-medium text-error-strong">
          {error}
        </p>
      )}
    </div>
  );
}

export const controlClasses =
  "w-full rounded-btn border bg-surface px-3.5 text-base text-charcoal placeholder:text-muted-strong/70 " +
  "transition-colors focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-primary " +
  "disabled:cursor-not-allowed disabled:bg-cream disabled:text-muted-strong";

export function describedBy(id, hint, error) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}
