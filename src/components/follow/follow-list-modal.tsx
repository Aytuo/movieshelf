'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

type FollowListModalProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function FollowListModal({
  title,
  description,
  children,
}: FollowListModalProps) {
  const router = useRouter();

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <DialogContent className="flex max-h-[min(42rem,calc(100vh-2rem))] w-[calc(100%-2rem)] max-w-lg flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-border/60 px-5 py-4 text-left">
          <DialogTitle className="font-heading text-lg">{title}</DialogTitle>

          <DialogDescription className="text-xs leading-5">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 overflow-y-auto p-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
