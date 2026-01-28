"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useKakaoMap } from "@/hooks/useKakaoMap";

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

interface LocationPickerProps {
  initialAddress?: string;
  initialLat?: number;
  initialLng?: number;
  onLocationChange: (location: {
    address: string;
    latitude: number;
    longitude: number;
  }) => void;
}

export default function LocationPicker({
  initialAddress,
  initialLat,
  initialLng,
  onLocationChange,
}: LocationPickerProps) {
  const { isLoaded, error } = useKakaoMap();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const markerRef = useRef<kakao.maps.Marker | null>(null);
  const geocoderRef = useRef<kakao.maps.services.Geocoder | null>(null);
  const onLocationChangeRef = useRef(onLocationChange);

  const [searchQuery, setSearchQuery] = useState("");
  const [address, setAddress] = useState(initialAddress ?? "");

  onLocationChangeRef.current = onLocationChange;

  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current) return;

    const center = new kakao.maps.LatLng(
      initialLat ?? DEFAULT_CENTER.lat,
      initialLng ?? DEFAULT_CENTER.lng
    );

    const map = new kakao.maps.Map(mapContainerRef.current, {
      center,
      level: 3,
    });

    const marker = new kakao.maps.Marker({ position: center });
    const geocoder = new kakao.maps.services.Geocoder();

    if (initialLat && initialLng) {
      marker.setMap(map);
    }

    mapRef.current = map;
    markerRef.current = marker;
    geocoderRef.current = geocoder;

    kakao.maps.event.addListener(map, "click", (mouseEvent: { latLng: kakao.maps.LatLng }) => {
      const latlng = mouseEvent.latLng;
      marker.setPosition(latlng);
      marker.setMap(map);

      geocoder.coord2Address(
        latlng.getLng(),
        latlng.getLat(),
        (result, status) => {
          if (status === kakao.maps.services.Status.OK && result[0]) {
            const addr =
              result[0].road_address?.address_name ??
              result[0].address?.address_name ??
              "";
            setAddress(addr);
            onLocationChangeRef.current({
              address: addr,
              latitude: latlng.getLat(),
              longitude: latlng.getLng(),
            });
          }
        }
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim() || !geocoderRef.current || !mapRef.current) return;

    geocoderRef.current.addressSearch(searchQuery.trim(), (result, status) => {
      if (status === kakao.maps.services.Status.OK && result[0]) {
        const lat = parseFloat(result[0].y);
        const lng = parseFloat(result[0].x);
        const position = new kakao.maps.LatLng(lat, lng);

        mapRef.current!.setCenter(position);
        markerRef.current!.setPosition(position);
        markerRef.current!.setMap(mapRef.current!);

        const addr =
          result[0].road_address?.address_name ??
          result[0].address?.address_name ??
          result[0].address_name;

        setAddress(addr);
        onLocationChangeRef.current({
          address: addr,
          latitude: lat,
          longitude: lng,
        });
      } else {
        alert("검색 결과가 없습니다.");
      }
    });
  }, [searchQuery]);

  if (error) {
    return (
      <input
        type="text"
        value={address}
        onChange={(e) => {
          setAddress(e.target.value);
          onLocationChangeRef.current({
            address: e.target.value,
            latitude: 0,
            longitude: 0,
          });
        }}
        placeholder="거래 희망 장소를 입력해주세요"
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
      />
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
          placeholder="주소를 검색해보세요"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="shrink-0 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
        >
          검색
        </button>
      </div>

      <div
        ref={mapContainerRef}
        className="h-[300px] w-full rounded-lg border border-gray-200"
      >
        {!isLoaded && (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            지도를 불러오는 중...
          </div>
        )}
      </div>

      {address && (
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
          <svg
            className="h-4 w-4 shrink-0 text-primary"
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
          <span className="text-sm text-gray-700">{address}</span>
        </div>
      )}
    </div>
  );
}
