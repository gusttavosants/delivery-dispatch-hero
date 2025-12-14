import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bike, Settings as SettingsIcon, ArrowLeft, Users, DollarSign, 
  Save, Plus, Trash2, Phone, CreditCard, Plug, Shield, Calculator
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { IntegrationSettings } from '@/components/delivery/IntegrationSettings';
import { UserRolesSettings } from '@/components/delivery/UserRolesSettings';
import { AdvancedFeeSettings } from '@/components/delivery/AdvancedFeeSettings';

interface MotoboyCadastro {
  id: string;
  nome: string;
  telefone: string;
  placa: string;
  pix: string;
  banco: string;
}

const Settings = () => {
  const { toast } = useToast();
  
  const [motoboysCadastro, setMotoboysCadastro] = useState<MotoboyCadastro[]>([
    { id: '1', nome: 'João Silva', telefone: '(11) 99999-0001', placa: 'ABC-1234', pix: 'joao@email.com', banco: 'Nubank' },
    { id: '2', nome: 'Carlos Santos', telefone: '(11) 99999-0002', placa: 'DEF-5678', pix: '11999990002', banco: 'Itaú' },
  ]);

  const [novoMotoboy, setNovoMotoboy] = useState<Omit<MotoboyCadastro, 'id'>>({
    nome: '',
    telefone: '',
    placa: '',
    pix: '',
    banco: '',
  });

  const handleAddMotoboy = () => {
    if (!novoMotoboy.nome || !novoMotoboy.telefone || !novoMotoboy.placa) {
      toast({
        title: 'Preencha os campos obrigatórios',
        description: 'Nome, telefone e placa são obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    setMotoboysCadastro(prev => [...prev, { ...novoMotoboy, id: Date.now().toString() }]);
    setNovoMotoboy({ nome: '', telefone: '', placa: '', pix: '', banco: '' });
    toast({ title: 'Motoboy cadastrado com sucesso!' });
  };

  const handleRemoveMotoboy = (id: string) => {
    setMotoboysCadastro(prev => prev.filter(m => m.id !== id));
    toast({ title: 'Motoboy removido' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <SettingsIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Configurações</h1>
                <p className="text-xs text-muted-foreground">
                  Gerencie motoboys, taxas, integrações e permissões
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="motoboys" className="w-full">
          <TabsList className="glass mb-6 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="motoboys" className="gap-2">
              <Users className="h-4 w-4" />
              Motoboys
            </TabsTrigger>
            <TabsTrigger value="taxas" className="gap-2">
              <Calculator className="h-4 w-4" />
              Taxas Avançadas
            </TabsTrigger>
            <TabsTrigger value="integracoes" className="gap-2">
              <Plug className="h-4 w-4" />
              Integrações
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="gap-2">
              <Shield className="h-4 w-4" />
              Usuários
            </TabsTrigger>
          </TabsList>

          <TabsContent value="motoboys">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Formulário de cadastro */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Cadastrar Novo Motoboy
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome *</Label>
                      <Input 
                        placeholder="Nome completo"
                        value={novoMotoboy.nome}
                        onChange={(e) => setNovoMotoboy(prev => ({ ...prev, nome: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Telefone *</Label>
                      <Input 
                        placeholder="(11) 99999-0000"
                        value={novoMotoboy.telefone}
                        onChange={(e) => setNovoMotoboy(prev => ({ ...prev, telefone: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Placa da Moto *</Label>
                    <Input 
                      placeholder="ABC-1234"
                      value={novoMotoboy.placa}
                      onChange={(e) => setNovoMotoboy(prev => ({ ...prev, placa: e.target.value.toUpperCase() }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Chave PIX</Label>
                      <Input 
                        placeholder="CPF, e-mail ou telefone"
                        value={novoMotoboy.pix}
                        onChange={(e) => setNovoMotoboy(prev => ({ ...prev, pix: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Banco</Label>
                      <Input 
                        placeholder="Nome do banco"
                        value={novoMotoboy.banco}
                        onChange={(e) => setNovoMotoboy(prev => ({ ...prev, banco: e.target.value }))}
                      />
                    </div>
                  </div>

                  <Button className="w-full gap-2" onClick={handleAddMotoboy}>
                    <Plus className="h-4 w-4" />
                    Cadastrar Motoboy
                  </Button>
                </div>
              </div>

              {/* Lista de motoboys cadastrados */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Motoboys Cadastrados ({motoboysCadastro.length})
                </h2>

                <ScrollArea className="h-[400px]">
                  <div className="space-y-3 pr-4">
                    {motoboysCadastro.map((motoboy) => (
                      <div key={motoboy.id} className="bg-secondary/30 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Bike className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{motoboy.nome}</h3>
                              <p className="text-xs text-muted-foreground">
                                Placa: {motoboy.placa}
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveMotoboy(motoboy.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {motoboy.telefone}
                          </div>
                          {motoboy.pix && (
                            <div className="flex items-center gap-1">
                              <CreditCard className="h-3 w-3" />
                              {motoboy.banco}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="taxas">
            <AdvancedFeeSettings />
          </TabsContent>

          <TabsContent value="integracoes">
            <IntegrationSettings />
          </TabsContent>

          <TabsContent value="usuarios">
            <UserRolesSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
