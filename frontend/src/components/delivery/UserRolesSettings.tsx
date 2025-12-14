import { useState } from 'react';
import { 
  Users, Shield, ShieldCheck, ShieldAlert, Plus, 
  Trash2, Mail, Settings, Eye, Edit, Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
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

type UserRole = 'proprietario' | 'gerente' | 'operador';

interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  ativo: boolean;
  ultimoAcesso?: string;
}

interface Permission {
  id: string;
  nome: string;
  descricao: string;
  roles: UserRole[];
}

const PERMISSIONS: Permission[] = [
  { 
    id: 'dashboard', 
    nome: 'Dashboard', 
    descricao: 'Visualizar painel principal',
    roles: ['proprietario', 'gerente', 'operador']
  },
  { 
    id: 'pedidos_criar', 
    nome: 'Criar Pedidos', 
    descricao: 'Adicionar novos pedidos',
    roles: ['proprietario', 'gerente', 'operador']
  },
  { 
    id: 'pedidos_atribuir', 
    nome: 'Atribuir Pedidos', 
    descricao: 'Atribuir pedidos aos motoboys',
    roles: ['proprietario', 'gerente', 'operador']
  },
  { 
    id: 'motoboys_gerenciar', 
    nome: 'Gerenciar Motoboys', 
    descricao: 'Adicionar e remover motoboys',
    roles: ['proprietario', 'gerente']
  },
  { 
    id: 'relatorios', 
    nome: 'Relatórios', 
    descricao: 'Visualizar relatórios e fechamentos',
    roles: ['proprietario', 'gerente']
  },
  { 
    id: 'financeiro', 
    nome: 'Financeiro', 
    descricao: 'Gerenciar vales e pagamentos',
    roles: ['proprietario']
  },
  { 
    id: 'configuracoes', 
    nome: 'Configurações', 
    descricao: 'Alterar taxas e regras',
    roles: ['proprietario']
  },
  { 
    id: 'usuarios', 
    nome: 'Usuários', 
    descricao: 'Gerenciar usuários e permissões',
    roles: ['proprietario']
  },
];

export function UserRolesSettings() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  const [users, setUsers] = useState<User[]>([
    { 
      id: '1', 
      nome: 'Admin', 
      email: 'admin@loja.com', 
      role: 'proprietario', 
      ativo: true,
      ultimoAcesso: new Date().toISOString()
    },
    { 
      id: '2', 
      nome: 'Maria Silva', 
      email: 'maria@loja.com', 
      role: 'gerente', 
      ativo: true,
      ultimoAcesso: new Date(Date.now() - 3600000).toISOString()
    },
    { 
      id: '3', 
      nome: 'João Santos', 
      email: 'joao@loja.com', 
      role: 'operador', 
      ativo: true,
      ultimoAcesso: new Date(Date.now() - 7200000).toISOString()
    },
  ]);

  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    role: 'operador' as UserRole,
  });

  const handleAdd = () => {
    if (!novoUsuario.nome || !novoUsuario.email) {
      toast({
        title: 'Preencha todos os campos',
        variant: 'destructive',
      });
      return;
    }

    setUsers(prev => [...prev, {
      ...novoUsuario,
      id: Date.now().toString(),
      ativo: true,
    }]);
    setNovoUsuario({ nome: '', email: '', role: 'operador' });
    setOpen(false);
    toast({ title: 'Usuário adicionado com sucesso!' });
  };

  const handleRemove = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user?.role === 'proprietario' && users.filter(u => u.role === 'proprietario').length === 1) {
      toast({
        title: 'Não é possível remover',
        description: 'Deve haver pelo menos um proprietário.',
        variant: 'destructive',
      });
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== id));
    toast({ title: 'Usuário removido' });
  };

  const handleToggleAtivo = (id: string) => {
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, ativo: !u.ativo } : u
    ));
  };

  const handleChangeRole = (id: string, role: UserRole) => {
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, role } : u
    ));
    toast({ title: 'Permissão atualizada!' });
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'proprietario':
        return <Crown className="h-4 w-4 text-warning" />;
      case 'gerente':
        return <ShieldCheck className="h-4 w-4 text-primary" />;
      default:
        return <Shield className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'proprietario':
        return <Badge className="bg-warning/10 text-warning border-warning/20 gap-1"><Crown className="h-3 w-3" />Proprietário</Badge>;
      case 'gerente':
        return <Badge className="bg-primary/10 text-primary border-primary/20 gap-1"><ShieldCheck className="h-3 w-3" />Gerente</Badge>;
      default:
        return <Badge variant="outline" className="gap-1"><Shield className="h-3 w-3" />Operador</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Lista de Usuários */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Usuários ({users.length})</h2>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Usuário</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    value={novoUsuario.nome}
                    onChange={(e) => setNovoUsuario(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input
                    type="email"
                    value={novoUsuario.email}
                    onChange={(e) => setNovoUsuario(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nível de Acesso</Label>
                  <Select
                    value={novoUsuario.role}
                    onValueChange={(value: UserRole) => setNovoUsuario(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operador">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Operador
                        </div>
                      </SelectItem>
                      <SelectItem value="gerente">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4" />
                          Gerente
                        </div>
                      </SelectItem>
                      <SelectItem value="proprietario">
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4" />
                          Proprietário
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleAdd}>
                  Adicionar Usuário
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="h-[300px]">
          <div className="space-y-2 pr-4">
            {users.map((user) => (
              <div 
                key={user.id} 
                className={`bg-secondary/30 rounded-lg p-4 ${!user.ativo ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {getRoleIcon(user.role)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.nome}</span>
                        {getRoleBadge(user.role)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                      {user.ultimoAcesso && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Último acesso: {new Date(user.ultimoAcesso).toLocaleString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={user.ativo}
                      onCheckedChange={() => handleToggleAtivo(user.id)}
                    />
                    {user.role !== 'proprietario' && (
                      <Select
                        value={user.role}
                        onValueChange={(value: UserRole) => handleChangeRole(user.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="operador">Operador</SelectItem>
                          <SelectItem value="gerente">Gerente</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleRemove(user.id)}
                      disabled={user.role === 'proprietario' && users.filter(u => u.role === 'proprietario').length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Matriz de Permissões */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Matriz de Permissões</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Permissão</th>
                <th className="text-center py-3 px-4">
                  <div className="flex items-center justify-center gap-1">
                    <Crown className="h-4 w-4 text-warning" />
                    Proprietário
                  </div>
                </th>
                <th className="text-center py-3 px-4">
                  <div className="flex items-center justify-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Gerente
                  </div>
                </th>
                <th className="text-center py-3 px-4">
                  <div className="flex items-center justify-center gap-1">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    Operador
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((perm) => (
                <tr key={perm.id} className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <p className="font-medium">{perm.nome}</p>
                    <p className="text-xs text-muted-foreground">{perm.descricao}</p>
                  </td>
                  <td className="text-center py-3 px-4">
                    {perm.roles.includes('proprietario') ? (
                      <Eye className="h-4 w-4 mx-auto text-success" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="text-center py-3 px-4">
                    {perm.roles.includes('gerente') ? (
                      <Eye className="h-4 w-4 mx-auto text-success" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="text-center py-3 px-4">
                    {perm.roles.includes('operador') ? (
                      <Eye className="h-4 w-4 mx-auto text-success" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
