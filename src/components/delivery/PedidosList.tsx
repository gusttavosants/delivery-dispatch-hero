import { Clock, MapPin, Receipt, CheckCircle, XCircle, Truck, MoreVertical } from 'lucide-react';
import { Pedido, Motoboy } from '@/types/delivery';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface PedidosListProps {
  pedidos: Pedido[];
  motoboys: Motoboy[];
  onStatusChange: (id: string, status: Pedido['status']) => void;
  onRemove: (id: string) => void;
}

const statusConfig = {
  pendente: { 
    label: 'Pendente', 
    className: 'bg-warning/10 text-warning border-warning/30',
    icon: Clock,
  },
  em_rota: { 
    label: 'Em Rota', 
    className: 'bg-primary/10 text-primary border-primary/30',
    icon: Truck,
  },
  entregue: { 
    label: 'Entregue', 
    className: 'bg-success/10 text-success border-success/30',
    icon: CheckCircle,
  },
  cancelado: { 
    label: 'Cancelado', 
    className: 'bg-destructive/10 text-destructive border-destructive/30',
    icon: XCircle,
  },
};

export function PedidosList({ pedidos, motoboys, onStatusChange, onRemove }: PedidosListProps) {
  const getMotoboy = (id: string) => motoboys.find(m => m.id === id);

  if (pedidos.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center animate-fade-in">
        <Receipt className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-muted-foreground">Nenhum pedido cadastrado</p>
        <p className="text-sm text-muted-foreground/70">
          Adicione motoboys e pedidos para começar
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-3 pr-4">
        {pedidos.map((pedido, index) => {
          const status = statusConfig[pedido.status];
          const StatusIcon = status.icon;
          const motoboy = getMotoboy(pedido.motoboyId);

          return (
            <div
              key={pedido.id}
              className={cn(
                "glass rounded-xl p-4 animate-fade-in transition-all hover:border-primary/30",
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Receipt className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">#{pedido.numeroNota}</span>
                      <Badge variant="outline" className={status.className}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{pedido.cliente}</p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onStatusChange(pedido.id, 'pendente')}>
                      <Clock className="h-4 w-4 mr-2" /> Pendente
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(pedido.id, 'em_rota')}>
                      <Truck className="h-4 w-4 mr-2" /> Em Rota
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(pedido.id, 'entregue')}>
                      <CheckCircle className="h-4 w-4 mr-2" /> Entregue
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(pedido.id, 'cancelado')}>
                      <XCircle className="h-4 w-4 mr-2" /> Cancelar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onRemove(pedido.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      Remover
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span className="line-clamp-2">{pedido.endereco}</span>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground text-xs">Valor do Pedido</p>
                  <p className="font-semibold">R$ {pedido.valor.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {pedido.horario}
                  {motoboy && (
                    <>
                      <span>•</span>
                      <span className="text-primary font-medium">{motoboy.nome}</span>
                    </>
                  )}
                </div>
                <span className="text-xs font-medium text-success">
                  +R$ {pedido.taxaEntrega.toFixed(2)} taxa
                </span>
              </div>

              {pedido.observacao && (
                <p className="text-xs text-muted-foreground mt-2 italic">
                  📝 {pedido.observacao}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
