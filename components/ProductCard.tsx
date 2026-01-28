import Link from "next/link";
import Image from "next/image";
import { formatPrice, formatRelativeTime, getImageUrl } from "@/lib/utils";

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  location?: string | null;
  created_at: string;
  images: string[];
  status: string;
}

export default function ProductCard({
  id,
  title,
  price,
  location,
  created_at,
  images,
  status,
}: ProductCardProps) {
  const thumbnail = images.length > 0 ? getImageUrl(images[0]) : null;

  return (
    <Link href={`/products/${id}`} className="flex gap-4 border-b border-gray-100 px-4 py-3">
      <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-gray-200">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
            sizes="112px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {status !== "판매중" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-800">
              {status}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          <h3 className="line-clamp-2 text-base text-gray-900">{title}</h3>
          <p className="mt-0.5 text-xs text-gray-500">
            {location && `${location} · `}
            {formatRelativeTime(created_at)}
          </p>
        </div>
        <p className="text-base font-bold text-gray-900">{formatPrice(price)}</p>
      </div>
    </Link>
  );
}
