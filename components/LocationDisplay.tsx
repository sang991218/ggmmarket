"use client";

import { useRef, useEffect } from "react";
import { useKakaoMap } from "@/hooks/useKakaoMap";

interface LocationDisplayProps {
  address: string;
  latitude: number;
  longitude: number;
}

export default function LocationDisplay({
  address,
  latitude,
  longitude,
}: LocationDisplayProps) {
  const { isLoaded } = useKakaoMap();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current) return;

    const position = new kakao.maps.LatLng(latitude, longitude);
    const map = new kakao.maps.Map(mapContainerRef.current, {
      center: position,
      level: 4,
    });

    new kakao.maps.Marker({ position, map });
  }, [isLoaded, latitude, longitude]);

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2">
        <svg
          className="h-4 w-4 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="text-sm font-medium text-gray-700">거래 희망 장소</span>
      </div>
      <p className="text-sm text-gray-500">{address}</p>
      <div
        ref={mapContainerRef}
        className="h-[200px] w-full overflow-hidden rounded-lg border border-gray-200"
      >
        {!isLoaded && (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            지도를 불러오는 중...
          </div>
        )}
      </div>
    </div>
  );
}
