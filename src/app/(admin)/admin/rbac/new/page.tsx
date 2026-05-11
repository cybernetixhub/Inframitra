import { LinkButton } from "@/components/shared/link-button";
import { RbacGroupForm } from "@/components/admin/rbac-group-form";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Create RBAC Group",
};

export default function NewRbacGroupPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <LinkButton href="/admin/rbac" variant="ghost" size="icon-sm">
          <ArrowLeft className="size-4" />
        </LinkButton>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Create RBAC Group
          </h1>
          <p className="text-muted-foreground">
            Define a new group with specific permissions.
          </p>
        </div>
      </div>

      <RbacGroupForm />
    </div>
  );
}
