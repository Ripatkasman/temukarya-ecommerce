"use client";

import { createContext, useContext, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import { controlClasses } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

const FormCtx = createContext({ errors: {}, pending: false });

/**
 * Form untuk Server Action dengan umpan balik lengkap:
 *  - error per field (dari `errors` yang dikembalikan action),
 *  - toast sukses HANYA setelah action melaporkan ok,
 *  - tombol loading selama berjalan,
 *  - input tidak dikosongkan saat validasi gagal (form tidak di-reset).
 * Action mengembalikan { ok, message?, errors?, redirectTo? }.
 */
export function ServerForm({ action, children, className, resetOnSuccess = false, onSuccess, id }) {
  const toast = useToast();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);

  function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    startTransition(async () => {
      let res;
      try {
        res = await action(null, fd);
      } catch (err) {
        // redirect() dari Server Action ditangani Next.js; error lain ditampilkan sebagai pesan form.
        if (String(err?.digest ?? "").startsWith("NEXT_REDIRECT")) return;
        setFormError("Terjadi gangguan saat menyimpan. Periksa koneksi lalu coba lagi.");
        return;
      }
      if (res?.ok) {
        setErrors({});
        setFormError(null);
        if (res.message) toast.success(res.message);
        if (resetOnSuccess) form.reset();
        onSuccess?.(res);
        if (res.redirectTo) router.push(res.redirectTo);
      } else if (res) {
        setErrors(res.errors ?? {});
        setFormError(res.message ?? (res.errors ? "Periksa kembali isian yang ditandai." : null));
      }
    });
  }

  return (
    <FormCtx.Provider value={{ errors, pending }}>
      <form id={id} onSubmit={onSubmit} noValidate className={cn("space-y-5", className)}>
        {formError && (
          <div role="alert" className="flex items-start gap-2.5 rounded-btn border border-error/30 bg-error-soft px-4 py-3 text-sm font-medium text-error-strong">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p>{formError}</p>
          </div>
        )}
        {children}
      </form>
    </FormCtx.Provider>
  );
}

const useForm = () => useContext(FormCtx);

export function TextField({ name, ...props }) {
  const { errors } = useForm();
  return <Input id={name} name={name} error={errors[name]} {...props} />;
}

export function PasswordField({ name, ...props }) {
  const { errors } = useForm();
  return <PasswordInput id={name} name={name} error={errors[name]} {...props} />;
}

export function AreaField({ name, ...props }) {
  const { errors } = useForm();
  return <Textarea id={name} name={name} error={errors[name]} {...props} />;
}

export function SelectField({ name, ...props }) {
  const { errors } = useForm();
  return <Select id={name} name={name} error={errors[name]} {...props} />;
}

export function CheckField({ name, ...props }) {
  return <Checkbox id={name} name={name} {...props} />;
}

/** Input file gambar dengan pratinjau gambar saat ini (opsional). */
export function ImageField({ name = "image", label, hint, required, currentUrl }) {
  const { errors } = useForm();
  const [preview, setPreview] = useState(null);
  const src = preview ?? currentUrl;
  return (
    <Field id={name} label={label} hint={hint} error={errors[name]} required={required}>
      <div className="flex flex-wrap items-center gap-4">
        {src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={preview ? "Pratinjau gambar baru" : "Gambar saat ini"} className="size-24 rounded-btn border border-line object-cover" />
        )}
        <input
          id={name}
          name={name}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-invalid={errors[name] ? true : undefined}
          aria-describedby={errors[name] ? `${name}-error` : hint ? `${name}-hint` : undefined}
          onChange={(e) => {
            const f = e.target.files?.[0];
            setPreview(f ? URL.createObjectURL(f) : null);
          }}
          className={cn(controlClasses, "h-auto py-2.5 text-sm file:mr-3 file:rounded-btn file:border-0 file:bg-cream file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primary", errors[name] ? "border-error" : "border-line")}
        />
      </div>
    </Field>
  );
}

/** Tombol submit yang membaca status pending dari ServerForm. */
export function SubmitBtn({ children, loadingLabel, className, variant, size }) {
  const { pending } = useForm();
  return (
    <Button type="submit" loading={pending} variant={variant} size={size} className={className}>
      {pending && loadingLabel ? loadingLabel : children}
    </Button>
  );
}
