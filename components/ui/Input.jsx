import Field, { controlClasses, describedBy } from "./Field";
import { cn } from "@/lib/cn";

export default function Input({ id, label, hint, error, required, className, ...props }) {
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <input
        id={id}
        name={props.name ?? id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(controlClasses, "h-12", error ? "border-error" : "border-line")}
        {...props}
      />
    </Field>
  );
}
