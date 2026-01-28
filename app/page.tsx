import { createClient } from "@/lib/supabase/server";
import ProductList from "@/components/ProductList";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { category, search } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("id, title, price, location, created_at, images, status")
    .order("created_at", { ascending: false })
    .limit(20);

  if (category) query = query.eq("category", category);
  if (search) query = query.ilike("title", `%${search}%`);

  const { data: products } = await query;

  return (
    <div>
      {/* Search bar */}
      <div className="border-b border-gray-100 bg-white px-4 py-3">
        <form className="relative">
          <input
            name="search"
            type="text"
            defaultValue={search ?? ""}
            placeholder="검색어를 입력해주세요"
            className="w-full rounded-lg bg-gray-100 py-2.5 pl-10 pr-4 text-sm focus:bg-white focus:ring-1 focus:ring-primary focus:outline-none"
          />
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {category && <input type="hidden" name="category" value={category} />}
        </form>
      </div>

      {/* Category filter */}
      <div className="overflow-x-auto border-b border-gray-100 bg-white">
        <div className="flex gap-1 px-4 py-2">
          <Link
            href={search ? `/?search=${encodeURIComponent(search)}` : "/"}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
              !category
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            전체
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/?category=${encodeURIComponent(cat)}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                category === cat
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Product list */}
      <ProductList
        initialProducts={products ?? []}
        category={category}
        search={search}
      />
    </div>
  );
}
