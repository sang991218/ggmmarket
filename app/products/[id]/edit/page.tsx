import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  if (product.user_id !== user.id) {
    redirect(`/products/${id}`);
  }

  return (
    <div className="bg-white">
      <div className="border-b border-gray-200 px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900">상품 수정</h1>
      </div>
      <ProductForm
        initialData={{
          id: product.id,
          title: product.title,
          description: product.description ?? "",
          price: product.price,
          category: product.category,
          location: product.location ?? "",
          images: product.images ?? [],
        }}
      />
    </div>
  );
}
