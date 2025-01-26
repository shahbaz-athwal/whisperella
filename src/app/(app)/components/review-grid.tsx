import { ReviewCard } from "./review-card";
import { ReviewProps } from "../page";
export default function ReviewGrid({ reviews }: { reviews: ReviewProps[] }) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
