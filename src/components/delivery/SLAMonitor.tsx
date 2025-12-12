import { useMemo } from 'react';
import { Clock, AlertTriangle, CheckCircle, Timer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pedido, Motoboy } from '@/types/delivery';

interface SLAMonitorProps {
  pedidos: Pedido[];
  motoboys: Motoboy[];
}

interface PedidoComSLA extends Pedido {
  tempoEspera: number;
  slaStatus: 'ok' | 'warning' | 'critical';
  motoboyNome?: string;
}

export function SLAMonitor({ pedidos, motoboys }: SLAMonitorProps) {
  const SLA_WARNING = 15; // minutos
  const SLA_CRITICAL = 30; // minutos

  const pedidosComSLA = useMemo((): PedidoComSLA[] => {
    const agora = new Date();
    
    return pedidos
      .filter(p => p.status === 'pendente' || p.status === 'em_rota')
      .map(pedido => {
        // Calcula tempo de espera baseado no horário do pedido
        const [hora, minuto] = pedido.horario.split(':').map(Number);
        const horarioPedido = new Date();
        horarioPedido.setHours(hora, minuto, 0, 0);
        
        const tempoEspera = Math.floor((agora.getTime() - horarioPedido.getTime()) / 60000);
        
        let slaStatus: 'ok' | 'warning' | 'critical' = 'ok';
        if (tempoEspera >= SLA_CRITICAL) {
          slaStatus = 'critical';
        } else if (tempoEspera >= SLA_WARNING) {
          slaStatus = 'warning';
        }

        const motoboy = motoboys.find(m => m.id === pedido.motoboyId);

        return {
          ...pedido,
          tempoEspera: Math.max(0, tempoEspera),
          slaStatus,
          motoboyNome: motoboy?.nome,
        };
      })
      .sort((a, b) => b.tempoEspera - a.tempoEspera);
  }, [pedidos, motoboys]);

  const stats = useMemo(() => {
    const ok = pedidosComSLA.filter(p => p.slaStatus === 'ok').length;
    const warning = pedidosComSLA.filter(p => p.slaStatus === 'warning').length;
    const critical = pedidosComSLA.filter(p => p.slaStatus === 'critical').length;
    
    return { ok, warning, critical, total: pedidosComSLA.length };
  }, [pedidosComSLA]);

  const getSLAColor = (status: 'ok' | 'warning' | 'critical') => {
    switch (status) {
      case 'ok': return 'text-success';
      case 'warning': return 'text-warning';
      case 'critical': return 'text-destructive';
    }
  };

  const getSLABgColor = (status: 'ok' | 'warning' | 'critical') => {
    switch (status) {
      case 'ok': return 'bg-success/10';
      case 'warning': return 'bg-warning/10';
      case 'critical': return 'bg-destructive/10';
    }
  };

  if (pedidosComSLA.length === 0) {
    return (
      <div className="glass rounded-xl p-6 text-center">
        <CheckCircle className="h-10 w-10 mx-auto text-success/50 mb-3" />
        <p className="text-muted-foreground text-sm">
          Nenhum pedido em espera
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Todos os pedidos foram entregues
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Monitor de SLA</h3>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-success/10 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-success">{stats.ok}</div>
          <div className="text-xs text-muted-foreground">No prazo</div>
        </div>
        <div className="bg-warning/10 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-warning">{stats.warning}</div>
          <div className="text-xs text-muted-foreground">Atenção</div>
        </div>
        <div className="bg-destructive/10 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-destructive">{stats.critical}</div>
          <div className="text-xs text-muted-foreground">Crítico</div>
        </div>
      </div>

      {/* Pedidos List */}
      <ScrollArea className="h-[280px]">
        <div className="space-y-2">
          {pedidosComSLA.map(pedido => (
            <div
              key={pedido.id}
              className={`p-3 rounded-lg border ${getSLABgColor(pedido.slaStatus)} border-border`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {pedido.slaStatus === 'critical' && (
                    <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />
                  )}
                  <span className="font-medium text-sm">{pedido.cliente}</span>
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${getSLAColor(pedido.slaStatus)}`}>
                  <Timer className="h-4 w-4" />
                  {pedido.tempoEspera} min
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Nota: {pedido.numeroNota}</span>
                <Badge variant="outline" className="text-xs">
                  {pedido.status === 'em_rota' ? 'Em rota' : 'Pendente'}
                </Badge>
              </div>

              <Progress 
                value={Math.min((pedido.tempoEspera / SLA_CRITICAL) * 100, 100)} 
                className="h-1.5"
              />

              {pedido.motoboyNome && (
                <p className="text-xs text-muted-foreground mt-2">
                  Motoboy: {pedido.motoboyNome}
                </p>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
