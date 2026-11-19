import { Star } from "lucide-react";
import { ServerForm, AreaField, SubmitBtn } from "./ServerForm";
import { submitReviewAction } from "@/lib/actions/buyer";

/** Form ulasan untuk satu item pesanan yang sudah selesai. */
export default function ReviewForm({ orderItemId, productName }) {
  return (
    <ServerForm action={submitReviewAction} className="space-y-3 rounded-btn border border-line bg-cream/50 p-3">
      <input type="hidden" name="orderItemId" value={orderItemId} />
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">Beri rating untuk {productName}</legend>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer">
              <input type="radio" name="rating" value={n} className="peer sr-only" required />
              <span className="flex h-11 min-w-11 items-center justify-center gap-1 rounded-btn border border-line bg-surface px-2.5 text-sm font-semibold peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary">
                {n}<Star className="size-4" aria-hidden="true" /><span className="sr-only"> bintang</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <AreaField id={`comment-${orderItemId}`} name="comment" label="Ulasan" rows={3} required maxLength={1000} placeholder="Ceritakan pengalamanmu dengan produk ini" />
      <SubmitBtn size="sm" loadingLabel="Mengirim…">Kirim ulasan</SubmitBtn>
    </ServerForm>
  );
}
