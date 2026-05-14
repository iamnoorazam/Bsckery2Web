import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StarRating from "@/components/atoms/StarRating";
import { formatPrice } from "@/lib/utils";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/store/authStore";
import { useToast } from "../../store/Toast";

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const addToCart = useAddToCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user)
      return toast({
        title: "Please login to add items to cart",
        variant: "destructive",
      });
    if (user.role !== "customer")
      return toast({
        title: "Only customers can add to cart",
        variant: "destructive",
      });
    addToCart.mutate(
      { productId: product._id, quantity: 1 },
      { onSuccess: () => toast({ title: "Added to cart!" }) },
    );
  };

  return (
    <Link to={`/products/${product._id}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in">
        <div className="relative overflow-hidden h-48">
          <img
            src={
              product.images?.[0] ||
              "https://placehold.co/400x300?text=No+Image"
            }
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.isBestSeller && (
            <Badge className="absolute top-2 left-2">Best Seller</Badge>
          )}
          {product.isFeatured && (
            <Badge variant="secondary" className="absolute top-2 right-2">
              Featured
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">
            {product.category?.name}
          </p>
          <h3 className="font-semibold text-base truncate">{product.name}</h3>
          <div className="flex items-center gap-1 mt-1">
            <StarRating
              rating={Math.round(product.averageRating || 0)}
              size={12}
            />
            <span className="text-xs text-muted-foreground">
              ({product.totalReviews})
            </span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="font-bold text-primary text-lg">
              {formatPrice(product.price)}
            </span>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={addToCart.isLoading}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
