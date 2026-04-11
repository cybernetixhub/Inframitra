"use client";

const BRANDS = [
  { name: "Dell", color: "text-blue-600 border-blue-200 bg-blue-50" },
  { name: "HP Enterprise", color: "text-green-600 border-green-200 bg-green-50" },
  { name: "Cisco", color: "text-sky-600 border-sky-200 bg-sky-50" },
  { name: "Lenovo", color: "text-red-600 border-red-200 bg-red-50" },
  { name: "Supermicro", color: "text-indigo-600 border-indigo-200 bg-indigo-50" },
  { name: "NetApp", color: "text-violet-600 border-violet-200 bg-violet-50" },
  { name: "IBM", color: "text-blue-700 border-blue-200 bg-blue-50" },
  { name: "Juniper", color: "text-teal-600 border-teal-200 bg-teal-50" },
  { name: "Fortinet", color: "text-rose-600 border-rose-200 bg-rose-50" },
  { name: "Aruba", color: "text-orange-600 border-orange-200 bg-orange-50" },
];

export function BrandPartners() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <p className="mb-8 text-center text-lg font-medium text-muted-foreground">
          Trusted by enterprises. Powered by top brands.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {BRANDS.map((brand) => (
            <div
              key={brand.name}
              className={`group cursor-default rounded-full border px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 grayscale hover:grayscale-0 hover:shadow-md ${brand.color}`}
            >
              {brand.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
