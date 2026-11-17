import Field, { controlClasses, describedBy } from "./Field";
import { cn } from "@/lib/cn";

export default function Textarea({ id, label, hint, error, required, rows = 4, className, ...props }) {
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <textarea
        id={id}
        name={props.name ?? id}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(controlClasses, "py-3 leading-relaxed", error ? "border-error" : "border-line")}
        {...props}
      />
    </Field>
  );
}
