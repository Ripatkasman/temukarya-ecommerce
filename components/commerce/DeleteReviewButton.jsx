"use client";

import { useActionState, useEffect, useState } from "react";
import { X, TriangleAlert } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import SubmitButton from "@/components/ui/SubmitButton";
import { deleteReviewAsAdminAction } from "@/lib/actions/admin";

export default function DeleteReviewButton({ review, productId }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(deleteReviewAsAdminAction, null);

  useEffect(() => {
    if (state?.ok) {
      setOpen(false);
    }
  }, [state]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Hapus ulasan dari ${review.buyer_name}`}
        title="Hapus ulasan yang melanggar regulasi"
        className="flex size-8 shrink-0 items-center justify-center rounded-btn text-muted-strong transition-colors hover:bg-error-soft hover:text-error-strong"
      >
        <X className="size-4" aria-hidden="true" />
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Hapus Ulasan Pembeli?"
        description="Ulasan yang melanggar ketentuan akan dihapus secara permanen dan tidak dapat dikembalikan."
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <form action={formAction}>
              <input type="hidden" name="id" value={review.id} />
              {productId && <input type="hidden" name="productId" value={productId} />}
              <SubmitButton variant="danger" loadingLabel="Menghapus…" className="w-full sm:w-auto">
                Ya, Hapus Ulasan
              </SubmitButton>
            </form>
          </>
        }
      >
        <div className="space-y-3">
          {state?.message && !state?.ok && (
            <div role="alert" className="flex items-start gap-2 rounded-btn border border-error/30 bg-error-soft px-3 py-2 text-xs font-medium text-error-strong">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <p>{state.message}</p>
            </div>
          )}

          <div className="rounded-card border border-line bg-cream/60 p-3.5 text-sm">
            <p className="text-xs font-semibold text-muted-strong">
              Ulasan oleh <span className="text-charcoal">{review.buyer_name}</span>
            </p>
            <p className="mt-1.5 whitespace-pre-line text-charcoal">
              “{review.comment}”
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}