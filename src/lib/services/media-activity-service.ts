import {
  getUserMediaActivity as getUserMediaActivityRepository,
  MediaActivityRow,
} from '@/lib/repositories';

type ActivityMedia = MediaActivityRow['media'];
type ActivityReview = NonNullable<MediaActivityRow['review']>;

type BaseMediaActivityItem = {
  id: string;
  createdAt: Date;
  media: ActivityMedia;
};

export type MediaActivityItem =
  | (BaseMediaActivityItem & {
      type: 'watchlist_added';
    })
  | (BaseMediaActivityItem & {
      type: 'watching_started';
    })
  | (BaseMediaActivityItem & {
      type: 'watched';
      watchNumber: number;
    })
  | (BaseMediaActivityItem & {
      type: 'dropped';
    })
  | (BaseMediaActivityItem & {
      type: 'favorite_added';
    })
  | (BaseMediaActivityItem & {
      type: 'favorite_removed';
    })
  | (BaseMediaActivityItem & {
      type: 'rated';
      rating: number;
    })
  | (BaseMediaActivityItem & {
      type: 'reviewed';
      review: ActivityReview;
    })
  | (BaseMediaActivityItem & {
      type: 'shelf_removed';
    });

export async function getUserMediaActivity(
  userId: string
): Promise<MediaActivityItem[]> {
  const rows = await getUserMediaActivityRepository(userId);

  const activities = rows.map(
    ({ activity, media, review, watchNumber }): MediaActivityItem | null => {
      const base = {
        id: activity.id,
        createdAt: activity.createdAt,
        media,
      };

      switch (activity.type) {
        case 'watchlist_added':
          return {
            ...base,
            type: 'watchlist_added',
          };

        case 'watching_started':
          return {
            ...base,
            type: 'watching_started',
          };

        case 'watched': {
          if (watchNumber < 1) {
            return null;
          }

          return {
            ...base,
            type: 'watched',
            watchNumber: watchNumber,
          };
        }

        case 'dropped':
          return {
            ...base,
            type: 'dropped',
          };

        case 'favorite_added':
          return {
            ...base,
            type: 'favorite_added',
          };

        case 'favorite_removed':
          return {
            ...base,
            type: 'favorite_removed',
          };

        case 'rated':
          if (activity.rating === null) {
            return null;
          }

          return {
            ...base,
            type: 'rated',
            rating: activity.rating,
          };

        case 'reviewed':
          if (!review) {
            return null;
          }

          return {
            ...base,
            type: 'reviewed',
            review,
          };

        case 'shelf_removed':
          return {
            ...base,
            type: 'shelf_removed',
          };
      }
    }
  );

  return activities.filter(
    (activity): activity is MediaActivityItem => activity !== null
  );
}
