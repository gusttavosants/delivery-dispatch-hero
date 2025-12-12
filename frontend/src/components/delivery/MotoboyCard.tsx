import { Bike, Phone, MoreVertical, Package, Trash2, Power, Clock, MapPin } from 'lucide-react';
import { Motoboy, Pedido } from '@/types/delivery';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface MotoboyCardProps {
  motoboy: Motoboy;
  pedidosAtivos?: number;
  isSelected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  onStatusChange?: (status: Motoboy['status']) => void;
}

const statusConfig = {
  disponivel: { 
    label: 'Livre', 
    className: 'bg-success/10 text-success border-success/30',
    dotColor: 'bg-success'
  },
  em_entrega: { 
    label: 'Em Rota', 
    className: 'bg-warning/10 text-warning border-warning/30',
    dotColor: 'bg-warning'
  },
  ausente: { 
    label: 'Ausente', 
    className: 'bg-muted text-muted-foreground border-muted',
    dotColor: 'bg-muted-foreground'
  },
};

const MAX_CARGA = 5;

export function MotoboyCard({ 
  motoboy, 
  pedidosAtivos = 0, 
  isSelected, 
  onClick, 
  onRemove, 
  onStatusChange 
}: MotoboyCardProps) {
  const status = statusConfig[motoboy.status];
  const cargaPercent = (pedidosAtivos / MAX_CARGA) * 100;

  const getCargaColor = () => {
    if (cargaPercent >= 80) return 'text-destructive';
    if (cargaPercent >= 60) return 'text-warning';
    return 'text-success';
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "glass rounded-xl p-4 cursor-pointer transition-all animate-fade-in hover:border-primary/50",
        isSelected && "border-primary glow-primary"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bike className="h-5 w-5 text-primary" />
            </div>
            <div className={cn(
              "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card",
              status.dotColor
            )} />
          </div>
          <div>
            <h3 className="font-semibold">{motoboy.nome}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn("text-xs", status.className)}>
                {status.label}
                {motoboy.status === 'em_entrega' && pedidosAtivos > 0 && (
                  <span className="ml-1">({pedidosAtivos})</span>
                )}
              </Badge>
            </div>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusChange?.('disponivel'); }}>
              <span className="h-2 w-2 rounded-full bg-success mr-2" />
              Marcar Livre
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusChange?.('em_entrega'); }}>
              <span className="h-2 w-2 rounded-full bg-warning mr-2" />
              Marcar Em Rota
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusChange?.('ausente'); }}>
              <span className="h-2 w-2 rounded-full bg-muted-foreground mr-2" />
              Marcar Ausente
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
              className="text-destructive focus:text-destructive"
            >
              <Power className="h-4 w-4 mr-2" /> Desativar do Dia
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Carga atual */}
      {motoboy.status !== 'ausente' && (
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Carga atual</span>
            <span className={cn("font-medium", getCargaColor())}>
              {pedidosAtivos}/{MAX_CARGA}
            </span>
          </div>
          <Progress value={cargaPercent} className="h-1.5" />
        </div>
      )}
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="flex items-center gap-1">
            <Package className="h-3.5 w-3.5" /> {motoboy.totalEntregas}
          </span>
          <span className="flex items-center gap-1 text-xs">
            <Phone className="h-3 w-3" /> {motoboy.telefone}
          </span>
        </div>
        <span className="font-semibold text-primary text-sm">
          R$ {motoboy.totalValor.toFixed(2)}
        </span>
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">
        Placa: <span className="font-mono">{motoboy.placa}</span>
      </p>
    </div>
  );
}
