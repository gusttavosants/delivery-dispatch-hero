import { useState } from 'react';
import { 
  DollarSign, Plus, Trash2, MapPin, Percent, 
  Calculator, Save, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface BairroTaxa {
  id: string;
  nome: string;
  taxaAdicional: number;
}

interface RegraEspecial {
  id: string;
  nome: string;
  tipo: 'porcentagem' | 'valor_fixo' | 'por_km';
  valor: number;
  condicao: string;
  ativo: boolean;
}

export function AdvancedFeeSettings() {
  const { toast } = useToast();
  
  const [taxaBase, setTaxaBase] = useState(5.00);
  const [taxaPorKm, setTaxaPorKm] = useState(1.00);
  const [kmGratis, setKmGratis] = useState(5);
  const [taxaPorcentagem, setTaxaPorcentagem] = useState(0);
  const [usarPorcentagem, setUsarPorcentagem] = useState(false);
  
  const [bairros, setBairros] = useState<BairroTaxa[]>([
    { id: '1', nome: 'Centro', taxaAdicional: 0 },
    { id: '2', nome: 'Zona Sul', taxaAdicional: 3.00 },
    { id: '3', nome: 'Zona Norte', taxaAdicional: 2.50 },
    { id: '4', nome: 'Zona Leste', taxaAdicional: 4.00 },
  ]);

  const [regrasEspeciais, setRegrasEspeciais] = useState<RegraEspecial[]>([
    { 
      id: '1', 
      nome: 'Pedidos Grandes', 
      tipo: 'porcentagem', 
      valor: 10, 
      condicao: 'Valor > R$ 100',
      ativo: true 
    },
    { 
      id: '2', 
      nome: 'Horário de Pico', 
      tipo: 'valor_fixo', 
      valor: 2, 
      condicao: '18h às 21h',
      ativo: true 
    },
    { 
      id: '3', 
      nome: 'Distância Extra', 
      tipo: 'por_km', 
      valor: 1.5, 
      condicao: 'Após 10km',
      ativo: false 
    },
  ]);

  const [novoBairro, setNovoBairro] = useState({ nome: '', taxaAdicional: 0 });
  const [novaRegra, setNovaRegra] = useState<Omit<RegraEspecial, 'id' | 'ativo'>>({
    nome: '',
    tipo: 'valor_fixo',
    valor: 0,
    condicao: '',
  });

  const handleAddBairro = () => {
    if (!novoBairro.nome) {
      toast({ title: 'Informe o nome do bairro', variant: 'destructive' });
      return;
    }
    setBairros(prev => [...prev, { ...novoBairro, id: Date.now().toString() }]);
    setNovoBairro({ nome: '', taxaAdicional: 0 });
    toast({ title: 'Bairro adicionado!' });
  };

  const handleRemoveBairro = (id: string) => {
    setBairros(prev => prev.filter(b => b.id !== id));
  };

  const handleAddRegra = () => {
    if (!novaRegra.nome || !novaRegra.condicao) {
      toast({ title: 'Preencha todos os campos', variant: 'destructive' });
      return;
    }
    setRegrasEspeciais(prev => [...prev, { ...novaRegra, id: Date.now().toString(), ativo: true }]);
    setNovaRegra({ nome: '', tipo: 'valor_fixo', valor: 0, condicao: '' });
    toast({ title: 'Regra adicionada!' });
  };

  const handleRemoveRegra = (id: string) => {
    setRegrasEspeciais(prev => prev.filter(r => r.id !== id));
  };

  const handleToggleRegra = (id: string) => {
    setRegrasEspeciais(prev => prev.map(r => 
      r.id === id ? { ...r, ativo: !r.ativo } : r
    ));
  };

  const handleSave = () => {
    toast({ title: 'Configurações salvas com sucesso!' });
  };

  // Simular cálculo de exemplo
  const calcularExemplo = (valorPedido: number, distancia: number, bairro: string) => {
    let taxa = taxaBase;
    
    // Taxa por km
    const kmCobrado = Math.max(0, distancia - kmGratis);
    taxa += kmCobrado * taxaPorKm;
    
    // Porcentagem do pedido
    if (usarPorcentagem) {
      taxa += valorPedido * (taxaPorcentagem / 100);
    }
    
    // Taxa do bairro
    const bairroInfo = bairros.find(b => b.nome === bairro);
    if (bairroInfo) {
      taxa += bairroInfo.taxaAdicional;
    }
    
    return taxa;
  };

  return (
    <div className="space-y-6">
      {/* Configuração Base */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Configuração de Taxas</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Taxa Base */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Taxa Base por Entrega</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">R$</span>
                <Input
                  type="number"
                  step="0.50"
                  value={taxaBase}
                  onChange={(e) => setTaxaBase(parseFloat(e.target.value) || 0)}
                  className="w-24"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Taxa por Km Adicional</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">R$</span>
                <Input
                  type="number"
                  step="0.10"
                  value={taxaPorKm}
                  onChange={(e) => setTaxaPorKm(parseFloat(e.target.value) || 0)}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">por km</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Km Gratuitos</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={kmGratis}
                  onChange={(e) => setKmGratis(parseInt(e.target.value) || 0)}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">km</span>
              </div>
            </div>
          </div>

          {/* Porcentagem do Pedido */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Cobrar % do Valor do Pedido</Label>
              <Switch checked={usarPorcentagem} onCheckedChange={setUsarPorcentagem} />
            </div>
            
            {usarPorcentagem && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.5"
                    value={taxaPorcentagem}
                    onChange={(e) => setTaxaPorcentagem(parseFloat(e.target.value) || 0)}
                    className="w-24"
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Adiciona uma porcentagem do valor do pedido à taxa
                </p>
              </div>
            )}

            {/* Exemplo de Cálculo */}
            <div className="bg-secondary/30 rounded-lg p-4 mt-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Calculator className="h-4 w-4 text-primary" />
                Exemplo de Cálculo
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Pedido R$ 80,00 | 8km | Zona Sul
              </p>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Taxa base:</span>
                  <span>R$ {taxaBase.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Km adicional ({Math.max(0, 8 - kmGratis)} km):</span>
                  <span>R$ {(Math.max(0, 8 - kmGratis) * taxaPorKm).toFixed(2)}</span>
                </div>
                {usarPorcentagem && (
                  <div className="flex justify-between">
                    <span>{taxaPorcentagem}% de R$ 80:</span>
                    <span>R$ {(80 * taxaPorcentagem / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxa Zona Sul:</span>
                  <span>R$ 3.00</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border font-bold">
                  <span>Total:</span>
                  <span className="text-primary">R$ {calcularExemplo(80, 8, 'Zona Sul').toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Taxas por Bairro */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Taxas por Bairro/Região</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label>Nome do Bairro</Label>
            <Input
              value={novoBairro.nome}
              onChange={(e) => setNovoBairro(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Ex: Vila Mariana"
            />
          </div>
          <div className="space-y-2">
            <Label>Taxa Adicional</Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">R$</span>
              <Input
                type="number"
                step="0.50"
                value={novoBairro.taxaAdicional}
                onChange={(e) => setNovoBairro(prev => ({ ...prev, taxaAdicional: parseFloat(e.target.value) || 0 }))}
                className="flex-1"
              />
              <Button onClick={handleAddBairro} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[200px]">
          <div className="flex flex-wrap gap-2 pr-4">
            {bairros.map((bairro) => (
              <Badge 
                key={bairro.id} 
                variant="secondary" 
                className="gap-2 py-2 px-3"
              >
                <MapPin className="h-3 w-3" />
                {bairro.nome}
                <span className="font-bold">+R$ {bairro.taxaAdicional.toFixed(2)}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1 hover:text-destructive"
                  onClick={() => handleRemoveBairro(bairro.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Regras Especiais */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Percent className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Regras Especiais</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <div className="space-y-2">
            <Label>Nome da Regra</Label>
            <Input
              value={novaRegra.nome}
              onChange={(e) => setNovaRegra(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Ex: Pedidos Grandes"
            />
          </div>
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={novaRegra.tipo}
              onValueChange={(value: 'porcentagem' | 'valor_fixo' | 'por_km') => 
                setNovaRegra(prev => ({ ...prev, tipo: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="valor_fixo">Valor Fixo</SelectItem>
                <SelectItem value="porcentagem">Porcentagem</SelectItem>
                <SelectItem value="por_km">Por Km</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Valor</Label>
            <Input
              type="number"
              value={novaRegra.valor}
              onChange={(e) => setNovaRegra(prev => ({ ...prev, valor: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Condição</Label>
            <div className="flex gap-2">
              <Input
                value={novaRegra.condicao}
                onChange={(e) => setNovaRegra(prev => ({ ...prev, condicao: e.target.value }))}
                placeholder="Ex: Valor > R$ 100"
              />
              <Button onClick={handleAddRegra}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[200px]">
          <div className="space-y-2 pr-4">
            {regrasEspeciais.map((regra) => (
              <div 
                key={regra.id} 
                className={`bg-secondary/30 rounded-lg p-3 flex items-center justify-between ${
                  !regra.ativo ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Switch 
                    checked={regra.ativo}
                    onCheckedChange={() => handleToggleRegra(regra.id)}
                  />
                  <div>
                    <span className="font-medium">{regra.nome}</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {regra.tipo === 'porcentagem' ? `${regra.valor}%` :
                         regra.tipo === 'por_km' ? `R$ ${regra.valor}/km` :
                         `R$ ${regra.valor}`}
                      </Badge>
                      <span>{regra.condicao}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveRegra(regra.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Salvar */}
      <div className="flex justify-end">
        <Button className="gap-2" onClick={handleSave}>
          <Save className="h-4 w-4" />
          Salvar Todas as Configurações
        </Button>
      </div>
    </div>
  );
}
