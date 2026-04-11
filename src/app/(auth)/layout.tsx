import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-icon.svg" alt="InfraMitra" className="h-12 w-12 rounded-xl" />
        <span className="font-bold text-3xl">
          Infra<span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">Mitra</span>
        </span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
