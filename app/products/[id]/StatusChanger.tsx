"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PRODUCT_STATUS } from "@/lib/constants";

interface StatusChangerProps {
  productId: number;
  currentStatus: string;
}

export default function StatusChanger({ productId, currentStatus }: StatusChangerProps) {
  const router = useRouter();

  const handleChange = async (newStatus: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", productId);

    if (error) {
      alert("상태 변경에 실패했습니다.");
      return;
    }

    router.refresh();
  };

  return (
    <div className="flex gap-2">
      {PRODUCT_STATUS.map((status) => (
        <button
          key={status}
          onClick={() => handleChange(status)}
          className={`flex-1 rounded-lg py-2 text-sm font-medium ${
            currentStatus === status
              ? "bg-primary text-white"
              : "border border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}
