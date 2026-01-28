"use client";

import { useState, useEffect } from "react";

let kakaoLoadPromise: Promise<void> | null = null;

function loadKakaoSDK(): Promise<void> {
  if (kakaoLoadPromise) return kakaoLoadPromise;

  kakaoLoadPromise = new Promise((resolve, reject) => {
    if (window.kakao?.maps?.LatLng) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY}&libraries=services&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => resolve());
    };
    script.onerror = () => {
      kakaoLoadPromise = null;
      reject(new Error("카카오맵 SDK 로딩에 실패했습니다."));
    };

    document.head.appendChild(script);
  });

  return kakaoLoadPromise;
}

export function useKakaoMap() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadKakaoSDK()
      .then(() => setIsLoaded(true))
      .catch((err) => setError(err));
  }, []);

  return { isLoaded, error };
}
