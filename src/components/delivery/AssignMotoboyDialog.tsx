import { useState } from 'react';
import { UserPlus, Bike, Package, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Motoboy, Pedido } from '@/types/delivery';
import { cn } from '@/lib/utils';

interface AssignMotoboyDialogProps {
  pedido: Pedido;
  motoboys: Motoboy[];
  onAssign: (pedidoId: string, motoboyId: string) => void;
  trigger?: React.ReactNode;
}

export function AssignMotoboyDialog({ pedido, motoboys, onAssign, trigger }: AssignMotoboyDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedMotoboy, setSelectedMotoboy] = useState<string | null>(null);

  const motoboysDisponiveis = motoboys.filter(m => m.status !== 'ausente');

  const handleAssign = () => {
    if (selectedMotoboy) {
      onAssign(pedido.id, selectedMotoboy);
      setOpen(false);
      setSelectedMotoboy(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline" className="gap-1.5">
            <UserPlus className="h-3.5 w-3.5" />
            Atribuir
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Atribuir Motoboy</DialogTitle>
          <DialogDescription>
            Nota #{pedido.numeroNota} • {pedido.cliente}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 my-4">
          {motoboysDisponiveis.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Nenhum motoboy disponível
            </div>
          ) : (
            motoboysDisponiveis.map((motoboy) => (
              <button
                key={motoboy.id}
                onClick={() => setSelectedMotoboy(motoboy.id)}
                className={cn(
                  "w-full p-3 rounded-lg border text-left transition-all flex items-center justify-between",
                  selectedMotoboy === motoboy.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bike className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{motoboy.nome}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className={cn(
                        "h-2 w-2 rounded-full",
                        motoboy.status === 'disponivel' ? 'bg-success' : 'bg-warning'
                      )} />
                      {motoboy.status === 'disponivel' ? 'Livre' : 'Em Rota'}
                      <span>•</span>
                      <Package className="h-3 w-3" />
                      {motoboy.totalEntregas} entregas
                    </div>
                  </div>
                </div>
                {selectedMotoboy === motoboy.id && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </button>
            ))
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAssign} disabled={!selectedMotoboy} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Atribuir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
