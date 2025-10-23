"use client";

import { useEffect, useState } from "react";
import Map, { NavigationControl } from "react-map-gl/maplibre";

type MapLibreGl = typeof import("maplibre-gl");

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const INITIAL_VIEW_STATE = {
  longitude: -30,
  latitude: 28,
  zoom: 1.6,
};

export function MapPreview() {
  const [mapLib, setMapLib] = useState<MapLibreGl | null>(null);

  useEffect(() => {
    let isMounted = true;

    import("maplibre-gl").then((module) => {
      if (!isMounted) return;
      setMapLib((module.default ?? module) as MapLibreGl);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] shadow-sm">
      {mapLib ? (
        <Map
          mapLib={mapLib}
          initialViewState={INITIAL_VIEW_STATE}
          mapStyle={MAP_STYLE}
          style={{ height: "100%", width: "100%" }}
          attributionControl={false}
          scrollZoom={false}
          dragRotate={false}
          doubleClickZoom={false}
          cursor="pointer"
        >
          <NavigationControl position="top-left" showCompass={false} visualizePitch={false} />
        </Map>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-[rgb(var(--color-muted))]">
          Loading geospatial canvas...
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgb(var(--color-background)_/_0.9)] to-transparent p-4 text-xs font-medium text-[rgb(var(--color-muted))]">
        Global infrastructure telemetry powered by Worldforge AI
      </div>
    </div>
  );
}
