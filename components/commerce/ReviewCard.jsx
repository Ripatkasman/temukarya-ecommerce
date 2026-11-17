import { UserRound } from "lucide-react";
import Rating from "./Rating";

export default function ReviewCard({ review }) {
  const date = review.created_at
    ? new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(review.created_at))
    : null;
  return (
    <article className="rounded-card border border-line bg-surface p-4">
      <header className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-cream text-primary">
          <UserRound className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{review.buyer_name}</p>
          {date && <p className="text-caption text-muted-strong">{date}</p>}
        </div>
      </header>
      <div className="mt-3"><Rating value={review.rating} count={1} showCount={false} /></div>
      {review.comment && <p className="mt-2 text-sm leading-relaxed">{review.comment}</p>}
    </article>
  );
}
