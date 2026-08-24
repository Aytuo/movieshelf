'use client';

import { RotateCcw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const ResetPageButton = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  function resetPage() {
    const params = new URLSearchParams(searchParams.toString());

    params.delete('page');

    const query = params.toString();

    router.push(query ? `/discover?${query}` : '/discover');
  }

  return (
    <button
      type="button"
      onClick={resetPage}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
    >
      <RotateCcw className="size-3.5" />
      Reset page
    </button>
  );
};

export default ResetPageButton;
