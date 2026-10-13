'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button } from '../ui/button';
import DiscoverFilters from './discover-filters';

type DiscoverLayoutProps = {
  children: ReactNode;
};

const DiscoverLayout = ({ children }: DiscoverLayoutProps) => {
  const [filtersVisible, setFiltersVisible] = useState(true);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="lg"
          aria-expanded={filtersVisible}
          aria-controls="discover-filters-panel"
          onClick={() => setFiltersVisible((visible) => !visible)}
          className="border-border bg-surface hover:bg-surface-hover"
        >
          <SlidersHorizontal aria-hidden="true" />
          {filtersVisible ? 'Hide filters' : 'Show filters'}
        </Button>
      </div>

      <div
        className={`grid items-start gap-8 ${
          filtersVisible
            ? 'grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)]'
            : 'grid-cols-1'
        }`}
      >
        <div
          id="discover-filters-panel"
          className={filtersVisible ? 'self-start' : 'hidden'}
        >
          <DiscoverFilters />
        </div>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
};

export default DiscoverLayout;
