'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

const MovieSearch = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const initial = searchParams.get('q') ?? '';

  const [value, setValue] = useState(initial);

  useEffect(() => {
    queueMicrotask(() => {
      setValue(searchParams.get('q') ?? '');
    });
  }, [searchParams]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = value.trim();

    const params = new URLSearchParams(searchParams.toString());

    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }

    params.delete('page');

    router.push(`/discover?${params.toString()}`);
  }

  return (
    <form onSubmit={submit} className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search movies..."
        className="input h-12 pr-28 pl-10"
      />

      <button
        type="submit"
        className="absolute top-1.5 right-1.5 h-9 rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
      >
        Search
      </button>
    </form>
  );
};

export default MovieSearch;
