import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bike, FileText, ArrowLeft, Calendar, Download, TrendingUp, 
  Package, DollarSign, Clock, Users, XCircle, CheckCircle, Wallet, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { ValesModule, Vale } from '@/components/delivery/ValesModule';
import { PDFGenerator } from '@/components/delivery/PDFGenerator';
import { TrendsReport } from '@/components/delivery/TrendsReport';
import { MotoboyTracker } from '@/components/delivery/MotoboyTracker';

interface DailyReport {
  totalPedidos: number;
  entregues: number;
  cancelados: number;
  taxasTotal: number;
  valorTotal: number;
  tempoMedio: number;
  motoboys: Array<{
    nome: string;
    entregas: number;
    taxas: number;
    tempoMedio: number;
  }>;
}

const Reports = () => {
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock motoboys data
  const motoboys = [
    { id: '1', nome: 'João Silva', totalValor: 95, entregas: 15, status: 'em_entrega' },
    { id: '2', nome: 'Carlos Santos', totalValor: 78, entregas: 12, status: 'disponivel' },
    { id: '3', nome: 'Pedro Lima', totalValor: 65, entregas: 10, status: 'em_entrega' },
    { id: '4', nome: 'Lucas Souza', totalValor: 47.5, entregas: 5, status: 'disponivel' },
  ];

  // Mock pedidos
  const pedidos = motoboys.flatMap(m => 
    Array.from({ length: m.entregas }, (_, i) => ({
      id: `${m.id}-${i}`,
      motoboyId: m.id,
      status: 'entregue',
      taxa: 5,
    }))
  );

  // Vales state
  const [vales, setVales] = useState<Vale[]>([
    { id: '1', motoboyId: '1', motoboyNome: 'João Silva', valor: 50, data: '2024-01-15', motivo: 'Combustível', status: 'pendente' },
    { id: '2', motoboyId: '2', motoboyNome: 'Carlos Santos', valor: 30, data: '2024-01-14', motivo: 'Alimentação', status: 'descontado' },
  ]);

  const handleAddVale = (vale: Omit<Vale, 'id' | 'status'>) => {
    setVales(prev => [...prev, { ...vale, id: Date.now().toString(), status: 'pendente' }]);
  };

  const handleRemoveVale = (id: string) => {
    setVales(prev => prev.filter(v => v.id !== id));
  };

  const handleDescontarVale = (id: string) => {
    setVales(prev => prev.map(v => v.id === id ? { ...v, status: 'descontado' } : v));
  };

  // Dados simulados para o fechamento diário
  const dailyReport: DailyReport = {
    totalPedidos: 45,
    entregues: 42,
    cancelados: 3,
    taxasTotal: 285.50,
    valorTotal: 2850.00,
    tempoMedio: 22,
    motoboys: [
      { nome: 'João Silva', entregas: 15, taxas: 95.00, tempoMedio: 18 },
      { nome: 'Carlos Santos', entregas: 12, taxas: 78.00, tempoMedio: 20 },
      { nome: 'Pedro Lima', entregas: 10, taxas: 65.00, tempoMedio: 25 },
      { nome: 'Lucas Souza', entregas: 5, taxas: 47.50, tempoMedio: 28 },
    ],
  };

  const successRate = ((dailyReport.entregues / dailyReport.totalPedidos) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Relatórios</h1>
                  <p className="text-xs text-muted-foreground">
                    Fechamento, vales e performance
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <PDFGenerator motoboys={motoboys} pedidos={pedidos} vales={vales} />
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{new Date(selectedDate).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="fechamento" className="w-full">
          <TabsList className="glass mb-6 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="fechamento" className="gap-2">
              <FileText className="h-4 w-4" />
              Fechamento
            </TabsTrigger>
            <TabsTrigger value="vales" className="gap-2">
              <Wallet className="h-4 w-4" />
              Vales
            </TabsTrigger>
            <TabsTrigger value="rastreamento" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Rastreamento
            </TabsTrigger>
            <TabsTrigger value="tendencias" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Tendências
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fechamento">
            {/* Resumo do dia */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="glass rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total Pedidos</span>
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <p className="text-3xl font-bold">{dailyReport.totalPedidos}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {dailyReport.cancelados} cancelados
                </p>
              </div>

              <div className="glass rounded-xl p-5 border-success/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Taxa de Sucesso</span>
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <p className="text-3xl font-bold text-success">{successRate}%</p>
                <Progress value={parseFloat(successRate)} className="h-1.5 mt-2" />
              </div>

              <div className="glass rounded-xl p-5 border-warning/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Tempo Médio</span>
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <p className="text-3xl font-bold">{dailyReport.tempoMedio} min</p>
                <p className="text-xs text-muted-foreground mt-1">por entrega</p>
              </div>

              <div className="glass rounded-xl p-5 border-primary/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total Taxas</span>
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <p className="text-3xl font-bold text-primary">R$ {dailyReport.taxasTotal.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">a pagar aos motoboys</p>
              </div>
            </div>

            {/* Detalhamento por motoboy */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Fechamento por Motoboy
              </h2>

              <div className="space-y-4">
                {dailyReport.motoboys.map((motoboy, index) => (
                  <div key={index} className="bg-secondary/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bike className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{motoboy.nome}</h3>
                          <p className="text-xs text-muted-foreground">
                            Tempo médio: {motoboy.tempoMedio} min
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">
                          R$ {motoboy.taxas.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">a pagar</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-background/50 rounded-lg p-2">
                        <p className="text-lg font-bold">{motoboy.entregas}</p>
                        <p className="text-xs text-muted-foreground">Entregas</p>
                      </div>
                      <div className="bg-background/50 rounded-lg p-2">
                        <p className="text-lg font-bold">{motoboy.tempoMedio} min</p>
                        <p className="text-xs text-muted-foreground">Tempo médio</p>
                      </div>
                      <div className="bg-background/50 rounded-lg p-2">
                        <p className="text-lg font-bold">
                          R$ {(motoboy.taxas / motoboy.entregas).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">Média/entrega</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold">Total a Pagar</p>
                    <p className="text-sm text-muted-foreground">
                      {dailyReport.motoboys.reduce((acc, m) => acc + m.entregas, 0)} entregas no total
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-primary">
                    R$ {dailyReport.taxasTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="glass rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Performance Mensal dos Motoboys
              </h2>

              <ScrollArea className="h-[500px]">
                <div className="space-y-4 pr-4">
                  {motoboyPerformance.map((motoboy, index) => (
                    <div key={index} className="bg-secondary/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <Bike className="h-6 w-6 text-primary" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-warning flex items-center justify-center text-xs font-bold text-warning-foreground">
                              #{index + 1}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{motoboy.nome}</h3>
                            <div className="flex items-center gap-1 text-sm">
                              <span className="text-warning">★</span>
                              <span>{motoboy.avaliacao}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            R$ {motoboy.taxaTotal.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">ganhos no mês</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        <div className="bg-background/50 rounded-lg p-3 text-center">
                          <Package className="h-4 w-4 mx-auto mb-1 text-primary" />
                          <p className="text-lg font-bold">{motoboy.entregas}</p>
                          <p className="text-xs text-muted-foreground">Entregas</p>
                        </div>
                        <div className="bg-background/50 rounded-lg p-3 text-center">
                          <XCircle className="h-4 w-4 mx-auto mb-1 text-destructive" />
                          <p className="text-lg font-bold">{motoboy.cancelamentos}</p>
                          <p className="text-xs text-muted-foreground">Cancelamentos</p>
                        </div>
                        <div className="bg-background/50 rounded-lg p-3 text-center">
                          <Clock className="h-4 w-4 mx-auto mb-1 text-warning" />
                          <p className="text-lg font-bold">{motoboy.tempoMedio} min</p>
                          <p className="text-xs text-muted-foreground">Tempo médio</p>
                        </div>
                        <div className="bg-background/50 rounded-lg p-3 text-center">
                          <TrendingUp className="h-4 w-4 mx-auto mb-1 text-success" />
                          <p className="text-lg font-bold">
                            {((motoboy.entregas / (motoboy.entregas + motoboy.cancelamentos)) * 100).toFixed(0)}%
                          </p>
                          <p className="text-xs text-muted-foreground">Sucesso</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="vales">
            <ValesModule
              motoboys={motoboys}
              vales={vales}
              onAddVale={handleAddVale}
              onRemoveVale={handleRemoveVale}
              onDescontarVale={handleDescontarVale}
            />
          </TabsContent>

          <TabsContent value="rastreamento">
            <MotoboyTracker motoboys={motoboys} />
          </TabsContent>

          <TabsContent value="tendencias">
            <TrendsReport />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Reports;
