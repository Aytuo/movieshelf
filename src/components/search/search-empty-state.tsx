import { Search } from 'lucide-react';

const SearchEmptyState = () => {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-surface">
        <Search className="size-5 text-muted-foreground" />
      </div>

      <p className="mt-4 text-sm font-medium">Find a movie</p>

      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
        Start typing a title and MovieShelf will show matching movies instantly.
      </p>
    </div>
  );
};

export default SearchEmptyState;
