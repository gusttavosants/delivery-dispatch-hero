import { useState } from 'react';
import { 
  Wallet, Plus, Trash2, Calendar, DollarSign, 
  AlertCircle, CheckCircle, History 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export interface Vale {
  id: string;
  motoboyId: string;
  motoboyNome: string;
  valor: number;
  data: string;
  motivo: string;
  status: 'pendente' | 'descontado';
}

interface ValesModuleProps {
  motoboys: Array<{ id: string; nome: string }>;
  vales: Vale[];
  onAddVale: (vale: Omit<Vale, 'id' | 'status'>) => void;
  onRemoveVale: (id: string) => void;
  onDescontarVale: (id: string) => void;
}

export function ValesModule({ motoboys, vales, onAddVale, onRemoveVale, onDescontarVale }: ValesModuleProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [novoVale, setNovoVale] = useState({
    motoboyId: '',
    valor: 0,
    motivo: '',
  });

  const handleAdd = () => {
    if (!novoVale.motoboyId || novoVale.valor <= 0) {
      toast({
        title: 'Preencha todos os campos',
        variant: 'destructive',
      });
      return;
    }

    const motoboy = motoboys.find(m => m.id === novoVale.motoboyId);
    onAddVale({
      ...novoVale,
      motoboyNome: motoboy?.nome || '',
      data: new Date().toISOString().split('T')[0],
    });
    
    setNovoVale({ motoboyId: '', valor: 0, motivo: '' });
    setOpen(false);
    toast({ title: 'Vale registrado com sucesso!' });
  };

  const totalPendente = vales
    .filter(v => v.status === 'pendente')
    .reduce((acc, v) => acc + v.valor, 0);

  const valesPorMotoboy = vales.reduce((acc, vale) => {
    if (vale.status === 'pendente') {
      acc[vale.motoboyId] = (acc[vale.motoboyId] || 0) + vale.valor;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Gestão de Vales/Adiantamentos</h2>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Vale
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Vale/Adiantamento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Motoboy</Label>
                <Select
                  value={novoVale.motoboyId}
                  onValueChange={(value) => setNovoVale(prev => ({ ...prev, motoboyId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o motoboy" />
                  </SelectTrigger>
                  <SelectContent>
                    {motoboys.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Valor (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={novoVale.valor}
                  onChange={(e) => setNovoVale(prev => ({ ...prev, valor: parseFloat(e.target.value) || 0 }))}
                  placeholder="0,00"
                />
              </div>

              <div className="space-y-2">
                <Label>Motivo (opcional)</Label>
                <Input
                  value={novoVale.motivo}
                  onChange={(e) => setNovoVale(prev => ({ ...prev, motivo: e.target.value }))}
                  placeholder="Ex: Combustível, Alimentação..."
                />
              </div>

              <Button className="w-full" onClick={handleAdd}>
                Registrar Vale
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-destructive/10 rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Total Pendente</p>
          <p className="text-xl font-bold text-destructive">R$ {totalPendente.toFixed(2)}</p>
        </div>
        <div className="bg-success/10 rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Vales Descontados</p>
          <p className="text-xl font-bold text-success">
            R$ {vales.filter(v => v.status === 'descontado').reduce((acc, v) => acc + v.valor, 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Lista de Vales Pendentes */}
      <ScrollArea className="h-[300px]">
        <div className="space-y-2 pr-4">
          {vales.filter(v => v.status === 'pendente').length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-10 w-10 mx-auto text-success/50 mb-2" />
              <p className="text-sm text-muted-foreground">Nenhum vale pendente</p>
            </div>
          ) : (
            vales.filter(v => v.status === 'pendente').map((vale) => (
              <div key={vale.id} className="bg-secondary/30 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{vale.motoboyNome}</span>
                      <Badge variant="destructive" className="text-xs">Pendente</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(vale.data).toLocaleDateString('pt-BR')}
                      </span>
                      {vale.motivo && <span>{vale.motivo}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-destructive">
                      R$ {vale.valor.toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onDescontarVale(vale.id)}
                      title="Marcar como descontado"
                    >
                      <CheckCircle className="h-4 w-4 text-success" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onRemoveVale(vale.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Resumo por Motoboy */}
      {Object.keys(valesPorMotoboy).length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-warning" />
            Vales Pendentes por Motoboy
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(valesPorMotoboy).map(([motoboyId, total]) => {
              const motoboy = motoboys.find(m => m.id === motoboyId);
              return (
                <Badge key={motoboyId} variant="outline" className="gap-1">
                  {motoboy?.nome}: R$ {total.toFixed(2)}
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
