declare namespace kakao.maps {
  class LatLng {
    constructor(lat: number, lng: number);
    getLat(): number;
    getLng(): number;
  }

  class Map {
    constructor(container: HTMLElement, options: MapOptions);
    setCenter(latlng: LatLng): void;
    getCenter(): LatLng;
    setLevel(level: number): void;
  }

  interface MapOptions {
    center: LatLng;
    level?: number;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
    setPosition(position: LatLng): void;
    getPosition(): LatLng;
  }

  interface MarkerOptions {
    position: LatLng;
    map?: Map;
  }

  namespace event {
    function addListener(
      target: Map | Marker,
      type: string,
      handler: (...args: unknown[]) => void
    ): void;
  }

  namespace services {
    enum Status {
      OK = "OK",
      ZERO_RESULT = "ZERO_RESULT",
      ERROR = "ERROR",
    }

    class Geocoder {
      addressSearch(
        addr: string,
        callback: (result: GeocoderResult[], status: Status) => void
      ): void;
      coord2Address(
        lng: number,
        lat: number,
        callback: (result: Coord2AddressResult[], status: Status) => void
      ): void;
    }

    interface GeocoderResult {
      address_name: string;
      x: string;
      y: string;
      address: { address_name: string };
      road_address: { address_name: string } | null;
    }

    interface Coord2AddressResult {
      address: { address_name: string } | null;
      road_address: { address_name: string } | null;
    }
  }

  function load(callback: () => void): void;
}

interface Window {
  kakao: typeof kakao;
}
