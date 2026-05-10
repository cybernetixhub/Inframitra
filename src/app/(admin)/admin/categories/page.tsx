import { prisma } from "@/lib/prisma";
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
import { CategoryActions } from "@/components/admin/category-actions";
import { FolderTree, Plus } from "lucide-react";

export const metadata = {
  title: "Category Management",
};

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Category Management
          </h1>
          <p className="text-muted-foreground">
            Create, edit, and organize product categories.
          </p>
        </div>
        <LinkButton href="/admin/categories/new">
          <Plus className="mr-2 size-4" />
          Add Category
        </LinkButton>
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border py-12">
          <FolderTree className="mb-4 size-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-medium">No categories yet</h3>
          <p className="mb-4 text-muted-foreground">
            Create your first category to organize products.
          </p>
          <LinkButton href="/admin/categories/new">
            <Plus className="mr-2 size-4" />
            Add Category
          </LinkButton>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Products</TableHead>
                <TableHead className="text-center">Sort Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {category.icon && (
                        <span className="text-muted-foreground">
                          {category.icon}
                        </span>
                      )}
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                      {category.slug}
                    </code>
                  </TableCell>
                  <TableCell className="max-w-[250px] truncate text-sm text-muted-foreground">
                    {category.description || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={category._count.products > 0 ? "secondary" : "outline"}>
                      {category._count.products}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground">
                    {category.sortOrder}
                  </TableCell>
                  <TableCell>
                    <CategoryActions
                      categoryId={category.id}
                      categoryName={category.name}
                      productCount={category._count.products}
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
