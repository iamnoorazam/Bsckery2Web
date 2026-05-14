import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EmptyState from "@/components/atoms/EmptyState";
import Spinner from "@/components/atoms/Spinner";
import { useOwnerProducts } from "@/hooks/useOwner";
import { useCreateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useToast } from "../../store/Toast";
import { formatPrice } from "@/lib/utils";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
};

const OwnerProducts = () => {
  const { data: products, isLoading, refetch: refetchOwnerProducts } = useOwnerProducts();
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    setErrors((p) => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.price || Number(form.price) <= 0) e.price = "Enter a valid price";
    if (!form.category) e.category = "Please select a category";
    if (!form.stock || Number(form.stock) < 0) e.stock = "Enter valid stock";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (createProduct.isLoading) return;
    if (!validate()) return;

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("price", form.price);
    fd.append("category", form.category);
    fd.append("stock", form.stock);
    images.forEach((img) => fd.append("images", img));

    createProduct.mutate(fd, {
      onSuccess: () => {
        refetchOwnerProducts();
        toast({ title: "Product created!" });
        setOpen(false);
        setForm(emptyForm);
        setImages([]);
        setErrors({});
      },
      onError: (err) =>
        toast({
          title: err.response?.data?.message || "Failed to create product",
          variant: "destructive",
        }),
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          My Products ({products?.length ?? 0})
        </h1>

        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) {
              setForm(emptyForm);
              setErrors({});
              setImages([]);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-3 mt-2">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={set("name")}
                  placeholder="e.g. Chocolate Cake"
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label>Description</Label>
                <Input
                  value={form.description}
                  onChange={set("description")}
                  placeholder="Short description"
                />
                {errors.description && (
                  <p className="text-xs text-destructive">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={form.price}
                    onChange={set("price")}
                    placeholder="500"
                  />
                  {errors.price && (
                    <p className="text-xs text-destructive">{errors.price}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={set("stock")}
                    placeholder="10"
                  />
                  {errors.stock && (
                    <p className="text-xs text-destructive">{errors.stock}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Label>Category</Label>
                {categories?.length > 0 ? (
                  <Select
                    value={form.category}
                    onValueChange={(v) => {
                      setForm((p) => ({ ...p, category: v }));
                      setErrors((p) => ({ ...p, category: "" }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground border rounded-md px-3 py-2">
                    No categories yet — ask admin to create one first
                  </p>
                )}
                {errors.category && (
                  <p className="text-xs text-destructive">{errors.category}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label>Images (optional)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setImages(Array.from(e.target.files))}
                  className="cursor-pointer"
                />
                {images.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {images.length} file(s) selected
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={createProduct.isLoading}
              >
                {createProduct.isLoading ? "Creating..." : "Create Product"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!products?.length ? (
        <EmptyState
          icon="🍰"
          title="No products yet"
          description="Add your first product!"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <Card key={p._id} className="overflow-hidden">
              <div className="h-36 overflow-hidden bg-muted">
                <img
                  src={
                    p.images?.[0] ||
                    "https://placehold.co/300x200?text=No+Image"
                  }
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-3">
                <p className="font-semibold truncate">{p.name}</p>
                <p className="text-primary font-bold">{formatPrice(p.price)}</p>
                <p className="text-xs text-muted-foreground">
                  Stock: {p.stock}
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-2 w-full"
                  disabled={deleteProduct.isLoading}
                  onClick={() =>
                    deleteProduct.mutate(p._id, {
                      onSuccess: () => {
                        refetchOwnerProducts();
                        toast({ title: "Product deleted" });
                      },
                      onError: () =>
                        toast({
                          title: "Failed to delete",
                          variant: "destructive",
                        }),
                    })
                  }
                >
                  <Trash2 className="h-3 w-3 mr-1" /> Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerProducts;
