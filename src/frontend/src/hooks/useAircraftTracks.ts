import { useQuery } from '@tanstack/react-query';
import { useGetApiUrl } from './useQueries';

export interface AircraftData {
  icao24: string;
  callsign: string | null;
  origin_country: string;
  time_position: number | null;
  last_contact: number;
  longitude: number | null;
  latitude: number | null;
  baro_altitude: number | null;
  on_ground: boolean;
  velocity: number | null;
  true_track: number | null;
  vertical_rate: number | null;
  sensors: number[] | null;
  geo_altitude: number | null;
  squawk: string | null;
  spi: boolean;
  position_source: number;
  category: number | null;
}

export interface OpenSkyResponse {
  time: number;
  states: Array<Array<string | number | boolean | null>>;
}

export interface NormalizedAircraft {
  id: string;
  callsign: string;
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  heading: number;
  category: 'General Aviation' | 'Military' | 'Commercial';
  onGround: boolean;
  lastContact: number;
  originCountry: string;
}

function parseOpenSkyData(response: OpenSkyResponse): NormalizedAircraft[] {
  if (!response.states) return [];

  return response.states
    .filter((state) => {
      const lat = state[6] as number | null;
      const lon = state[5] as number | null;
      return lat !== null && lon !== null;
    })
    .map((state) => {
      const icao24 = state[0] as string;
      const callsign = (state[1] as string | null)?.trim() || icao24;
      const originCountry = state[2] as string;
      const latitude = state[6] as number;
      const longitude = state[5] as number;
      const altitude = (state[7] as number | null) || 0;
      const velocity = (state[9] as number | null) || 0;
      const heading = (state[10] as number | null) || 0;
      const onGround = state[8] as boolean;
      const lastContact = state[4] as number;
      const categoryCode = state[17] as number | null;

      // Derive category from OpenSky category codes
      let category: 'General Aviation' | 'Military' | 'Commercial' = 'General Aviation';
      if (categoryCode !== null) {
        if (categoryCode >= 1 && categoryCode <= 4) {
          category = 'Commercial'; // Light, Small, Large, Heavy
        } else if (categoryCode === 5 || categoryCode === 6) {
          category = 'Military'; // Military, Rotorcraft
        } else {
          category = 'General Aviation';
        }
      }

      return {
        id: icao24,
        callsign,
        latitude,
        longitude,
        altitude,
        velocity,
        heading,
        category,
        onGround,
        lastContact,
        originCountry,
      };
    });
}

export function useAircraftTracks() {
  const { data: apiUrl, isLoading: urlLoading } = useGetApiUrl();

  return useQuery<NormalizedAircraft[]>({
    queryKey: ['aircraftTracks'],
    queryFn: async () => {
      if (!apiUrl) return [];

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch aircraft data: ${response.statusText}`);
        }
        const data: OpenSkyResponse = await response.json();
        return parseOpenSkyData(data);
      } catch (error) {
        console.error('Error fetching aircraft data:', error);
        return [];
      }
    },
    enabled: !!apiUrl && !urlLoading,
    refetchInterval: 10000, // Refresh every 10 seconds
    staleTime: 5000,
  });
}
