import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const StarRating = ({ rating, max = 5, size = 16, interactive = false, onChange }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: max }).map((_, i) => (
      <Star
        key={i}
        size={size}
        className={cn(
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
          interactive && "cursor-pointer hover:fill-yellow-400 hover:text-yellow-400 transition-colors"
        )}
        onClick={() => interactive && onChange?.(i + 1)}
      />
    ))}
  </div>
);

export default StarRating;
