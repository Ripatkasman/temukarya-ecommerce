import { ChevronDown } from "lucide-react";
import Field, { controlClasses, describedBy } from "./Field";
import { cn } from "@/lib/cn";

/** Select native (aksesibel). `options`: [{ value, label }] atau children <option>. */
export default function Select({ id, label, hint, error, required, options, placeholder, className, children, ...props }) {
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <div className="relative">
        <select
          id={id}
          name={props.name ?? id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={cn(controlClasses, "h-12 appearance-none pr-10", error ? "border-error" : "border-line")}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options
            ? options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))
            : children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-strong" aria-hidden="true" />
      </div>
    </Field>
  );
}
