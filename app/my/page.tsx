import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductList from "@/components/ProductList";
import { PRODUCT_STATUS } from "@/lib/constants";
import Link from "next/link";
import SignOutButton from "./SignOutButton";
import ProfileEditor from "./ProfileEditor";

export default async function MyPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  let query = supabase
    .from("products")
    .select("id, title, price, location, created_at, images, status")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (status) query = query.eq("status", status);

  const { data: products } = await query;

  return (
    <div className="bg-white">
      {/* Profile section */}
      <div className="border-b border-gray-200 px-4 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-2xl font-bold text-primary">
            {profile?.nickname?.charAt(0) ?? "?"}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">
              {profile?.nickname ?? "사용자"}
            </h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            {profile?.location && (
              <p className="text-xs text-gray-400">{profile.location}</p>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <ProfileEditor
            nickname={profile?.nickname ?? ""}
            location={profile?.location ?? ""}
          />
          <SignOutButton />
        </div>
      </div>

      {/* Products section */}
      <div className="border-b border-gray-200 px-4 py-3">
        <h3 className="text-base font-bold text-gray-900">내 판매 상품</h3>
      </div>

      {/* Status filter */}
      <div className="flex gap-1 border-b border-gray-100 px-4 py-2">
        <Link
          href="/my"
          className={`rounded-full px-3 py-1.5 text-xs font-medium ${
            !status
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          전체
        </Link>
        {PRODUCT_STATUS.map((s) => (
          <Link
            key={s}
            href={`/my?status=${encodeURIComponent(s)}`}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              status === s
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      <ProductList
        initialProducts={products ?? []}
        userId={user.id}
        statusFilter={status}
      />
    </div>
  );
}
