"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  title: string;
  price: number;
  location: string | null;
  created_at: string;
  images: string[];
  status: string;
}

interface ProductListProps {
  initialProducts: Product[];
  category?: string;
  search?: string;
  userId?: string;
  statusFilter?: string;
}

const PAGE_SIZE = 20;

export default function ProductList({
  initialProducts,
  category,
  search,
  userId,
  statusFilter,
}: ProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length === PAGE_SIZE);

  useEffect(() => {
    setProducts(initialProducts);
    setHasMore(initialProducts.length === PAGE_SIZE);
  }, [initialProducts]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const supabase = createClient();
      let query = supabase
        .from("products")
        .select("id, title, price, location, created_at, images, status")
        .order("created_at", { ascending: false })
        .range(products.length, products.length + PAGE_SIZE - 1);

      if (category) query = query.eq("category", category);
      if (search) query = query.ilike("title", `%${search}%`);
      if (userId) query = query.eq("user_id", userId);
      if (statusFilter) query = query.eq("status", statusFilter);

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        setProducts((prev) => [...prev, ...data]);
        setHasMore(data.length === PAGE_SIZE);
      }
    } catch (err) {
      console.error("Load more error:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, products.length, category, search, userId, statusFilter]);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <svg className="mb-2 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-sm">등록된 상품이 없습니다</p>
      </div>
    );
  }

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
      {hasMore && (
        <div className="flex justify-center py-4">
          <button
            onClick={loadMore}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-6 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? "불러오는 중..." : "더 보기"}
          </button>
        </div>
      )}
    </div>
  );
}
