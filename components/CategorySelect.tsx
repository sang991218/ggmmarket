"use client";

import { CATEGORIES } from "@/lib/constants";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CategorySelect({ value, onChange }: CategorySelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
    >
      <option value="">카테고리 선택</option>
      {CATEGORIES.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}
