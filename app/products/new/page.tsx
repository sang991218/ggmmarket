import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/ProductForm";

export default async function NewProductPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="bg-white">
      <div className="border-b border-gray-200 px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900">상품 등록</h1>
      </div>
      <ProductForm />
    </div>
  );
}
