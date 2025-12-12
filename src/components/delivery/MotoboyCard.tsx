import { Bike, Phone, MoreVertical, Package, Trash2 } from 'lucide-react';
import { Motoboy } from '@/types/delivery';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface MotoboyCardProps {
  motoboy: Motoboy;
  isSelected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  onStatusChange?: (status: Motoboy['status']) => void;
}

const statusConfig = {
  disponivel: { label: 'Disponível', className: 'bg-success/10 text-success border-success/30' },
  em_entrega: { label: 'Em Entrega', className: 'bg-warning/10 text-warning border-warning/30' },
  ausente: { label: 'Ausente', className: 'bg-muted text-muted-foreground border-muted' },
};

export function MotoboyCard({ motoboy, isSelected, onClick, onRemove, onStatusChange }: MotoboyCardProps) {
  const status = statusConfig[motoboy.status];

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
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Bike className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{motoboy.nome}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Phone className="h-3 w-3" /> {motoboy.telefone}
            </p>
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
              Marcar Disponível
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusChange?.('em_entrega'); }}>
              Marcar Em Entrega
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusChange?.('ausente'); }}>
              Marcar Ausente
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Remover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex items-center justify-between">
        <Badge variant="outline" className={status.className}>
          {status.label}
        </Badge>
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Package className="h-4 w-4" /> {motoboy.totalEntregas}
          </span>
          <span className="font-semibold text-primary">
            R$ {motoboy.totalValor.toFixed(2)}
          </span>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">
        Placa: <span className="font-mono">{motoboy.placa}</span>
      </p>
    </div>
  );
}
