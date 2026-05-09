import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProductGrid from "@/components/organisms/ProductGrid";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const category = searchParams.get("category") || "";

  const { data, isLoading } = useProducts({ search, category, limit: 20 });
  const { data: categories } = useCategories();

  const setCategory = (id) => {
    const params = new URLSearchParams(searchParams);
    id ? params.set("category", id) : params.delete("category");
    setSearchParams(params);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">All Products</h1>
        <p className="text-muted-foreground mt-1">
          {data?.total ?? 0} products available
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={!category ? "default" : "secondary"}
            className="cursor-pointer px-3 py-1.5"
            onClick={() => setCategory("")}
          >
            All
          </Badge>
          {categories?.map((cat) => (
            <Badge
              key={cat._id}
              variant={category === cat._id ? "default" : "secondary"}
              className="cursor-pointer px-3 py-1.5"
              onClick={() => setCategory(cat._id)}
            >
              {cat.name}
            </Badge>
          ))}
        </div>
      </div>

      <ProductGrid products={data?.products} isLoading={isLoading} />
    </div>
  );
};

export default Products;
