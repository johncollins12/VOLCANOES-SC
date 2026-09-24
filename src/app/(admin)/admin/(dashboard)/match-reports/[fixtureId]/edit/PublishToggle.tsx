'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/feedback/Toast';
import { setMatchReportPublishedAction } from '@/actions/match-reports.actions';

export function PublishToggle({ fixtureId, isPublished }: { fixtureId: string; isPublished: boolean }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function toggle() {
    startTransition(async () => {
      const result = await setMatchReportPublishedAction(fixtureId, !isPublished);
      if (result.success) {
        toast({ title: isPublished ? 'Unpublished' : 'Published', variant: 'success' });
      } else {
        toast({ title: 'Action failed', description: result.error, variant: 'error' });
      }
    });
  }

  return (
    <Button variant={isPublished ? 'outline' : 'primary'} isLoading={isPending} onClick={toggle}>
      {isPublished ? 'Unpublish' : 'Publish'}
    </Button>
  );
}
