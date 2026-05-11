import { useState } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import StarRating from "@/components/atoms/StarRating";
import ReviewCard from "@/components/molecules/ReviewCard";
import { useProduct } from "@/hooks/useProducts";
import { useReviews, useAddReview, useDeleteReview } from "@/hooks/useReviews";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/store/authStore";
import { useToast } from "../store/Toast";
import { formatPrice } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { data: product, isLoading } = useProduct(id);
  const { data: reviews } = useReviews(id);
  const addToCart = useAddToCart();
  const addReview = useAddReview(id);
  const deleteReview = useDeleteReview(id);

  const handleAddToCart = () => {
    if (!user) return toast({ title: "Please login first", variant: "destructive" });
    addToCart.mutate({ productId: id, quantity: 1 }, {
      onSuccess: () => toast({ title: "Added to cart!" }),
    });
  };

  const handleReview = (e) => {
    e.preventDefault();
    addReview.mutate({ rating, comment }, {
      onSuccess: () => { setComment(""); toast({ title: "Review added!" }); },
      onError: (err) => toast({ title: err.response?.data?.message || "Error", variant: "destructive" }),
    });
  };

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-8">
        <Skeleton className="h-80 w-full rounded-lg" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  if (!product) return <p className="text-center py-16 text-muted-foreground">Product not found.</p>;

  return (
    <div className="animate-fade-in space-y-10">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="rounded-lg overflow-hidden border">
          <img
            src={product.images?.[0] || "https://placehold.co/600x400?text=No+Image"}
            alt={product.name}
            className="w-full h-80 object-cover"
          />
        </div>

        <div className="space-y-4">
          <div>
            <Badge variant="secondary">{product.category?.name}</Badge>
            <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={Math.round(product.averageRating || 0)} />
              <span className="text-sm text-muted-foreground">({product.totalReviews} reviews)</span>
            </div>
          </div>

          <p className="text-3xl font-bold text-primary">{formatPrice(product.price)}</p>
          <p className="text-muted-foreground">{product.description}</p>
          <p className="text-sm">
            Stock: <span className={product.stock > 0 ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
              {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
            </span>
          </p>

          {user?.role === "customer" && (
            <Button size="lg" onClick={handleAddToCart} disabled={addToCart.isPending || product.stock === 0}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          )}
        </div>
      </div>

      <Separator />

      <div className="space-y-6">
        <h2 className="text-xl font-bold">Reviews ({reviews?.length || 0})</h2>

        {user?.role === "customer" && (
          <form onSubmit={handleReview} className="border rounded-lg p-4 space-y-3 bg-card">
            <h3 className="font-medium">Leave a Review</h3>
            <div className="space-y-1">
              <Label>Rating</Label>
              <StarRating rating={rating} interactive onChange={setRating} size={22} />
            </div>
            <div className="space-y-1">
              <Label>Comment</Label>
              <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." required />
            </div>
            <Button type="submit" disabled={addReview.isPending}>Submit Review</Button>
          </form>
        )}

        <div>
          {reviews?.length > 0
            ? reviews.map((r) => <ReviewCard key={r._id} review={r} onDelete={(id) => deleteReview.mutate(id)} />)
            : <p className="text-muted-foreground text-sm">No reviews yet.</p>
          }
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
