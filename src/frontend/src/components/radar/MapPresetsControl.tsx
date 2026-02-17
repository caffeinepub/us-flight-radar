import { MapPin, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MapPreset } from '../../pages/FlightRadarDashboard';

interface MapPresetsControlProps {
  preset: MapPreset;
  onPresetChange: (preset: MapPreset) => void;
}

export default function MapPresetsControl({ preset, onPresetChange }: MapPresetsControlProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={preset === 'us' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onPresetChange('us')}
        className={preset === 'us' ? 'bg-radar-primary hover:bg-radar-primary/80' : ''}
      >
        <Map className="mr-2 h-4 w-4" />
        Continental US
      </Button>
      <Button
        variant={preset === 'schenectady-albany' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onPresetChange('schenectady-albany')}
        className={preset === 'schenectady-albany' ? 'bg-radar-primary hover:bg-radar-primary/80' : ''}
      >
        <MapPin className="mr-2 h-4 w-4" />
        Schenectady-Albany
      </Button>
    </div>
  );
}
