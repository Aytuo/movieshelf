'use client';

import { useState } from 'react';

type PersonBiographyProps = {
  biography: string;
};

const PersonBiography = ({ biography }: PersonBiographyProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <p
        className={
          expanded
            ? 'text-sm leading-7 whitespace-pre-line text-muted-foreground sm:text-base'
            : 'line-clamp-6 text-sm leading-7 whitespace-pre-line text-muted-foreground sm:text-base'
        }
      >
        {biography}
      </p>

      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="mt-3 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
      >
        {expanded ? 'Read less' : 'Read more'}
      </button>
    </div>
  );
};

export default PersonBiography;
