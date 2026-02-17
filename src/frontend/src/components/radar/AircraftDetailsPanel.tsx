import { X, Plane, Gauge, Navigation, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { NormalizedAircraft } from '../../hooks/useAircraftTracks';

interface AircraftDetailsPanelProps {
  aircraft: NormalizedAircraft;
  onClose: () => void;
}

export default function AircraftDetailsPanel({ aircraft, onClose }: AircraftDetailsPanelProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Commercial':
        return 'bg-radar-primary text-radar-dark';
      case 'Military':
        return 'bg-destructive text-white';
      case 'General Aviation':
        return 'bg-chart-3 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="absolute right-6 top-6 z-[1000] w-80 border-radar-grid bg-radar-panel shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-bold text-radar-foreground">Aircraft Details</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-radar-muted">Callsign</span>
            <span className="font-mono text-sm font-semibold text-radar-foreground">{aircraft.callsign}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-radar-muted">Category</span>
            <Badge className={getCategoryColor(aircraft.category)}>{aircraft.category}</Badge>
          </div>
        </div>

        <div className="space-y-3 border-t border-radar-grid pt-3">
          <div className="flex items-center gap-3">
            <Gauge className="h-4 w-4 text-radar-muted" />
            <div className="flex-1">
              <div className="text-xs text-radar-muted">Altitude</div>
              <div className="font-mono text-sm text-radar-foreground">{Math.round(aircraft.altitude)} m</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Plane className="h-4 w-4 text-radar-muted" />
            <div className="flex-1">
              <div className="text-xs text-radar-muted">Velocity</div>
              <div className="font-mono text-sm text-radar-foreground">{Math.round(aircraft.velocity)} m/s</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Navigation className="h-4 w-4 text-radar-muted" />
            <div className="flex-1">
              <div className="text-xs text-radar-muted">Heading</div>
              <div className="font-mono text-sm text-radar-foreground">{Math.round(aircraft.heading)}°</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-radar-muted" />
            <div className="flex-1">
              <div className="text-xs text-radar-muted">Position</div>
              <div className="font-mono text-xs text-radar-foreground">
                {aircraft.latitude.toFixed(4)}, {aircraft.longitude.toFixed(4)}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-radar-grid pt-3">
          <div className="text-xs text-radar-muted">Origin Country</div>
          <div className="text-sm text-radar-foreground">{aircraft.originCountry}</div>
        </div>

        {aircraft.onGround && (
          <Badge variant="outline" className="w-full justify-center border-radar-grid">
            On Ground
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
