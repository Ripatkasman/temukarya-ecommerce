"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Field, { controlClasses, describedBy } from "./Field";
import { cn } from "@/lib/cn";

/** Input password dengan tombol tampilkan/sembunyikan. */
export default function PasswordInput({ id, label = "Kata sandi", hint, error, required, className, ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <div className="relative">
        <input
          id={id}
          name={props.name ?? id}
          type={visible ? "text" : "password"}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={cn(controlClasses, "h-12 pr-12", error ? "border-error" : "border-line")}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-btn text-muted-strong hover:text-primary"
        >
          {visible ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
        </button>
      </div>
    </Field>
  );
}
