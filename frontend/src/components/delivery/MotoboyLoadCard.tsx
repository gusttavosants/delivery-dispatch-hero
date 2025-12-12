import { Bike, Package, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Motoboy, Pedido } from '@/types/delivery';

interface MotoboyLoadCardProps {
  motoboy: Motoboy;
  pedidos: Pedido[];
}

export function MotoboyLoadCard({ motoboy, pedidos }: MotoboyLoadCardProps) {
  const pedidosMotoboy = pedidos.filter(p => p.motoboyId === motoboy.id);
  const pedidosAtivos = pedidosMotoboy.filter(p => p.status === 'pendente' || p.status === 'em_rota');
  const pedidosEntregues = pedidosMotoboy.filter(p => p.status === 'entregue');
  
  const MAX_CARGA = 5; // Máximo de pedidos recomendados por vez
  const cargaAtual = (pedidosAtivos.length / MAX_CARGA) * 100;

  const getStatusColor = () => {
    switch (motoboy.status) {
      case 'disponivel': return 'bg-success';
      case 'em_entrega': return 'bg-warning';
      case 'ausente': return 'bg-muted-foreground';
    }
  };

  const getStatusLabel = () => {
    switch (motoboy.status) {
      case 'disponivel': return 'Disponível';
      case 'em_entrega': return 'Em Entrega';
      case 'ausente': return 'Ausente';
    }
  };

  const getCargaColor = () => {
    if (cargaAtual >= 80) return 'text-destructive';
    if (cargaAtual >= 60) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="bg-secondary/30 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bike className="h-4 w-4 text-primary" />
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${getStatusColor()}`} />
          </div>
          <div>
            <p className="font-medium text-sm">{motoboy.nome}</p>
            <p className="text-xs text-muted-foreground">{motoboy.placa}</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {getStatusLabel()}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Carga atual</span>
          <span className={`font-medium ${getCargaColor()}`}>
            {pedidosAtivos.length}/{MAX_CARGA}
          </span>
        </div>
        <Progress value={cargaAtual} className="h-1.5" />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Package className="h-3 w-3 text-warning" />
            <span className="text-sm font-medium">{pedidosAtivos.length}</span>
          </div>
          <p className="text-xs text-muted-foreground">Ativos</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <TrendingUp className="h-3 w-3 text-success" />
            <span className="text-sm font-medium">{pedidosEntregues.length}</span>
          </div>
          <p className="text-xs text-muted-foreground">Entregues</p>
        </div>
        <div className="text-center">
          <span className="text-sm font-medium text-primary">
            R$ {motoboy.totalValor.toFixed(0)}
          </span>
          <p className="text-xs text-muted-foreground">Taxas</p>
        </div>
      </div>
    </div>
  );
}
