"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "./ImageUpload";
import CategorySelect from "./CategorySelect";
import { CATEGORIES } from "@/lib/constants";

interface ProductFormProps {
  initialData?: {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    location: string;
    images: string[];
  };
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [price, setPrice] = useState(initialData?.price ?? 0);
  const [category, setCategory] = useState(initialData?.category ?? CATEGORIES[0]);
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [images, setImages] = useState<string[]>(initialData?.images ?? []);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!category) {
      alert("카테고리를 선택해주세요.");
      return;
    }

    setSubmitting(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("로그인이 필요합니다.");
        router.push("/login");
        return;
      }

      const productData = {
        title: title.trim(),
        description: description.trim(),
        price,
        category,
        location: location.trim() || null,
        images,
        updated_at: new Date().toISOString(),
      };

      if (isEdit) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", initialData.id);

        if (error) throw error;
        router.push(`/products/${initialData.id}`);
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert({ ...productData, user_id: user.id })
          .select("id")
          .single();

        if (error) throw error;
        router.push(`/products/${data.id}`);
      }

      router.refresh();
    } catch (err) {
      console.error("Submit error:", err);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          상품 이미지
        </label>
        <ImageUpload images={images} onChange={setImages} />
      </div>

      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-gray-700">
          제목
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="상품 제목을 입력해주세요"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          카테고리
        </label>
        <CategorySelect value={category} onChange={setCategory} />
      </div>

      <div>
        <label htmlFor="price" className="mb-1.5 block text-sm font-medium text-gray-700">
          가격
        </label>
        <div className="relative">
          <input
            id="price"
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="가격을 입력해주세요"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            원
          </span>
        </div>
      </div>

      <div>
        <label htmlFor="location" className="mb-1.5 block text-sm font-medium text-gray-700">
          거래 희망 장소
        </label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="거래 희망 장소를 입력해주세요"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-gray-700">
          자세한 설명
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="상품에 대한 자세한 설명을 입력해주세요"
          rows={6}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-primary py-3 text-base font-bold text-white hover:bg-primary-dark disabled:opacity-50"
      >
        {submitting ? "처리중..." : isEdit ? "수정 완료" : "등록하기"}
      </button>
    </form>
  );
}
