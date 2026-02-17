import { Plane, Shield, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CategoryFilter } from '../../pages/FlightRadarDashboard';

interface CategoryFiltersProps {
  filters: CategoryFilter;
  onFiltersChange: (filters: CategoryFilter) => void;
}

export default function CategoryFilters({ filters, onFiltersChange }: CategoryFiltersProps) {
  const toggleFilter = (category: keyof CategoryFilter) => {
    onFiltersChange({
      ...filters,
      [category]: !filters[category],
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={filters.Commercial ? 'default' : 'outline'}
        size="sm"
        onClick={() => toggleFilter('Commercial')}
        className={filters.Commercial ? 'bg-radar-primary hover:bg-radar-primary/80' : 'border-radar-grid'}
      >
        <Building2 className="mr-2 h-4 w-4" />
        Commercial
      </Button>
      <Button
        variant={filters.Military ? 'default' : 'outline'}
        size="sm"
        onClick={() => toggleFilter('Military')}
        className={filters.Military ? 'bg-destructive hover:bg-destructive/80' : 'border-radar-grid'}
      >
        <Shield className="mr-2 h-4 w-4" />
        Military
      </Button>
      <Button
        variant={filters['General Aviation'] ? 'default' : 'outline'}
        size="sm"
        onClick={() => toggleFilter('General Aviation')}
        className={filters['General Aviation'] ? 'bg-chart-3 hover:bg-chart-3/80' : 'border-radar-grid'}
      >
        <Plane className="mr-2 h-4 w-4" />
        General Aviation
      </Button>
    </div>
  );
}
