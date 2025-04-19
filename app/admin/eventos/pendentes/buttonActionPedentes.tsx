// components/ApproveReviewRejectButtons.tsx
'use client';

import { useState, useTransition } from 'react';
import { approveEvent, rejectEvent, revertEventStatus } from '@/lib/actions/event-actions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export function ApproveReviewRejectButtons({ eventId }: { eventId: string }) {
  const [isPending, startTransition] = useTransition();
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function openConfirm(type: 'approve' | 'reject') {
    setActionType(type);
    setDialogOpen(true);
  }

  async function handleConfirm() {
    if (!actionType) return;
    setDialogOpen(false);

    startTransition(async () => {
      const { success } =
        actionType === 'approve'
          ? await approveEvent(eventId)
          : await rejectEvent(eventId);

      if (success) {
        const message =
          actionType === 'approve'
            ? 'Evento aprovado com sucesso!'
            : 'Evento rejeitado.';
        const variant = actionType === 'approve' ? 'success' : 'error';

        toast(message, {
          duration: 8000,
          // variant,
          action: {
            label: 'Desfazer',
            onClick: async () => {
              const { success: undone } = await revertEventStatus(eventId);
              if (undone) {
                toast('Ação desfeita.', { duration: 3000 });
              }
            },
          },
        });
      } else {
        toast('Erro ao executar ação.', { duration: 3000 });
      }
    });
  }

  return (
    <>
      <div className="flex gap-2">
        <Button
          onClick={() => openConfirm('reject')}
          disabled={isPending}
          variant="destructive"
        >
          Rejeitar
        </Button>

        <Link href={`/admin/eventos/${eventId}/revisar`}>
          <Button variant="outline">Revisar</Button>
        </Link>

        <Button
          onClick={() => openConfirm('approve')}
          disabled={isPending}
          variant="default"
        >
          Aprovar
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve'
                ? 'Confirmar aprovação?'
                : 'Confirmar rejeição?'}
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja{' '}
              {actionType === 'approve' ? 'aprovar' : 'rejeitar'} este evento?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={isPending}>
              {actionType === 'approve' ? 'Aprovar' : 'Rejeitar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
