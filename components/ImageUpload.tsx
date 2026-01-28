"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { MAX_IMAGES } from "@/lib/constants";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      alert(`이미지는 최대 ${MAX_IMAGES}장까지 업로드할 수 있습니다.`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remaining);
    setUploading(true);

    try {
      const supabase = createClient();
      const newPaths: string[] = [];

      for (const file of filesToUpload) {
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error } = await supabase.storage
          .from("product-images")
          .upload(path, file);

        if (error) {
          console.error("Upload error:", error);
          continue;
        }
        newPaths.push(path);
      }

      onChange([...images, ...newPaths]);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {images.map((path, index) => (
          <div key={path} className="relative h-20 w-20">
            <Image
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${path}`}
              alt={`상품 이미지 ${index + 1}`}
              fill
              className="rounded-lg object-cover"
              sizes="80px"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-xs text-white"
            >
              ×
            </button>
            {index === 0 && (
              <span className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-primary/90 py-0.5 text-center text-[10px] text-white">
                대표
              </span>
            )}
          </div>
        ))}

        {images.length < MAX_IMAGES && (
          <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-primary hover:text-primary">
            {uploading ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
            ) : (
              <>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-[10px]">
                  {images.length}/{MAX_IMAGES}
                </span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>
    </div>
  );
}
