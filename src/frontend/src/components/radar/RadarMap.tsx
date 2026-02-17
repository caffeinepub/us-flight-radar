import { useEffect, useRef, useState } from 'react';
import type { NormalizedAircraft } from '../../hooks/useAircraftTracks';
import type { MapPreset } from '../../pages/FlightRadarDashboard';

interface RadarMapProps {
  aircraft: NormalizedAircraft[];
  selectedAircraft: NormalizedAircraft | null;
  onSelectAircraft: (aircraft: NormalizedAircraft | null) => void;
  preset: MapPreset;
}

const PRESETS = {
  us: {
    center: { lat: 39.8283, lng: -98.5795 },
    zoom: 5,
  },
  'schenectady-albany': {
    center: { lat: 42.8142, lng: -73.9396 },
    zoom: 10,
  },
};

const TILE_SIZE = 256;

function latLngToTile(lat: number, lng: number, zoom: number) {
  const x = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
  const y = Math.floor(
    ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) *
      Math.pow(2, zoom)
  );
  return { x, y };
}

function latLngToPixel(lat: number, lng: number, zoom: number, centerLat: number, centerLng: number, width: number, height: number) {
  const scale = Math.pow(2, zoom);
  const worldSize = TILE_SIZE * scale;

  const centerX = ((centerLng + 180) / 360) * worldSize;
  const centerY =
    ((1 - Math.log(Math.tan((centerLat * Math.PI) / 180) + 1 / Math.cos((centerLat * Math.PI) / 180)) / Math.PI) / 2) * worldSize;

  const pointX = ((lng + 180) / 360) * worldSize;
  const pointY =
    ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * worldSize;

  return {
    x: width / 2 + (pointX - centerX),
    y: height / 2 + (pointY - centerY),
  };
}

export default function RadarMap({ aircraft, selectedAircraft, onSelectAircraft, preset }: RadarMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState(PRESETS.us.center);
  const [zoom, setZoom] = useState(PRESETS.us.zoom);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update dimensions on mount and resize
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Handle preset changes
  useEffect(() => {
    const presetData = PRESETS[preset];
    setCenter(presetData.center);
    setZoom(presetData.zoom);
  }, [preset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    const scale = Math.pow(2, zoom);
    const worldSize = TILE_SIZE * scale;

    const deltaLng = -(dx / worldSize) * 360;
    const deltaLat = (dy / worldSize) * 180;

    setCenter((prev) => ({
      lat: Math.max(-85, Math.min(85, prev.lat + deltaLat)),
      lng: ((prev.lng + deltaLng + 180) % 360) - 180,
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.5 : 0.5;
    setZoom((prev) => Math.max(3, Math.min(18, prev + delta)));
  };

  const handleAircraftClick = (aircraft: NormalizedAircraft, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectAircraft(aircraft);
  };

  // Calculate visible tiles
  const centerTile = latLngToTile(center.lat, center.lng, Math.floor(zoom));
  const tilesX = Math.ceil(dimensions.width / TILE_SIZE) + 2;
  const tilesY = Math.ceil(dimensions.height / TILE_SIZE) + 2;

  const tiles: Array<{ x: number; y: number; key: string }> = [];
  for (let x = centerTile.x - Math.floor(tilesX / 2); x <= centerTile.x + Math.ceil(tilesX / 2); x++) {
    for (let y = centerTile.y - Math.floor(tilesY / 2); y <= centerTile.y + Math.ceil(tilesY / 2); y++) {
      const maxTile = Math.pow(2, Math.floor(zoom));
      if (y >= 0 && y < maxTile) {
        const wrappedX = ((x % maxTile) + maxTile) % maxTile;
        tiles.push({ x: wrappedX, y, key: `${Math.floor(zoom)}-${wrappedX}-${y}` });
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full cursor-move overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 70%)',
      }}
    >
      {/* Map tiles */}
      <div className="absolute inset-0">
        {tiles.map((tile) => {
          const tilePixel = latLngToPixel(
            Math.atan(Math.sinh(Math.PI * (1 - (2 * tile.y) / Math.pow(2, Math.floor(zoom))))) * (180 / Math.PI),
            (tile.x / Math.pow(2, Math.floor(zoom))) * 360 - 180,
            zoom,
            center.lat,
            center.lng,
            dimensions.width,
            dimensions.height
          );

          return (
            <img
              key={tile.key}
              src={`https://a.basemaps.cartocdn.com/dark_all/${Math.floor(zoom)}/${tile.x}/${tile.y}.png`}
              alt=""
              className="absolute pointer-events-none"
              style={{
                left: tilePixel.x,
                top: tilePixel.y,
                width: TILE_SIZE,
                height: TILE_SIZE,
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          );
        })}
      </div>

      {/* Aircraft markers */}
      {aircraft.map((ac) => {
        const pixel = latLngToPixel(ac.latitude, ac.longitude, zoom, center.lat, center.lng, dimensions.width, dimensions.height);
        const isSelected = selectedAircraft?.id === ac.id;
        const color = getCategoryColor(ac.category);

        return (
          <div
            key={ac.id}
            className="absolute cursor-pointer transition-transform hover:scale-110"
            style={{
              left: pixel.x - 12,
              top: pixel.y - 12,
              transform: `rotate(${ac.heading}deg)`,
            }}
            onClick={(e) => handleAircraftClick(ac, e)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10Z"
                fill={color}
                stroke={isSelected ? '#10b981' : '#1a1a1a'}
                strokeWidth={isSelected ? '2' : '1'}
              />
            </svg>
            {isSelected && (
              <div
                className="absolute inset-[-4px] rounded-full border-2 border-[#10b981] animate-pulse"
                style={{ pointerEvents: 'none' }}
              />
            )}
          </div>
        );
      })}

      {/* Radar overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/assets/generated/radar-bg.dim_1920x1080.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'screen',
        }}
      />

      {/* Zoom controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2">
        <button
          onClick={() => setZoom((z) => Math.min(18, z + 1))}
          className="flex h-10 w-10 items-center justify-center rounded border border-radar-grid bg-radar-panel text-radar-foreground hover:bg-radar-primary"
        >
          +
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(3, z - 1))}
          className="flex h-10 w-10 items-center justify-center rounded border border-radar-grid bg-radar-panel text-radar-foreground hover:bg-radar-primary"
        >
          −
        </button>
      </div>
    </div>
  );
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'Commercial':
      return '#10b981'; // emerald
    case 'Military':
      return '#ef4444'; // red
    case 'General Aviation':
      return '#3b82f6'; // blue
    default:
      return '#6b7280'; // gray
  }
}
