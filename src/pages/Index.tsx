import { useState } from 'react';
import { Bike, Package, DollarSign, TrendingUp, Users } from 'lucide-react';
import { useDelivery } from '@/hooks/useDelivery';
import { StatCard } from '@/components/delivery/StatCard';
import { MotoboyCard } from '@/components/delivery/MotoboyCard';
import { AddMotoboyDialog } from '@/components/delivery/AddMotoboyDialog';
import { AddPedidoDialog } from '@/components/delivery/AddPedidoDialog';
import { PedidosList } from '@/components/delivery/PedidosList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
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
  const stats = getEstatisticas();

  const pedidosFiltrados = selectedMotoboyId 
    ? getPedidosPorMotoboy(selectedMotoboyId)
    : pedidos;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center animate-pulse-glow">
                <Bike className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Controle de Delivery</h1>
                <p className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              </div>
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

      <main className="container mx-auto px-4 py-6">
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

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Motoboys */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Motoboys do Dia</h2>
              {selectedMotoboyId && (
                <button 
                  onClick={() => setSelectedMotoboyId(null)}
                  className="text-xs text-primary hover:underline"
                >
                  Ver todos pedidos
                </button>
              )}
            </div>
            
            {motoboys.length === 0 ? (
              <div className="glass rounded-xl p-8 text-center animate-fade-in">
                <Bike className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">Nenhum motoboy cadastrado</p>
                <p className="text-sm text-muted-foreground/70">
                  Adicione os motoboys que trabalham hoje
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
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

          {/* Pedidos */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="todos" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {selectedMotoboyId 
                    ? `Pedidos de ${motoboys.find(m => m.id === selectedMotoboyId)?.nome}`
                    : 'Todos os Pedidos'
                  }
                </h2>
                <TabsList className="glass">
                  <TabsTrigger value="todos">Todos</TabsTrigger>
                  <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
                  <TabsTrigger value="entregues">Entregues</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="todos">
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
        </div>
      </main>
    </div>
  );
};

export default Index;
