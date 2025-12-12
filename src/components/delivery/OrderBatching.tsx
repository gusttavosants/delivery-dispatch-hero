import { useState, useMemo } from 'react';
import { Layers, MapPin, Users, Check, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pedido, Motoboy } from '@/types/delivery';

interface OrderBatchingProps {
  pedidos: Pedido[];
  motoboys: Motoboy[];
  onAtribuirLote: (pedidoIds: string[], motoboyId: string) => void;
}

interface Lote {
  id: string;
  pedidos: Pedido[];
  regiao: string;
}

export function OrderBatching({ pedidos, motoboys, onAtribuirLote }: OrderBatchingProps) {
  const [selectedLote, setSelectedLote] = useState<string | null>(null);
  const [selectedMotoboy, setSelectedMotoboy] = useState<string | null>(null);

  // Simula agrupamento por região/proximidade
  const lotes = useMemo(() => {
    const pedidosSemMotoboy = pedidos.filter(p => p.status === 'pendente');
    
    if (pedidosSemMotoboy.length < 2) return [];

    // Simula agrupamento por "região" baseado no endereço
    const grupos: Record<string, Pedido[]> = {};
    
    pedidosSemMotoboy.forEach(pedido => {
      // Extrai uma "região" simplificada do endereço (primeiras palavras)
      const palavras = pedido.endereco.split(' ');
      const regiao = palavras.slice(0, 2).join(' ') || 'Centro';
      
      if (!grupos[regiao]) {
        grupos[regiao] = [];
      }
      grupos[regiao].push(pedido);
    });

    // Filtra grupos com mais de 1 pedido
    return Object.entries(grupos)
      .filter(([, pedidos]) => pedidos.length >= 2)
      .map(([regiao, pedidos], index) => ({
        id: `lote-${index}`,
        pedidos,
        regiao,
      }));
  }, [pedidos]);

  const motoboysDisponiveis = motoboys.filter(m => m.status === 'disponivel');

  const handleAtribuir = () => {
    if (!selectedLote || !selectedMotoboy) return;
    
    const lote = lotes.find(l => l.id === selectedLote);
    if (lote) {
      onAtribuirLote(lote.pedidos.map(p => p.id), selectedMotoboy);
      setSelectedLote(null);
      setSelectedMotoboy(null);
    }
  };

  if (lotes.length === 0) {
    return (
      <div className="glass rounded-xl p-6 text-center">
        <Layers className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-muted-foreground text-sm">
          Nenhum lote de pedidos disponível
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Lotes são criados quando há 2+ pedidos próximos
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Agrupamento Inteligente</h3>
        <Badge variant="secondary" className="ml-auto">
          {lotes.length} lotes
        </Badge>
      </div>

      <div className="space-y-3 mb-4">
        {lotes.map(lote => (
          <div
            key={lote.id}
            onClick={() => setSelectedLote(selectedLote === lote.id ? null : lote.id)}
            className={`p-3 rounded-lg border cursor-pointer transition-all
              ${selectedLote === lote.id 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">{lote.regiao}</span>
              </div>
              <Badge variant="outline" className="gap-1">
                <Package className="h-3 w-3" />
                {lote.pedidos.length} pedidos
              </Badge>
            </div>
            <div className="space-y-1">
              {lote.pedidos.map(pedido => (
                <div key={pedido.id} className="text-xs text-muted-foreground flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="truncate">{pedido.cliente} - {pedido.endereco}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedLote && (
        <div className="border-t border-border pt-4 space-y-3">
          <p className="text-sm font-medium">Selecione um motoboy:</p>
          
          {motoboysDisponiveis.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum motoboy disponível</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {motoboysDisponiveis.map(motoboy => (
                <button
                  key={motoboy.id}
                  onClick={() => setSelectedMotoboy(
                    selectedMotoboy === motoboy.id ? null : motoboy.id
                  )}
                  className={`p-2 rounded-lg border text-left transition-all
                    ${selectedMotoboy === motoboy.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'}`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium truncate">{motoboy.nome}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {motoboy.totalEntregas} entregas hoje
                  </p>
                </button>
              ))}
            </div>
          )}

          <Button 
            className="w-full gap-2" 
            disabled={!selectedMotoboy}
            onClick={handleAtribuir}
          >
            <Check className="h-4 w-4" />
            Atribuir Lote
          </Button>
        </div>
      )}
    </div>
  );
}
