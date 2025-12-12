import { useState } from 'react';
import { UserPlus } from 'lucide-react';
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
import { Motoboy } from '@/types/delivery';

interface AddMotoboyDialogProps {
  onAdd: (dados: Omit<Motoboy, 'id' | 'totalEntregas' | 'totalValor'>) => Promise<void>;
}

export function AddMotoboyDialog({ onAdd }: AddMotoboyDialogProps) {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [placa, setPlaca] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !telefone.trim() || !placa.trim()) return;
    
    await onAdd({
      nome: nome.trim(),
      telefone: telefone.trim().toUpperCase(),
      placa: placa.trim().toUpperCase(),
      status: 'disponivel',
    });
    
    setNome('');
    setTelefone('');
    setPlaca('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Adicionar Motoboy
        </Button>
      </DialogTrigger>
      <DialogContent className="glass">
        <DialogHeader>
          <DialogTitle>Adicionar Motoboy do Dia</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do motoboy"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(00) 00000-0000"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="placa">Placa da Moto</Label>
            <Input
              id="placa"
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
              placeholder="ABC-1234"
              className="uppercase"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Adicionar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
