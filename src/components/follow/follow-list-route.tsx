import { requireSession } from '@/lib/auth/require-session';
import {
  getFollowListData,
  type FollowListMode,
} from '@/lib/services/follow-service';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FollowListModal } from './follow-list-modal';
import { FollowUserList } from './follow-user-list';

type FollowListRouteProps = {
  username: string;
  mode: FollowListMode;
  variant: 'page' | 'modal';
};

const FollowListRoute = async ({
  username,
  mode,
  variant,
}: FollowListRouteProps) => {
  const session = await requireSession();

  const data = await getFollowListData(username, session.user.id, mode);

  if (!data) {
    notFound();
  }

  const { profile, initialPage } = data;

  const profileLabel = profile.displayName || `@${profile.username}`;

  const title = mode === 'followers' ? 'Followers' : 'Following';

  const description =
    mode === 'followers'
      ? `People following ${profileLabel}`
      : `People followed by ${profileLabel}`;

  const list = (
    <FollowUserList
      profileUserId={profile.userId}
      viewerUserId={session.user.id}
      mode={mode}
      initialPage={initialPage}
    />
  );

  if (variant === 'modal') {
    return (
      <FollowListModal title={title} description={description}>
        {list}
      </FollowListModal>
    );
  }

  return (
    <main className="container-content py-10 lg:py-14">
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/profile/${profile.username}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to profile
        </Link>

        <div className="mt-8 mb-7">
          <p className="eyebrow">Community</p>

          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            {title}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/60 bg-surface">
          {list}
        </div>
      </div>
    </main>
  );
};

export default FollowListRoute;
