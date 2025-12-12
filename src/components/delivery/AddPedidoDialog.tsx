import { useState } from 'react';
import { Plus, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Pedido, Motoboy } from '@/types/delivery';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddPedidoDialogProps {
  motoboys: Motoboy[];
  selectedMotoboyId?: string;
  onAdd: (dados: Omit<Pedido, 'id' | 'horario'>) => void;
}

export function AddPedidoDialog({ motoboys, selectedMotoboyId, onAdd }: AddPedidoDialogProps) {
  const [open, setOpen] = useState(false);
  const [motoboyId, setMotoboyId] = useState(selectedMotoboyId || '');
  const [numeroNota, setNumeroNota] = useState('');
  const [cliente, setCliente] = useState('');
  const [endereco, setEndereco] = useState('');
  const [valor, setValor] = useState('');
  const [taxaEntrega, setTaxaEntrega] = useState('5.00');
  const [observacao, setObservacao] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!motoboyId || !numeroNota.trim() || !cliente.trim() || !endereco.trim()) return;
    
    onAdd({
      motoboyId,
      numeroNota: numeroNota.trim(),
      cliente: cliente.trim(),
      endereco: endereco.trim(),
      valor: parseFloat(valor) || 0,
      taxaEntrega: parseFloat(taxaEntrega) || 5,
      status: 'pendente',
      observacao: observacao.trim() || undefined,
    });
    
    setNumeroNota('');
    setCliente('');
    setEndereco('');
    setValor('');
    setTaxaEntrega('5.00');
    setObservacao('');
    setOpen(false);
  };

  const motoboysDisponiveis = motoboys.filter(m => m.status !== 'ausente');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Pedido
        </Button>
      </DialogTrigger>
      <DialogContent className="glass max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Adicionar Pedido
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="motoboy">Motoboy</Label>
            <Select value={motoboyId} onValueChange={setMotoboyId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o motoboy" />
              </SelectTrigger>
              <SelectContent>
                {motoboysDisponiveis.map(m => (
                  <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroNota">Nº da Nota</Label>
              <Input
                id="numeroNota"
                value={numeroNota}
                onChange={(e) => setNumeroNota(e.target.value)}
                placeholder="12345"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cliente">Cliente</Label>
            <Input
              id="cliente"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Nome do cliente"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Rua, número, bairro"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="taxaEntrega">Taxa de Entrega (R$)</Label>
            <Input
              id="taxaEntrega"
              type="number"
              step="0.01"
              value={taxaEntrega}
              onChange={(e) => setTaxaEntrega(e.target.value)}
              placeholder="5.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observacao">Observação</Label>
            <Textarea
              id="observacao"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Instruções especiais..."
              rows={2}
            />
          </div>
          
          <Button type="submit" className="w-full">
            Adicionar Pedido
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
