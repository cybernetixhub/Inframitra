interface ProductSpecsProps {
  specs: { id: string; label: string; value: string }[];
}

export function ProductSpecs({ specs }: ProductSpecsProps) {
  if (specs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No specifications available.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full">
        <tbody>
          {specs.map((spec, index) => (
            <tr
              key={spec.id}
              className={index % 2 === 0 ? "bg-muted/50" : "bg-background"}
            >
              <td className="w-1/3 px-4 py-3 text-sm font-medium text-muted-foreground lg:w-1/4">
                {spec.label}
              </td>
              <td className="px-4 py-3 text-sm">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
