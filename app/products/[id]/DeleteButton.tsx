"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeleteButton({ productId }: { productId: number }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      alert("삭제에 실패했습니다.");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="flex-1 rounded-lg border border-red-300 py-2.5 text-center text-sm font-medium text-red-600 hover:bg-red-50"
    >
      삭제하기
    </button>
  );
}
