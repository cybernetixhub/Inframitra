"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface Spec {
  label: string;
  value: string;
}

export default function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [condition, setCondition] = useState<string>("NEW");
  const [status, setStatus] = useState<string>("DRAFT");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [sku, setSku] = useState("");
  const [warranty, setWarranty] = useState("");
  const [shippingInfo, setShippingInfo] = useState("");
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [imageUrls, setImageUrls] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [productRes, catRes, brandRes] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch("/api/categories"),
          fetch("/api/brands"),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(
            Array.isArray(catData) ? catData : catData.categories || []
          );
        }
        if (brandRes.ok) {
          const brandData = await brandRes.json();
          setBrands(
            Array.isArray(brandData) ? brandData : brandData.brands || []
          );
        }

        if (!productRes.ok) {
          toast.error("Product not found");
          router.push("/admin/products");
          return;
        }

        const product = await productRes.json();
        setTitle(product.title || "");
        setDescription(product.description || "");
        setCategoryId(product.categoryId || "");
        setBrandId(product.brandId || "");
        setCondition(product.condition || "NEW");
        setStatus(product.status || "DRAFT");
        setPrice(product.price?.toString() || "");
        setComparePrice(product.comparePrice?.toString() || "");
        setQuantity(product.quantity?.toString() || "1");
        setSku(product.sku || "");
        setWarranty(product.warranty || "");
        setShippingInfo(product.shippingInfo || "");
        setSpecs(
          product.specs?.map((s: { label: string; value: string }) => ({
            label: s.label,
            value: s.value,
          })) || []
        );
        setImageUrls(
          product.images
            ?.map((img: { url: string }) => img.url)
            .join("\n") || ""
        );
      } catch {
        toast.error("Failed to load product data");
      } finally {
        setFetching(false);
      }
    }
    loadData();
  }, [id, router]);

  function addSpec() {
    setSpecs([...specs, { label: "", value: "" }]);
  }

  function removeSpec(index: number) {
    setSpecs(specs.filter((_, i) => i !== index));
  }

  function updateSpec(index: number, field: "label" | "value", val: string) {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !description || !price || !categoryId || !condition) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        title,
        description,
        categoryId,
        condition,
        status,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10) || 1,
      };

      if (brandId) body.brandId = brandId;
      else body.brandId = null;

      if (comparePrice) body.comparePrice = parseFloat(comparePrice);
      else body.comparePrice = null;

      if (sku) body.sku = sku;
      if (warranty) body.warranty = warranty;
      if (shippingInfo) body.shippingInfo = shippingInfo;

      const validSpecs = specs.filter((s) => s.label && s.value);
      body.specs = validSpecs;

      const urls = imageUrls
        .split("\n")
        .map((u) => u.trim())
        .filter(Boolean);
      body.images = urls.map((url) => ({ url, alt: title }));

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update product");
      }

      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update product"
      );
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Edit Product (Admin)
        </h1>
        <p className="text-muted-foreground">
          Update the product listing details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Product details visible to buyers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Dell PowerEdge R740 Server"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the product in detail..."
                rows={5}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <select
                  id="brand"
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Select brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="condition">Condition *</Label>
                <select
                  id="condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  required
                >
                  <option value="NEW">New</option>
                  <option value="REFURBISHED">Refurbished</option>
                  <option value="USED">Used</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="ACTIVE">Active</option>
                  <option value="PENDING_REVIEW">Pending Review</option>
                  <option value="SOLD">Sold</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price (INR) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comparePrice">Compare at Price</Label>
                <Input
                  id="comparePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warranty">Warranty</Label>
                <Input
                  id="warranty"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  placeholder="e.g. 1 Year"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shippingInfo">Shipping Info</Label>
              <Input
                id="shippingInfo"
                value={shippingInfo}
                onChange={(e) => setShippingInfo(e.target.value)}
                placeholder="e.g. Free shipping pan-India"
              />
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>
              Paste image URLs, one per line.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="imageUrls">Image URLs</Label>
              <Textarea
                id="imageUrls"
                value={imageUrls}
                onChange={(e) => setImageUrls(e.target.value)}
                placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Enter one image URL per line. The first image will be the
                primary image.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
            <CardDescription>
              Add technical specs as key-value pairs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {specs.map((spec, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={spec.label}
                  onChange={(e) => updateSpec(index, "label", e.target.value)}
                  placeholder="e.g. Processor"
                  className="flex-1"
                />
                <Input
                  value={spec.value}
                  onChange={(e) => updateSpec(index, "value", e.target.value)}
                  placeholder="e.g. Intel Xeon Gold 6248R"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeSpec(index)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addSpec}>
              <Plus className="mr-2 size-4" />
              Add Specification
            </Button>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/products")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Update Product
          </Button>
        </div>
      </form>
    </div>
  );
}
