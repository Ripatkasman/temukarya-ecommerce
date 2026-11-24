"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { ServerForm, AreaField, SubmitBtn } from "./ServerForm";
import { submitReviewAction } from "@/lib/actions/buyer";

const LABELS = {
  1: "Sangat buruk",
  2: "Kurang memuaskan",
  3: "Cukup baik",
  4: "Bagus",
  5: "Sangat bagus",
};

export default function ReviewForm({ orderItemId, productName }) {
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);

  // Nilai aktif yang ditampilkan (prioritaskan hover saat kursor berada di atas bintang)
  const activeRating = hovered || rating;

  return (
    <ServerForm action={submitReviewAction} className="rounded-card border border-line bg-cream/60 p-4">
      <input type="hidden" name="orderItemId" value={orderItemId} />
      <input type="hidden" name="rating" value={rating} />

      <fieldset>
        <legend className="text-sm font-medium text-charcoal">
          Beri rating untuk {productName}
        </legend>

        <div className="mt-2 flex items-center gap-3">
          <div
            className="inline-flex items-center gap-1"
            onMouseLeave={() => setHovered(0)}
          >
            {[1, 2, 3, 4, 5].map((value) => {
              const isFilled = value <= activeRating;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHovered(value)}
                  aria-label={`Beri ${value} dari 5 bintang (${LABELS[value]})`}
                  aria-pressed={rating === value}
                  className="rounded-btn p-1 transition-transform duration-150 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Star
                    className={`size-8 transition-colors ${
                      isFilled
                        ? "fill-amber-400 text-amber-400"
                        : "fill-transparent text-stone-300 hover:text-amber-300"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          <span className="text-sm font-medium text-muted-strong" aria-live="polite">
            {LABELS[activeRating]}
          </span>
        </div>
      </fieldset>

      <AreaField
        name="comment"
        label="Ulasan"
        required
        rows={3}
        maxLength={1000}
        placeholder="Ceritakan pengalamanmu dengan produk ini"
      />

      <SubmitBtn>Kirim ulasan</SubmitBtn>
    </ServerForm>
  );
}