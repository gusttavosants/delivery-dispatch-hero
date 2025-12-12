import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bike, Package, DollarSign, TrendingUp, Users, LogOut, 
  LayoutDashboard, Settings, ChevronLeft 
} from 'lucide-react';
import { useDelivery } from '@/hooks/useDelivery';
import { StatCard } from '@/components/delivery/StatCard';
import { MotoboyCard } from '@/components/delivery/MotoboyCard';
import { AddMotoboyDialog } from '@/components/delivery/AddMotoboyDialog';
import { AddPedidoDialog } from '@/components/delivery/AddPedidoDialog';
import { PedidosList } from '@/components/delivery/PedidosList';
import { RouteOptimizer } from '@/components/delivery/RouteOptimizer';
import { OrderBatching } from '@/components/delivery/OrderBatching';
import { SLAMonitor } from '@/components/delivery/SLAMonitor';
import { MotoboyLoadCard } from '@/components/delivery/MotoboyLoadCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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
  const [activeTab, setActiveTab] = useState('pedidos');
  const stats = getEstatisticas();

  const pedidosFiltrados = selectedMotoboyId 
    ? getPedidosPorMotoboy(selectedMotoboyId)
    : pedidos;

  const selectedMotoboy = selectedMotoboyId 
    ? motoboys.find(m => m.id === selectedMotoboyId) || null
    : null;

  const handleAtribuirLote = (pedidoIds: string[], motoboyId: string) => {
    // Em produção, isso atualizaria os pedidos para o motoboy selecionado
    toast({
      title: 'Lote atribuído!',
      description: `${pedidoIds.length} pedidos foram atribuídos ao motoboy.`,
    });
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
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary">
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary/50 transition-colors">
              <Settings className="h-5 w-5" />
              Configurações
            </button>
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
                  onAdd={adicionarPedido} 
                />
                <AddMotoboyDialog onAdd={adicionarMotoboy} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Motoboys Ativos"
              value={stats.motoboyAtivos}
              icon={Users}
              variant="primary"
            />
            <StatCard
              title="Total Pedidos"
              value={stats.totalPedidos}
              icon={Package}
            />
            <StatCard
              title="Entregues"
              value={stats.pedidosEntregues}
              icon={TrendingUp}
              variant="success"
            />
            <StatCard
              title="Total Taxas"
              value={`R$ ${stats.taxasTotal.toFixed(2)}`}
              icon={DollarSign}
              variant="warning"
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
                    <TabsTrigger value="pedidos">Todos</TabsTrigger>
                    <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
                    <TabsTrigger value="entregues">Entregues</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="pedidos">
                  <PedidosList
                    pedidos={pedidosFiltrados}
                    motoboys={motoboys}
                    onStatusChange={atualizarStatusPedido}
                    onRemove={removerPedido}
                  />
                </TabsContent>
                <TabsContent value="pendentes">
                  <PedidosList
                    pedidos={pedidosFiltrados.filter(p => p.status === 'pendente' || p.status === 'em_rota')}
                    motoboys={motoboys}
                    onStatusChange={atualizarStatusPedido}
                    onRemove={removerPedido}
                  />
                </TabsContent>
                <TabsContent value="entregues">
                  <PedidosList
                    pedidos={pedidosFiltrados.filter(p => p.status === 'entregue')}
                    motoboys={motoboys}
                    onStatusChange={atualizarStatusPedido}
                    onRemove={removerPedido}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar - Monitoring */}
            <div className="lg:col-span-1 space-y-4">
              <SLAMonitor pedidos={pedidos} motoboys={motoboys} />
              
              <RouteOptimizer pedidos={pedidos} motoboy={selectedMotoboy} />
              
              <OrderBatching 
                pedidos={pedidos} 
                motoboys={motoboys} 
                onAtribuirLote={handleAtribuirLote}
              />

              {/* Motoboy Load Overview */}
              {motoboys.length > 0 && (
                <div className="glass rounded-xl p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Carga dos Motoboys
                  </h3>
                  <div className="space-y-2">
                    {motoboys.filter(m => m.status !== 'ausente').map(motoboy => (
                      <MotoboyLoadCard 
                        key={motoboy.id} 
                        motoboy={motoboy} 
                        pedidos={pedidos} 
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
