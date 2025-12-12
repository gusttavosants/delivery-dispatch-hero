import { useState } from 'react';
import { MapPin, Navigation, Route, Clock, Fuel, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pedido, Motoboy } from '@/types/delivery';

interface RouteOptimizerProps {
  pedidos: Pedido[];
  motoboy: Motoboy | null;
}

interface RotaOtimizada {
  ordem: number;
  pedido: Pedido;
  distanciaEstimada: string;
  tempoEstimado: string;
}

export function RouteOptimizer({ pedidos, motoboy }: RouteOptimizerProps) {
  const [rotaCalculada, setRotaCalculada] = useState<RotaOtimizada[] | null>(null);
  const [isCalculando, setIsCalculando] = useState(false);

  const pedidosPendentes = pedidos.filter(
    p => (p.status === 'pendente' || p.status === 'em_rota') && 
        (!motoboy || p.motoboyId === motoboy.id)
  );

  const calcularRota = () => {
    if (pedidosPendentes.length === 0) return;
    
    setIsCalculando(true);
    
    // Simulação de cálculo de rota otimizada
    // Em produção, isso usaria a API do Google Maps ou similar
    setTimeout(() => {
      const rotaSimulada: RotaOtimizada[] = pedidosPendentes
        .sort(() => Math.random() - 0.5) // Simula ordenação por proximidade
        .map((pedido, index) => ({
          ordem: index + 1,
          pedido,
          distanciaEstimada: `${(Math.random() * 3 + 0.5).toFixed(1)} km`,
          tempoEstimado: `${Math.floor(Math.random() * 10 + 5)} min`,
        }));
      
      setRotaCalculada(rotaSimulada);
      setIsCalculando(false);
    }, 1500);
  };

  const tempoTotal = rotaCalculada?.reduce((acc, r) => {
    return acc + parseInt(r.tempoEstimado);
  }, 0);

  const distanciaTotal = rotaCalculada?.reduce((acc, r) => {
    return acc + parseFloat(r.distanciaEstimada);
  }, 0);

  if (pedidosPendentes.length === 0) {
    return (
      <div className="glass rounded-xl p-6 text-center">
        <Route className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-muted-foreground text-sm">
          Nenhum pedido pendente para otimizar
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Otimização de Rota</h3>
        </div>
        <Button 
          size="sm" 
          onClick={calcularRota} 
          disabled={isCalculando}
          className="gap-2"
        >
          {isCalculando ? (
            <>
              <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Calculando...
            </>
          ) : (
            <>
              <Route className="h-4 w-4" />
              Calcular Rota
            </>
          )}
        </Button>
      </div>

      {!rotaCalculada ? (
        <div className="text-center py-6">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground mb-1">
            {pedidosPendentes.length} pedidos aguardando otimização
          </p>
          <p className="text-xs text-muted-foreground/70">
            Clique em "Calcular Rota" para obter a melhor sequência de entregas
          </p>
        </div>
      ) : (
        <>
          {/* Resumo */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-primary">{rotaCalculada.length}</div>
              <div className="text-xs text-muted-foreground">Paradas</div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-warning">{distanciaTotal?.toFixed(1)} km</div>
              <div className="text-xs text-muted-foreground">Distância</div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-success">{tempoTotal} min</div>
              <div className="text-xs text-muted-foreground">Tempo Est.</div>
            </div>
          </div>

          {/* Lista de paradas */}
          <ScrollArea className="h-[250px]">
            <div className="space-y-2">
              {rotaCalculada.map((item, index) => (
                <div key={item.pedido.id} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold
                      ${index === 0 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>
                      {item.ordem}
                    </div>
                    {index < rotaCalculada.length - 1 && (
                      <div className="w-0.5 h-8 bg-border" />
                    )}
                  </div>
                  <div className="flex-1 bg-secondary/30 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{item.pedido.cliente}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {item.pedido.endereco}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Fuel className="h-3 w-3" />
                          {item.distanciaEstimada}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {item.tempoEstimado}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="mt-4 pt-4 border-t border-border">
            <Button className="w-full gap-2" variant="outline">
              <Navigation className="h-4 w-4" />
              Abrir no Google Maps
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
