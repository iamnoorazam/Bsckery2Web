import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/atoms/StarRating";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/store/authStore";

const ReviewCard = ({ review, onDelete }) => {
  const { user } = useAuth();
  const isOwner = user?._id === review.customer?._id || user?.id === review.customer?._id;

  return (
    <div className="flex gap-3 py-4 border-b last:border-0 animate-fade-in">
      <Avatar className="h-9 w-9">
        <AvatarFallback>{review.customer?.name?.[0]?.toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">{review.customer?.name}</p>
            <StarRating rating={review.rating} size={13} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
            {(isOwner || user?.role === "admin") && (
              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => onDelete(review._id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
