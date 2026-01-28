import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ImageSlider from "@/components/ImageSlider";
import { formatPrice, formatRelativeTime } from "@/lib/utils";
import StatusChanger from "./StatusChanger";
import DeleteButton from "./DeleteButton";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Increment view count
  await supabase.rpc("increment_view_count", { product_id: Number(id) });

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      *,
      profiles:user_id (nickname, avatar_url, location)
    `
    )
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner = user?.id === product.user_id;

  return (
    <div className="bg-white">
      <ImageSlider images={product.images ?? []} alt={product.title} />

      <div className="px-4 py-4">
        {/* Seller info */}
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary">
            {(product.profiles as { nickname: string })?.nickname?.charAt(0) ?? "?"}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {(product.profiles as { nickname: string })?.nickname ?? "알 수 없음"}
            </p>
            <p className="text-xs text-gray-500">
              {(product.profiles as { location?: string })?.location ?? "위치 정보 없음"}
            </p>
          </div>
        </div>

        {/* Product info */}
        <div className="py-4">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {product.category}
            </span>
            {product.status !== "판매중" && (
              <span
                className={`rounded px-2 py-0.5 text-xs font-medium ${
                  product.status === "예약중"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {product.status}
              </span>
            )}
          </div>
          <h1 className="mt-2 text-xl font-bold text-gray-900">{product.title}</h1>
          <p className="mt-1 text-xs text-gray-400">
            {formatRelativeTime(product.created_at)} · 조회 {product.view_count ?? 0}
          </p>

          <p className="mt-4 text-2xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </p>

          {product.description && (
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
              {product.description}
            </p>
          )}

          {product.location && (
            <p className="mt-4 text-sm text-gray-500">
              거래 희망 장소: {product.location}
            </p>
          )}
        </div>

        {/* Owner actions */}
        {isOwner && (
          <div className="space-y-3 border-t border-gray-100 pt-4">
            <StatusChanger productId={product.id} currentStatus={product.status} />
            <div className="flex gap-2">
              <Link
                href={`/products/${product.id}/edit`}
                className="flex-1 rounded-lg border border-gray-300 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                수정하기
              </Link>
              <DeleteButton productId={product.id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
