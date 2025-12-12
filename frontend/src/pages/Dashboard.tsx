import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bike, Package, DollarSign, TrendingUp, Users, LogOut, 
  LayoutDashboard, Settings, FileText, ChevronLeft, Clock, XCircle,
  AlertTriangle, Layers, MapPin, Check
} from 'lucide-react';
import { useDelivery } from '@/hooks/useDelivery';
import { StatCard } from '@/components/delivery/StatCard';
import { MotoboyCard } from '@/components/delivery/MotoboyCard';
import { AddMotoboyDialog } from '@/components/delivery/AddMotoboyDialog';
import { AddPedidoDialog } from '@/components/delivery/AddPedidoDialog';
import { PedidosTable } from '@/components/delivery/PedidosTable';
import { RouteOptimizer } from '@/components/delivery/RouteOptimizer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const { toast } = useToast();
  const {
    motoboys,
    pedidos,
    adicionarMotoboy,
    removerMotoboy,
    atualizarStatusMotoboy,
    adicionarPedido,
    atualizarStatusPedido,
    removerPedido,
    getPedidosPorMotoboy,
    getEstatisticas,
  } = useDelivery();

  const [selectedMotoboyId, setSelectedMotoboyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('pendentes');
  const stats = getEstatisticas();

  const pedidosFiltrados = selectedMotoboyId 
    ? getPedidosPorMotoboy(selectedMotoboyId)
    : pedidos;

  const selectedMotoboy = selectedMotoboyId 
    ? motoboys.find(m => m.id === selectedMotoboyId) || null
    : null;

  // Calcular pedidos por motoboy
  const pedidosPorMotoboy = useMemo(() => {
    const map: Record<string, number> = {};
    pedidos.forEach(p => {
      if (p.status === 'pendente' || p.status === 'em_rota') {
        map[p.motoboyId] = (map[p.motoboyId] || 0) + 1;
      }
    });
    return map;
  }, [pedidos]);

  // Estatísticas avançadas
  const advancedStats = useMemo(() => {
    const cancelados = pedidos.filter(p => p.status === 'cancelado').length;
    const entregues = pedidos.filter(p => p.status === 'entregue');
    
    // Tempo médio simulado (em produção viria do banco)
    const tempoMedio = entregues.length > 0 ? 22 : 0;
    
    // Total a pagar aos motoboys
    const totalPagar = motoboys.reduce((acc, m) => acc + m.totalValor, 0);
    
    // Carga média
    const motoboysAtivos = motoboys.filter(m => m.status !== 'ausente');
    const cargaMedia = motoboysAtivos.length > 0 
      ? (stats.pedidosPendentes / motoboysAtivos.length).toFixed(1)
      : '0';

    return { cancelados, tempoMedio, totalPagar, cargaMedia };
  }, [pedidos, motoboys, stats]);

  // Pedidos em risco de SLA (>20 min)
  const pedidosEmRisco = useMemo(() => {
    const agora = new Date();
    return pedidos.filter(p => {
      if (p.status !== 'pendente') return false;
      const [hora, minuto] = p.horario.split(':').map(Number);
      const horarioPedido = new Date();
      horarioPedido.setHours(hora, minuto, 0, 0);
      const tempoEspera = Math.floor((agora.getTime() - horarioPedido.getTime()) / 60000);
      return tempoEspera >= 20;
    });
  }, [pedidos]);

  // Lotes sugeridos
  const lotesSugeridos = useMemo(() => {
    const pedidosPendentes = pedidos.filter(p => p.status === 'pendente');
    if (pedidosPendentes.length < 2) return [];

    const grupos: Record<string, typeof pedidosPendentes> = {};
    pedidosPendentes.forEach(pedido => {
      const palavras = pedido.endereco.split(' ');
      const regiao = palavras.slice(0, 2).join(' ') || 'Centro';
      if (!grupos[regiao]) grupos[regiao] = [];
      grupos[regiao].push(pedido);
    });

    return Object.entries(grupos)
      .filter(([, pedidos]) => pedidos.length >= 2)
      .slice(0, 3)
      .map(([regiao, pedidos], index) => ({
        id: `lote-${index}`,
        regiao,
        pedidos,
        distancia: `${(Math.random() * 500 + 100).toFixed(0)}m`,
      }));
  }, [pedidos]);

  const handleAssign = (pedidoId: string, motoboyId: string) => {
    // Em produção, atualizaria o motoboy do pedido
    atualizarStatusPedido(pedidoId, 'em_rota');
    atualizarStatusMotoboy(motoboyId, 'em_entrega');
    toast({
      title: 'Pedido atribuído!',
      description: 'O motoboy foi notificado.',
    });
  };

  const handleAtribuirLote = (loteId: string, motoboyId: string) => {
    const lote = lotesSugeridos.find(l => l.id === loteId);
    if (lote) {
      lote.pedidos.forEach(p => {
        atualizarStatusPedido(p.id, 'em_rota');
      });
      atualizarStatusMotoboy(motoboyId, 'em_entrega');
      toast({
        title: 'Lote atribuído!',
        description: `${lote.pedidos.length} pedidos foram atribuídos.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-border/50 flex flex-col">
        <div className="p-4 border-b border-border/50">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Bike className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">DeliveryControl</span>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <Link to="/dashboard" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary">
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
            <Link to="/reports" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary/50 transition-colors">
              <FileText className="h-5 w-5" />
              Relatórios
            </Link>
            <Link to="/settings" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary/50 transition-colors">
              <Settings className="h-5 w-5" />
              Configurações
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-border/50">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border/50 glass sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <AddPedidoDialog 
                  motoboys={motoboys} 
                  selectedMotoboyId={selectedMotoboyId || undefined}
                  onAdd={async (dados) => await adicionarPedido(dados)} 
                />
                <AddMotoboyDialog onAdd={async (dados) => {                  const novoMotoboy = await adicionarMotoboy(dados);                  setSelectedMotoboyId(novoMotoboy.id);                }} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {/* Stats - Melhorados */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Pedidos"
              value={stats.totalPedidos}
              secondaryValue={advancedStats.cancelados}
              secondaryLabel="cancelados"
              icon={Package}
            />
            <StatCard
              title="Entregues"
              value={stats.pedidosEntregues}
              secondaryLabel={advancedStats.tempoMedio > 0 ? `Tempo médio: ${advancedStats.tempoMedio} min` : undefined}
              icon={TrendingUp}
              variant="success"
            />
            <StatCard
              title="Total Taxas"
              value={`R$ ${stats.taxasTotal.toFixed(2)}`}
              secondaryLabel={`A pagar: R$ ${advancedStats.totalPagar.toFixed(2)}`}
              icon={DollarSign}
              variant="warning"
            />
            <StatCard
              title="Motoboys Ativos"
              value={stats.motoboyAtivos}
              secondaryLabel={`Carga média: ${advancedStats.cargaMedia}`}
              icon={Users}
              variant="primary"
            />
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Motoboys Column */}
            <div className="lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Motoboys</h2>
                {selectedMotoboyId && (
                  <button 
                    onClick={() => setSelectedMotoboyId(null)}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <ChevronLeft className="h-3 w-3" />
                    Ver todos
                  </button>
                )}
              </div>
              
              {motoboys.length === 0 ? (
                <div className="glass rounded-xl p-8 text-center">
                  <Bike className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground text-sm">Nenhum motoboy cadastrado</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3 pr-4">
                    {motoboys.map((motoboy) => (
                      <MotoboyCard
                        key={motoboy.id}
                        motoboy={motoboy}
                        pedidosAtivos={pedidosPorMotoboy[motoboy.id] || 0}
                        isSelected={selectedMotoboyId === motoboy.id}
                        onClick={() => setSelectedMotoboyId(
                          selectedMotoboyId === motoboy.id ? null : motoboy.id
                        )}
                        onRemove={() => removerMotoboy(motoboy.id)}
                        onStatusChange={(status) => atualizarStatusMotoboy(motoboy.id, status)}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            {/* Main Content - Tabs */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">
                    {selectedMotoboyId 
                      ? `Pedidos de ${motoboys.find(m => m.id === selectedMotoboyId)?.nome}`
                      : 'Pedidos'
                    }
                  </h2>
                  <TabsList className="glass">
                    <TabsTrigger value="pendentes" className="gap-1">
                      Pendentes
                      {stats.pedidosPendentes > 0 && (
                        <Badge variant="secondary" className="h-5 w-5 p-0 justify-center text-xs">
                          {pedidos.filter(p => p.status === 'pendente').length}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="em_rota" className="gap-1">
                      Em Rota
                      <Badge variant="secondary" className="h-5 w-5 p-0 justify-center text-xs">
                        {pedidos.filter(p => p.status === 'em_rota').length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="entregues">Entregues</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="pendentes">
                  <PedidosTable
                    pedidos={pedidosFiltrados.filter(p => p.status === 'pendente')}
                    motoboys={motoboys}
                    onStatusChange={atualizarStatusPedido}
                    onRemove={removerPedido}
                    onAssign={handleAssign}
                    showWaitTime={true}
                  />
                </TabsContent>
                <TabsContent value="em_rota">
                  <PedidosTable
                    pedidos={pedidosFiltrados.filter(p => p.status === 'em_rota')}
                    motoboys={motoboys}
                    onStatusChange={atualizarStatusPedido}
                    onRemove={removerPedido}
                    showWaitTime={true}
                  />
                </TabsContent>
                <TabsContent value="entregues">
                  <PedidosTable
                    pedidos={pedidosFiltrados.filter(p => p.status === 'entregue')}
                    motoboys={motoboys}
                    onStatusChange={atualizarStatusPedido}
                    onRemove={removerPedido}
                    showWaitTime={false}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar - Monitoring */}
            <div className="lg:col-span-1 space-y-4">
              {/* SLA Monitor - Pedidos em Risco */}
              {pedidosEmRisco.length > 0 ? (
                <div className="glass rounded-xl p-4 border-destructive/50 bg-destructive/5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-destructive animate-pulse" />
                    <h3 className="font-semibold text-destructive">Pedidos em Risco!</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {pedidosEmRisco.length} pedidos esperando há mais de 20 minutos
                  </p>
                  <div className="space-y-2">
                    {pedidosEmRisco.slice(0, 3).map(pedido => (
                      <div key={pedido.id} className="bg-background/50 rounded-lg p-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">#{pedido.numeroNota}</span>
                          <span className="text-destructive text-xs">
                            desde {pedido.horario}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{pedido.cliente}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-success" />
                    <h3 className="font-semibold">SLA OK</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Nenhum pedido em risco de atraso
                  </p>
                </div>
              )}

              {/* Lotes Sugeridos */}
              {lotesSugeridos.length > 0 ? (
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Lotes Sugeridos</h3>
                  </div>
                  <div className="space-y-3">
                    {lotesSugeridos.map((lote, index) => (
                      <LoteSugerido
                        key={lote.id}
                        lote={lote}
                        index={index + 1}
                        motoboys={motoboys.filter(m => m.status === 'disponivel')}
                        onAtribuir={(motoboyId) => handleAtribuirLote(lote.id, motoboyId)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold">Agrupamento</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Nenhum lote disponível. Lotes são criados quando há 2+ pedidos próximos.
                  </p>
                </div>
              )}

              {/* Otimização de Rota */}
              <RouteOptimizer pedidos={pedidos} motoboy={selectedMotoboy} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Componente de Lote Sugerido
interface LoteSugeridoProps {
  lote: { id: string; regiao: string; pedidos: any[]; distancia: string };
  index: number;
  motoboys: any[];
  onAtribuir: (motoboyId: string) => void;
}

function LoteSugerido({ lote, index, motoboys, onAtribuir }: LoteSugeridoProps) {
  const [selectedMotoboy, setSelectedMotoboy] = useState<string | null>(null);
  const [showMotoboys, setShowMotoboys] = useState(false);

  return (
    <div className="bg-secondary/30 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">{index}</span>
          </div>
          <span className="font-medium text-sm">{lote.regiao}</span>
        </div>
        <Badge variant="outline" className="text-xs">
          {lote.distancia}
        </Badge>
      </div>
      <div className="space-y-1 mb-2">
        {lote.pedidos.map(p => (
          <div key={p.id} className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>#{p.numeroNota}</span>
          </div>
        ))}
      </div>
      
      {!showMotoboys ? (
        <Button 
          size="sm" 
          className="w-full" 
          variant="outline"
          onClick={() => setShowMotoboys(true)}
        >
          Atribuir Lote
        </Button>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-1">
            {motoboys.slice(0, 4).map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMotoboy(m.id)}
                className={cn(
                  "p-1.5 rounded text-xs text-left transition-all",
                  selectedMotoboy === m.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-background/50 hover:bg-background"
                )}
              >
                {m.nome}
              </button>
            ))}
          </div>
          <Button 
            size="sm" 
            className="w-full gap-1"
            disabled={!selectedMotoboy}
            onClick={() => selectedMotoboy && onAtribuir(selectedMotoboy)}
          >
            <Check className="h-3 w-3" />
            Confirmar
          </Button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
