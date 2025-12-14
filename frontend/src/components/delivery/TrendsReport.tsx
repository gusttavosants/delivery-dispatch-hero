import { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, Calendar, Filter, 
  BarChart3, Users, Package, DollarSign, Clock,
  ChevronUp, ChevronDown, Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MotoboyTrend {
  id: string;
  nome: string;
  entregasAtual: number;
  entregasAnterior: number;
  taxasAtual: number;
  taxasAnterior: number;
  tempoMedioAtual: number;
  tempoMedioAnterior: number;
  cancelamentosAtual: number;
  cancelamentosAnterior: number;
}

export function TrendsReport() {
  const [periodo, setPeriodo] = useState<'semana' | 'mes'>('mes');

  // Dados simulados de tendências
  const trendData: MotoboyTrend[] = useMemo(() => [
    {
      id: '1',
      nome: 'João Silva',
      entregasAtual: 145,
      entregasAnterior: 126,
      taxasAtual: 920,
      taxasAnterior: 798,
      tempoMedioAtual: 18,
      tempoMedioAnterior: 22,
      cancelamentosAtual: 2,
      cancelamentosAnterior: 5,
    },
    {
      id: '2',
      nome: 'Carlos Santos',
      entregasAtual: 120,
      entregasAnterior: 135,
      taxasAtual: 780,
      taxasAnterior: 878,
      tempoMedioAtual: 22,
      tempoMedioAnterior: 20,
      cancelamentosAtual: 5,
      cancelamentosAnterior: 3,
    },
    {
      id: '3',
      nome: 'Pedro Lima',
      entregasAtual: 98,
      entregasAnterior: 98,
      taxasAtual: 640,
      taxasAnterior: 637,
      tempoMedioAtual: 25,
      tempoMedioAnterior: 25,
      cancelamentosAtual: 3,
      cancelamentosAnterior: 4,
    },
    {
      id: '4',
      nome: 'Lucas Souza',
      entregasAtual: 75,
      entregasAnterior: 82,
      taxasAtual: 485,
      taxasAnterior: 533,
      tempoMedioAtual: 28,
      tempoMedioAnterior: 26,
      cancelamentosAtual: 8,
      cancelamentosAnterior: 6,
    },
  ], []);

  // Resumo geral
  const resumo = useMemo(() => {
    const totalEntregasAtual = trendData.reduce((acc, m) => acc + m.entregasAtual, 0);
    const totalEntregasAnterior = trendData.reduce((acc, m) => acc + m.entregasAnterior, 0);
    const totalTaxasAtual = trendData.reduce((acc, m) => acc + m.taxasAtual, 0);
    const totalTaxasAnterior = trendData.reduce((acc, m) => acc + m.taxasAnterior, 0);
    const avgTempoAtual = trendData.reduce((acc, m) => acc + m.tempoMedioAtual, 0) / trendData.length;
    const avgTempoAnterior = trendData.reduce((acc, m) => acc + m.tempoMedioAnterior, 0) / trendData.length;
    
    return {
      entregas: {
        atual: totalEntregasAtual,
        anterior: totalEntregasAnterior,
        variacao: ((totalEntregasAtual - totalEntregasAnterior) / totalEntregasAnterior) * 100,
      },
      taxas: {
        atual: totalTaxasAtual,
        anterior: totalTaxasAnterior,
        variacao: ((totalTaxasAtual - totalTaxasAnterior) / totalTaxasAnterior) * 100,
      },
      tempo: {
        atual: avgTempoAtual,
        anterior: avgTempoAnterior,
        variacao: ((avgTempoAtual - avgTempoAnterior) / avgTempoAnterior) * 100,
      },
    };
  }, [trendData]);

  const calcVariacao = (atual: number, anterior: number) => {
    if (anterior === 0) return 0;
    return ((atual - anterior) / anterior) * 100;
  };

  const getTrendIcon = (variacao: number, inverso: boolean = false) => {
    const positivo = inverso ? variacao < 0 : variacao > 0;
    const negativo = inverso ? variacao > 0 : variacao < 0;
    
    if (positivo) return <ChevronUp className="h-4 w-4 text-success" />;
    if (negativo) return <ChevronDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendColor = (variacao: number, inverso: boolean = false) => {
    const positivo = inverso ? variacao < 0 : variacao > 0;
    const negativo = inverso ? variacao > 0 : variacao < 0;
    
    if (positivo) return 'text-success';
    if (negativo) return 'text-destructive';
    return 'text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Histórico e Tendências</h2>
        </div>
        <Select value={periodo} onValueChange={(v: 'semana' | 'mes') => setPeriodo(v)}>
          <SelectTrigger className="w-40">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semana">Esta Semana</SelectItem>
            <SelectItem value="mes">Este Mês</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Resumo Geral */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Entregas</span>
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">{resumo.entregas.atual}</span>
            <div className={`flex items-center text-sm ${getTrendColor(resumo.entregas.variacao)}`}>
              {getTrendIcon(resumo.entregas.variacao)}
              <span>{Math.abs(resumo.entregas.variacao).toFixed(1)}%</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            vs {resumo.entregas.anterior} no período anterior
          </p>
        </div>

        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Taxas</span>
            <DollarSign className="h-5 w-5 text-success" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">R$ {resumo.taxas.atual.toFixed(0)}</span>
            <div className={`flex items-center text-sm ${getTrendColor(resumo.taxas.variacao)}`}>
              {getTrendIcon(resumo.taxas.variacao)}
              <span>{Math.abs(resumo.taxas.variacao).toFixed(1)}%</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            vs R$ {resumo.taxas.anterior.toFixed(0)} no período anterior
          </p>
        </div>

        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Tempo Médio</span>
            <Clock className="h-5 w-5 text-warning" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">{resumo.tempo.atual.toFixed(0)} min</span>
            <div className={`flex items-center text-sm ${getTrendColor(resumo.tempo.variacao, true)}`}>
              {getTrendIcon(resumo.tempo.variacao, true)}
              <span>{Math.abs(resumo.tempo.variacao).toFixed(1)}%</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            vs {resumo.tempo.anterior.toFixed(0)} min no período anterior
          </p>
        </div>
      </div>

      {/* Comparativo por Motoboy */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Comparativo por Motoboy</h3>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-4 pr-4">
            {trendData
              .sort((a, b) => 
                calcVariacao(b.entregasAtual, b.entregasAnterior) - 
                calcVariacao(a.entregasAtual, a.entregasAnterior)
              )
              .map((motoboy, index) => {
                const variacaoEntregas = calcVariacao(motoboy.entregasAtual, motoboy.entregasAnterior);
                const variacaoTaxas = calcVariacao(motoboy.taxasAtual, motoboy.taxasAnterior);
                const variacaoTempo = calcVariacao(motoboy.tempoMedioAtual, motoboy.tempoMedioAnterior);
                const variacaoCancelamentos = calcVariacao(motoboy.cancelamentosAtual, motoboy.cancelamentosAnterior);

                return (
                  <div key={motoboy.id} className="bg-secondary/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          {index === 0 && (
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 justify-center bg-success">
                              1
                            </Badge>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold">{motoboy.nome}</h4>
                          <div className={`flex items-center gap-1 text-sm ${getTrendColor(variacaoEntregas)}`}>
                            {variacaoEntregas > 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : variacaoEntregas < 0 ? (
                              <TrendingDown className="h-4 w-4" />
                            ) : (
                              <Minus className="h-4 w-4" />
                            )}
                            <span>
                              {variacaoEntregas > 0 ? '+' : ''}{variacaoEntregas.toFixed(1)}% entregas
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xl font-bold">{motoboy.entregasAtual}</p>
                        <p className="text-xs text-muted-foreground">
                          vs {motoboy.entregasAnterior} anterior
                        </p>
                      </div>
                    </div>

                    {/* Barra de comparação */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Período anterior</span>
                        <span>Período atual</span>
                      </div>
                      <div className="flex gap-1 h-2">
                        <div 
                          className="bg-muted rounded-l"
                          style={{ 
                            width: `${(motoboy.entregasAnterior / Math.max(motoboy.entregasAtual, motoboy.entregasAnterior)) * 50}%` 
                          }}
                        />
                        <div 
                          className="bg-primary rounded-r"
                          style={{ 
                            width: `${(motoboy.entregasAtual / Math.max(motoboy.entregasAtual, motoboy.entregasAnterior)) * 50}%` 
                          }}
                        />
                      </div>
                    </div>

                    {/* Métricas detalhadas */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-background/50 rounded p-2 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <DollarSign className="h-3 w-3 text-success" />
                          <span className={`text-xs ${getTrendColor(variacaoTaxas)}`}>
                            {variacaoTaxas > 0 ? '+' : ''}{variacaoTaxas.toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-sm font-medium">R$ {motoboy.taxasAtual}</p>
                        <p className="text-xs text-muted-foreground">Taxas</p>
                      </div>
                      
                      <div className="bg-background/50 rounded p-2 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Clock className="h-3 w-3 text-warning" />
                          <span className={`text-xs ${getTrendColor(variacaoTempo, true)}`}>
                            {variacaoTempo > 0 ? '+' : ''}{variacaoTempo.toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-sm font-medium">{motoboy.tempoMedioAtual} min</p>
                        <p className="text-xs text-muted-foreground">Tempo médio</p>
                      </div>
                      
                      <div className="bg-background/50 rounded p-2 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Package className="h-3 w-3 text-destructive" />
                          <span className={`text-xs ${getTrendColor(variacaoCancelamentos, true)}`}>
                            {variacaoCancelamentos > 0 ? '+' : ''}{variacaoCancelamentos.toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-sm font-medium">{motoboy.cancelamentosAtual}</p>
                        <p className="text-xs text-muted-foreground">Cancelamentos</p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
