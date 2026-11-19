"use client";

import { useFormStatus } from "react-dom";
import Button from "./Button";

/** Tombol submit yang otomatis menampilkan loading selama Server Action berjalan. */
export default function SubmitButton({ children, loadingLabel, ...props }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} {...props}>
      {pending && loadingLabel ? loadingLabel : children}
    </Button>
  );
}
