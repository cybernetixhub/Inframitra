import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/format";
import { CONDITION_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { AdminProductActions } from "@/components/admin/product-actions";

export const metadata = {
  title: "Product Management",
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  ACTIVE: "default",
  DRAFT: "outline",
  SOLD: "secondary",
  ARCHIVED: "secondary",
  PENDING_REVIEW: "outline",
};

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      seller: { select: { name: true, email: true } },
      category: { select: { name: true } },
      brand: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Product Management
        </h1>
        <p className="text-muted-foreground">
          Review, approve, and manage all product listings.
        </p>
      </div>

      {products.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          No products in the marketplace yet.
        </p>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.category.name}
                        {product.brand ? ` / ${product.brand.name}` : ""}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">
                        {product.seller.name || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.seller.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(product.price.toString())}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {CONDITION_LABELS[product.condition] || product.condition}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={STATUS_VARIANT[product.status] || "secondary"}
                    >
                      {product.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(product.createdAt)}
                  </TableCell>
                  <TableCell>
                    <AdminProductActions
                      productId={product.id}
                      currentStatus={product.status}
                    />
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
