import { useMemo } from 'react';
import { Clock, MapPin, Receipt, CheckCircle, XCircle, Truck, MoreVertical, AlertTriangle, ExternalLink } from 'lucide-react';
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
import { AssignMotoboyDialog } from './AssignMotoboyDialog';
import { cn } from '@/lib/utils';

interface PedidosTableProps {
  pedidos: Pedido[];
  motoboys: Motoboy[];
  onStatusChange: (id: string, status: Pedido['status']) => void;
  onRemove: (id: string) => void;
  onAssign?: (pedidoId: string, motoboyId: string) => void;
  showWaitTime?: boolean;
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

function calculateWaitTime(horario: string): { minutes: number; label: string; isWarning: boolean; isCritical: boolean } {
  const agora = new Date();
  const [hora, minuto] = horario.split(':').map(Number);
  const horarioPedido = new Date();
  horarioPedido.setHours(hora, minuto, 0, 0);
  
  const minutes = Math.max(0, Math.floor((agora.getTime() - horarioPedido.getTime()) / 60000));
  
  return {
    minutes,
    label: `${minutes} min`,
    isWarning: minutes >= 15 && minutes < 25,
    isCritical: minutes >= 25,
  };
}

export function PedidosTable({ 
  pedidos, 
  motoboys, 
  onStatusChange, 
  onRemove,
  onAssign,
  showWaitTime = true 
}: PedidosTableProps) {
  const getMotoboy = (id: string) => motoboys.find(m => m.id === id);

  const pedidosComTempo = useMemo(() => {
    return pedidos.map(pedido => ({
      ...pedido,
      waitTime: calculateWaitTime(pedido.horario),
    }));
  }, [pedidos]);

  if (pedidos.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center animate-fade-in">
        <Receipt className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-muted-foreground">Nenhum pedido encontrado</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-2 pr-4">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <div className="col-span-2">Nota</div>
          <div className="col-span-3">Endereço</div>
          <div className="col-span-2">Motoboy</div>
          {showWaitTime && <div className="col-span-2">Tempo</div>}
          <div className="col-span-2">Valor</div>
          <div className="col-span-1"></div>
        </div>

        {pedidosComTempo.map((pedido) => {
          const status = statusConfig[pedido.status];
          const StatusIcon = status.icon;
          const motoboy = getMotoboy(pedido.motoboyId);

          return (
            <div
              key={pedido.id}
              className={cn(
                "glass rounded-lg p-4 grid grid-cols-12 gap-2 items-center animate-fade-in transition-all hover:border-primary/30",
                pedido.waitTime.isCritical && pedido.status === 'pendente' && "border-destructive/50 bg-destructive/5"
              )}
            >
              {/* Nota + Status */}
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">#{pedido.numeroNota}</span>
                </div>
                <Badge variant="outline" className={cn("text-xs", status.className)}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {status.label}
                </Badge>
              </div>

              {/* Endereço */}
              <div className="col-span-3">
                <div className="flex items-start gap-1.5">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium line-clamp-1">{pedido.cliente}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{pedido.endereco}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-primary mt-1 -ml-1">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Ver no mapa
                </Button>
              </div>

              {/* Motoboy */}
              <div className="col-span-2">
                {motoboy ? (
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {motoboy.nome.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium">{motoboy.nome}</span>
                  </div>
                ) : onAssign ? (
                  <AssignMotoboyDialog
                    pedido={pedido}
                    motoboys={motoboys}
                    onAssign={onAssign}
                  />
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </div>

              {/* Tempo de espera */}
              {showWaitTime && (
                <div className="col-span-2">
                  <div className={cn(
                    "flex items-center gap-1.5 text-sm",
                    pedido.waitTime.isCritical && "text-destructive font-medium",
                    pedido.waitTime.isWarning && !pedido.waitTime.isCritical && "text-warning font-medium",
                    !pedido.waitTime.isWarning && !pedido.waitTime.isCritical && "text-muted-foreground"
                  )}>
                    {pedido.waitTime.isCritical ? (
                      <AlertTriangle className="h-4 w-4 animate-pulse" />
                    ) : (
                      <Clock className="h-3.5 w-3.5" />
                    )}
                    {pedido.waitTime.label}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    desde {pedido.horario}
                  </p>
                </div>
              )}

              {/* Valor */}
              <div className="col-span-2">
                <p className="font-semibold">R$ {pedido.valor.toFixed(2)}</p>
                <p className="text-xs text-success">+R$ {pedido.taxaEntrega.toFixed(2)} taxa</p>
              </div>

              {/* Ações */}
              <div className="col-span-1 text-right">
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
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
