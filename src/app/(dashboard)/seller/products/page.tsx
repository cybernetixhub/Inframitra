import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/format";
import { CONDITION_LABELS } from "@/lib/constants";
import Link from "next/link";
import { LinkButton } from "@/components/shared/link-button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Plus, Pencil, Package } from "lucide-react";
import { DeleteProductButton } from "@/components/seller/delete-product-button";

export const metadata = {
  title: "My Products",
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  ACTIVE: "default",
  DRAFT: "outline",
  SOLD: "secondary",
  ARCHIVED: "secondary",
  PENDING_REVIEW: "outline",
};

export default async function SellerProductsPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");
  if (session.user.role !== "SELLER" && session.user.role !== "ADMIN") {
    redirect("/");
  }

  const products = await prisma.product.findMany({
    where: { sellerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      brand: { select: { name: true } },
      images: { take: 1, orderBy: { sortOrder: "asc" } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Products</h1>
          <p className="text-muted-foreground">
            Manage your product listings.
          </p>
        </div>
        <LinkButton href="/seller/products/new">
          <Plus className="mr-2 size-4" />
          Add Product
        </LinkButton>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Package className="mb-4 size-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">No products yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Get started by adding your first product listing.
          </p>
          <LinkButton href="/seller/products/new">
            <Plus className="mr-2 size-4" />
            Add Product
          </LinkButton>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.images[0] ? (
                        <img
                          src={product.images[0].url}
                          alt={product.title}
                          className="size-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                          <Package className="size-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{product.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.category.name}
                          {product.brand ? ` / ${product.brand.name}` : ""}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(product.price.toString())}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {CONDITION_LABELS[product.condition] || product.condition}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[product.status] || "secondary"}>
                      {product.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <LinkButton
                        href={`/seller/products/${product.id}/edit`}
                        variant="ghost"
                        size="icon-sm"
                      >
                        <Pencil className="size-4" />
                        <span className="sr-only">Edit</span>
                      </LinkButton>
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
