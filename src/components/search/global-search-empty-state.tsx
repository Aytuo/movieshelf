import EmptyState from '@/components/ui/empty-state';
import { Search } from 'lucide-react';

const GlobalSearchEmptyState = () => {
  return (
    <div className="px-6 py-14">
      <EmptyState
        icon={Search}
        title="Find something to watch"
        description="Start typing a movie, TV series or person name and MovieShelf will show matching results instantly."
        compact
      />
    </div>
  );
};

export default GlobalSearchEmptyState;
