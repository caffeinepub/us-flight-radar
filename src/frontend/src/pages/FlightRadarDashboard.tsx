import { useState } from 'react';
import { Settings } from 'lucide-react';
import RadarMap from '../components/radar/RadarMap';
import CategoryFilters from '../components/radar/CategoryFilters';
import MapPresetsControl from '../components/radar/MapPresetsControl';
import AircraftDetailsPanel from '../components/radar/AircraftDetailsPanel';
import DataProviderSettingsDialog from '../components/radar/DataProviderSettingsDialog';
import LoginButton from '../components/LoginButton';
import { useAircraftTracks, type NormalizedAircraft } from '../hooks/useAircraftTracks';
import { Button } from '@/components/ui/button';

export type CategoryFilter = {
  'General Aviation': boolean;
  Military: boolean;
  Commercial: boolean;
};

export type MapPreset = 'us' | 'schenectady-albany';

export default function FlightRadarDashboard() {
  const [selectedAircraft, setSelectedAircraft] = useState<NormalizedAircraft | null>(null);
  const [categoryFilters, setCategoryFilters] = useState<CategoryFilter>({
    'General Aviation': true,
    Military: true,
    Commercial: true,
  });
  const [mapPreset, setMapPreset] = useState<MapPreset>('us');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { data: aircraft = [], isLoading, error } = useAircraftTracks();

  const filteredAircraft = aircraft.filter((ac) => categoryFilters[ac.category]);
  const allFiltersDisabled = !categoryFilters['General Aviation'] && !categoryFilters.Military && !categoryFilters.Commercial;

  return (
    <div className="flex h-screen flex-col bg-radar-dark">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-radar-grid bg-radar-panel px-6 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-radar-primary">US Flight Radar</h1>
          <div className="h-6 w-px bg-radar-grid" />
          <MapPresetsControl preset={mapPreset} onPresetChange={setMapPreset} />
        </div>
        <div className="flex items-center gap-3">
          <CategoryFilters filters={categoryFilters} onFiltersChange={setCategoryFilters} />
          <Button variant="outline" size="icon" onClick={() => setSettingsOpen(true)} className="border-radar-grid">
            <Settings className="h-4 w-4" />
          </Button>
          <LoginButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex-1 overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-radar-dark/80">
            <div className="text-center space-y-2">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-radar-primary border-t-transparent mx-auto" />
              <p className="text-sm text-radar-muted">Loading aircraft data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-radar-dark/80">
            <div className="rounded-lg border border-destructive bg-radar-panel p-6 text-center">
              <p className="text-destructive">Failed to load aircraft data</p>
              <p className="text-sm text-radar-muted mt-2">Check your API configuration</p>
            </div>
          </div>
        )}

        {allFiltersDisabled && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-radar-dark/80">
            <div className="rounded-lg border border-radar-grid bg-radar-panel p-6 text-center">
              <p className="text-radar-foreground">No categories selected</p>
              <p className="text-sm text-radar-muted mt-2">Enable at least one aircraft category to view tracks</p>
            </div>
          </div>
        )}

        <RadarMap
          aircraft={filteredAircraft}
          selectedAircraft={selectedAircraft}
          onSelectAircraft={setSelectedAircraft}
          preset={mapPreset}
        />

        {selectedAircraft && (
          <AircraftDetailsPanel aircraft={selectedAircraft} onClose={() => setSelectedAircraft(null)} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-radar-grid bg-radar-panel px-6 py-3 text-center text-sm text-radar-muted">
        <p>
          © {new Date().getFullYear()} · Built with love using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-radar-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      <DataProviderSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
