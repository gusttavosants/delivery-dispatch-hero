import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bike, Settings as SettingsIcon, ArrowLeft, Users, DollarSign, 
  Save, Plus, Trash2, Phone, CreditCard 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface MotoboyCadastro {
  id: string;
  nome: string;
  telefone: string;
  placa: string;
  pix: string;
  banco: string;
}

interface TaxaConfig {
  taxaBase: number;
  taxaPorKm: number;
  kmGratis: number;
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

  const [taxaConfig, setTaxaConfig] = useState<TaxaConfig>({
    taxaBase: 5.00,
    taxaPorKm: 1.00,
    kmGratis: 5,
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

  const handleSaveTaxas = () => {
    toast({ title: 'Configurações de taxas salvas!' });
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
                  Gerencie motoboys e regras de taxas
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="motoboys" className="w-full">
          <TabsList className="glass mb-6">
            <TabsTrigger value="motoboys" className="gap-2">
              <Users className="h-4 w-4" />
              Gestão de Motoboys
            </TabsTrigger>
            <TabsTrigger value="taxas" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Taxas e Regras
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
            <div className="max-w-2xl">
              <div className="glass rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Configuração de Taxas
                </h2>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Taxa Base por Entrega</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">R$</span>
                      <Input 
                        type="number"
                        step="0.50"
                        value={taxaConfig.taxaBase}
                        onChange={(e) => setTaxaConfig(prev => ({ ...prev, taxaBase: parseFloat(e.target.value) }))}
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">por entrega</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Valor fixo pago ao motoboy por cada entrega realizada
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Taxa por Km Adicional</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">R$</span>
                      <Input 
                        type="number"
                        step="0.10"
                        value={taxaConfig.taxaPorKm}
                        onChange={(e) => setTaxaConfig(prev => ({ ...prev, taxaPorKm: parseFloat(e.target.value) }))}
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">por km</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Valor adicional por quilômetro após a distância gratuita
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Km Gratuitos</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number"
                        value={taxaConfig.kmGratis}
                        onChange={(e) => setTaxaConfig(prev => ({ ...prev, kmGratis: parseInt(e.target.value) }))}
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">km</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Distância incluída na taxa base (sem cobrança adicional)
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="bg-secondary/30 rounded-lg p-4 mb-4">
                      <h4 className="font-medium mb-2">Exemplo de cálculo:</h4>
                      <p className="text-sm text-muted-foreground">
                        Entrega de 8km = R$ {taxaConfig.taxaBase.toFixed(2)} + ({Math.max(0, 8 - taxaConfig.kmGratis)} km × R$ {taxaConfig.taxaPorKm.toFixed(2)}) = <span className="font-bold text-foreground">R$ {(taxaConfig.taxaBase + Math.max(0, 8 - taxaConfig.kmGratis) * taxaConfig.taxaPorKm).toFixed(2)}</span>
                      </p>
                    </div>

                    <Button className="gap-2" onClick={handleSaveTaxas}>
                      <Save className="h-4 w-4" />
                      Salvar Configurações
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
