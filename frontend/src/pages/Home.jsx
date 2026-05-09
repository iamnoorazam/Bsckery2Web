import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductGrid from "@/components/organisms/ProductGrid";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

const Home = () => {
  const { data, isLoading } = useProducts({ limit: 8 });
  const { data: categories } = useCategories();

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-16 animate-fade-in">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Fresh Baked,<br />
          <span className="text-primary">Just For You</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          Handcrafted cakes, momos, and spring rolls made fresh every day.
        </p>
        <Button size="lg" asChild>
          <Link to="/products">
            Shop Now <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>

      {/* Categories */}
      {categories?.length > 0 && (
        <section className="animate-slide-up">
          <h2 className="text-2xl font-bold mb-4">Browse Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link key={cat._id} to={`/products?category=${cat._id}`}>
                <Badge variant="secondary" className="text-sm px-4 py-2 cursor-pointer hover:bg-primary hover:text-white transition-colors">
                  {cat.name}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Our Products</h2>
          <Button variant="ghost" asChild>
            <Link to="/products">View all <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <ProductGrid products={data?.products} isLoading={isLoading} />
      </section>
    </div>
  );
};

export default Home;
