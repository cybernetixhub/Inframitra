"use client";

import { useState, useEffect } from "react";
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
import { Plus, Trash2, Loader2, Upload, X } from "lucide-react";

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

export default function AdminNewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [condition, setCondition] = useState<string>("NEW");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [sku, setSku] = useState("");
  const [warranty, setWarranty] = useState("");
  const [shippingInfo, setShippingInfo] = useState("");
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [imageUrls, setImageUrls] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, brandRes] = await Promise.all([
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
      } catch {
        // Categories/brands will be empty
      }
    }
    loadData();
  }, []);

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
        price: parseFloat(price),
        quantity: parseInt(quantity, 10) || 1,
      };

      if (brandId) body.brandId = brandId;
      if (comparePrice) body.comparePrice = parseFloat(comparePrice);
      if (sku) body.sku = sku;
      if (warranty) body.warranty = warranty;
      if (shippingInfo) body.shippingInfo = shippingInfo;

      const validSpecs = specs.filter((s) => s.label && s.value);
      if (validSpecs.length > 0) body.specs = validSpecs;

      const pastedUrls = imageUrls
        .split("\n")
        .map((u) => u.trim())
        .filter(Boolean);
      const allImageUrls = [...uploadedImages, ...pastedUrls];
      if (allImageUrls.length > 0) {
        body.images = allImageUrls.map((url) => ({ url, alt: title }));
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create product");
      }

      toast.success("Product created successfully!");
      router.push("/admin/products");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Add New Product (Admin)
        </h1>
        <p className="text-muted-foreground">
          Create a new product listing for the marketplace.
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
              Upload images or paste URLs. First image will be the primary image.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File Upload */}
            <div className="space-y-2">
              <Label>Upload Images</Label>
              <div className="flex items-center gap-3">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed px-4 py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  <Upload className="size-4" />
                  {uploading ? "Uploading..." : "Choose files"}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    disabled={uploading}
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (!files || files.length === 0) return;
                      setUploading(true);
                      try {
                        const formData = new FormData();
                        for (let i = 0; i < files.length; i++) {
                          formData.append("files", files[i]);
                        }
                        const res = await fetch("/api/upload", {
                          method: "POST",
                          body: formData,
                        });
                        if (res.ok) {
                          const data = await res.json();
                          setUploadedImages((prev) => [...prev, ...data.urls]);
                          toast.success(`${data.urls.length} image(s) uploaded`);
                        } else {
                          const data = await res.json();
                          toast.error(data.error || "Upload failed");
                        }
                      } catch {
                        toast.error("Upload failed");
                      } finally {
                        setUploading(false);
                        e.target.value = "";
                      }
                    }}
                  />
                </label>
                <span className="text-xs text-muted-foreground">
                  Max 5MB per image. JPG, PNG, WebP accepted.
                </span>
              </div>
            </div>

            {/* Uploaded image previews */}
            {uploadedImages.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Images</Label>
                <div className="flex flex-wrap gap-3">
                  {uploadedImages.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={url}
                        alt={`Upload ${idx + 1}`}
                        className="h-20 w-20 rounded-lg object-cover border"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setUploadedImages((prev) =>
                            prev.filter((_, i) => i !== idx)
                          )
                        }
                        className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* URL input as alternative */}
            <div className="space-y-2">
              <Label htmlFor="imageUrls">Or paste image URLs</Label>
              <Textarea
                id="imageUrls"
                value={imageUrls}
                onChange={(e) => setImageUrls(e.target.value)}
                placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                One URL per line. Use this if images are hosted externally.
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
            Create Product
          </Button>
        </div>
      </form>
    </div>
  );
}
