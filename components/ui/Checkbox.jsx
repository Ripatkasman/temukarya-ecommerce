import { cn } from "@/lib/cn";

export default function Checkbox({ id, label, hint, className, ...props }) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <input
        id={id}
        name={props.name ?? id}
        type="checkbox"
        className="mt-0.5 size-5 shrink-0 cursor-pointer rounded border-line accent-primary"
        {...props}
      />
      <label htmlFor={id} className="cursor-pointer text-sm text-charcoal">
        {label}
        {hint && <span className="block text-caption text-muted-strong">{hint}</span>}
      </label>
    </div>
  );
}
