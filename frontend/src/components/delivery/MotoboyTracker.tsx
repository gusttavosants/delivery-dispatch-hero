import { useState, useEffect } from 'react';
import { 
  MapPin, Navigation, Clock, RefreshCw, Signal, 
  SignalLow, SignalZero, Bike, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MotoboyLocation {
  motoboyId: string;
  motoboyNome: string;
  latitude: number;
  longitude: number;
  ultimaAtualizacao: Date;
  statusGPS: 'online' | 'fraco' | 'offline';
  velocidade: number;
  direcao: string;
  pedidoAtual?: {
    numeroNota: string;
    endereco: string;
    distanciaRestante: number;
    tempoEstimado: number;
  };
}

interface MotoboyTrackerProps {
  motoboys: Array<{ id: string; nome: string; status: string }>;
}

export function MotoboyTracker({ motoboys }: MotoboyTrackerProps) {
  const [locations, setLocations] = useState<MotoboyLocation[]>([]);
  const [selectedMotoboy, setSelectedMotoboy] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simular localizações dos motoboys
  useEffect(() => {
    const gerarLocalizacoes = () => {
      const novasLocalizacoes: MotoboyLocation[] = motoboys
        .filter(m => m.status !== 'ausente')
        .map((motoboy, index) => ({
          motoboyId: motoboy.id,
          motoboyNome: motoboy.nome,
          latitude: -23.5505 + (Math.random() * 0.05 - 0.025),
          longitude: -46.6333 + (Math.random() * 0.05 - 0.025),
          ultimaAtualizacao: new Date(),
          statusGPS: ['online', 'online', 'fraco', 'offline'][Math.floor(Math.random() * 4)] as 'online' | 'fraco' | 'offline',
          velocidade: Math.floor(Math.random() * 40 + 10),
          direcao: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
          pedidoAtual: motoboy.status === 'em_entrega' ? {
            numeroNota: `${1000 + Math.floor(Math.random() * 100)}`,
            endereco: `Rua ${['das Flores', 'São Paulo', 'Augusta', 'Paulista'][index % 4]}, ${Math.floor(Math.random() * 1000)}`,
            distanciaRestante: Math.random() * 5,
            tempoEstimado: Math.floor(Math.random() * 15 + 5),
          } : undefined,
        }));
      
      setLocations(novasLocalizacoes);
      setLastUpdate(new Date());
    };

    gerarLocalizacoes();
    const interval = setInterval(gerarLocalizacoes, 30000); // Atualiza a cada 30s
    return () => clearInterval(interval);
  }, [motoboys]);

  const handleRefresh = () => {
    setLastUpdate(new Date());
    // Simular atualização
    setLocations(prev => prev.map(loc => ({
      ...loc,
      ultimaAtualizacao: new Date(),
      velocidade: Math.floor(Math.random() * 40 + 10),
    })));
  };

  const getSignalIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Signal className="h-4 w-4 text-success" />;
      case 'fraco':
        return <SignalLow className="h-4 w-4 text-warning" />;
      default:
        return <SignalZero className="h-4 w-4 text-destructive" />;
    }
  };

  const selectedLocation = selectedMotoboy 
    ? locations.find(l => l.motoboyId === selectedMotoboy)
    : null;

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Rastreamento em Tempo Real</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}
          </span>
          <Button variant="ghost" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Mapa simulado */}
        <div className="relative bg-secondary/30 rounded-lg overflow-hidden" style={{ height: '300px' }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">
                Mapa de rastreamento
              </p>
              <p className="text-xs text-muted-foreground/70">
                Integração com Google Maps disponível em breve
              </p>
            </div>
          </div>

          {/* Pontos simulados no mapa */}
          {locations.map((loc, index) => (
            <div
              key={loc.motoboyId}
              className={`absolute cursor-pointer transition-all duration-300 ${
                selectedMotoboy === loc.motoboyId ? 'scale-125 z-10' : ''
              }`}
              style={{
                top: `${30 + (index * 20) % 60}%`,
                left: `${20 + (index * 25) % 60}%`,
              }}
              onClick={() => setSelectedMotoboy(
                selectedMotoboy === loc.motoboyId ? null : loc.motoboyId
              )}
            >
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shadow-lg ${
                loc.statusGPS === 'online' ? 'bg-success' :
                loc.statusGPS === 'fraco' ? 'bg-warning' : 'bg-destructive'
              }`}>
                <Bike className="h-4 w-4 text-white" />
              </div>
              {loc.pedidoAtual && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-pulse" />
              )}
            </div>
          ))}
        </div>

        {/* Lista de motoboys */}
        <ScrollArea className="h-[300px]">
          <div className="space-y-2 pr-4">
            {locations.length === 0 ? (
              <div className="text-center py-8">
                <SignalZero className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">Nenhum motoboy em rota</p>
              </div>
            ) : (
              locations.map((loc) => (
                <div
                  key={loc.motoboyId}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedMotoboy === loc.motoboyId
                      ? 'bg-primary/10 border border-primary/30'
                      : 'bg-secondary/30 hover:bg-secondary/50'
                  }`}
                  onClick={() => setSelectedMotoboy(
                    selectedMotoboy === loc.motoboyId ? null : loc.motoboyId
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bike className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <span className="font-medium">{loc.motoboyNome}</span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {getSignalIcon(loc.statusGPS)}
                          <span>{loc.velocidade} km/h</span>
                          <span>→ {loc.direcao}</span>
                        </div>
                      </div>
                    </div>
                    {loc.pedidoAtual && (
                      <Badge className="gap-1">
                        <Target className="h-3 w-3" />
                        #{loc.pedidoAtual.numeroNota}
                      </Badge>
                    )}
                  </div>

                  {loc.pedidoAtual && (
                    <div className="bg-background/50 rounded p-2 text-sm">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{loc.pedidoAtual.endereco}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs">
                          <span>{loc.pedidoAtual.distanciaRestante.toFixed(1)} km</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            ~{loc.pedidoAtual.tempoEstimado} min
                          </span>
                        </div>
                        <Progress 
                          value={100 - (loc.pedidoAtual.distanciaRestante / 5) * 100} 
                          className="w-16 h-1.5" 
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Detalhes do motoboy selecionado */}
      {selectedLocation && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-secondary/30 rounded-lg p-3">
              <Navigation className="h-4 w-4 mx-auto mb-1 text-primary" />
              <p className="text-sm font-medium">{selectedLocation.direcao}</p>
              <p className="text-xs text-muted-foreground">Direção</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3">
              <Signal className="h-4 w-4 mx-auto mb-1 text-primary" />
              <p className="text-sm font-medium">{selectedLocation.velocidade} km/h</p>
              <p className="text-xs text-muted-foreground">Velocidade</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3">
              <Clock className="h-4 w-4 mx-auto mb-1 text-primary" />
              <p className="text-sm font-medium">
                {selectedLocation.ultimaAtualizacao.toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
              <p className="text-xs text-muted-foreground">Última atualização</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3">
              {getSignalIcon(selectedLocation.statusGPS)}
              <p className="text-sm font-medium capitalize">{selectedLocation.statusGPS}</p>
              <p className="text-xs text-muted-foreground">GPS</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
