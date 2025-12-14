import { useState } from 'react';
import { 
  Plug, Check, X, RefreshCw, ExternalLink, Copy, 
  AlertCircle, Webhook, Settings, Globe, Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface Integration {
  id: string;
  nome: string;
  descricao: string;
  icone: 'ze' | 'ifood' | 'uber' | 'whatsapp' | 'webhook';
  status: 'conectado' | 'desconectado' | 'erro';
  ultimaSync?: string;
  pedidosHoje?: number;
}

export function IntegrationSettings() {
  const { toast } = useToast();
  
  const [integrations, setIntegrations] = useState<Integration[]>([
    { 
      id: '1', 
      nome: 'Zé Delivery', 
      descricao: 'Receba pedidos do Zé Delivery automaticamente',
      icone: 'ze',
      status: 'desconectado' 
    },
    { 
      id: '2', 
      nome: 'iFood', 
      descricao: 'Integração com pedidos do iFood',
      icone: 'ifood',
      status: 'desconectado' 
    },
    { 
      id: '3', 
      nome: 'Uber Eats', 
      descricao: 'Receba pedidos do Uber Eats',
      icone: 'uber',
      status: 'desconectado' 
    },
    { 
      id: '4', 
      nome: 'WhatsApp', 
      descricao: 'Pedidos via WhatsApp/Loja própria',
      icone: 'whatsapp',
      status: 'conectado',
      ultimaSync: new Date().toISOString(),
      pedidosHoje: 12
    },
  ]);

  const [webhookUrl] = useState('https://api.deliverycontrol.com/webhook/v1/pedidos/abc123');
  const [webhookSecret] = useState('whsec_9a8b7c6d5e4f3g2h1i0j');
  const [testMode, setTestMode] = useState(false);

  const handleConnect = (id: string) => {
    setIntegrations(prev => prev.map(int => 
      int.id === id 
        ? { ...int, status: 'conectado', ultimaSync: new Date().toISOString(), pedidosHoje: 0 }
        : int
    ));
    toast({ title: 'Integração conectada com sucesso!' });
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(prev => prev.map(int => 
      int.id === id 
        ? { ...int, status: 'desconectado', ultimaSync: undefined, pedidosHoje: undefined }
        : int
    ));
    toast({ title: 'Integração desconectada' });
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copiado!` });
  };

  const handleTestWebhook = () => {
    toast({ 
      title: 'Webhook de teste enviado!',
      description: 'Verifique seu endpoint para confirmar o recebimento.',
    });
  };

  const getIcone = (icone: string) => {
    switch (icone) {
      case 'ze':
        return <span className="text-xl">🍺</span>;
      case 'ifood':
        return <span className="text-xl">🍔</span>;
      case 'uber':
        return <span className="text-xl">🚗</span>;
      case 'whatsapp':
        return <Smartphone className="h-5 w-5 text-success" />;
      default:
        return <Globe className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'conectado':
        return <Badge className="bg-success/10 text-success border-success/20 gap-1"><Check className="h-3 w-3" />Conectado</Badge>;
      case 'erro':
        return <Badge variant="destructive" className="gap-1"><X className="h-3 w-3" />Erro</Badge>;
      default:
        return <Badge variant="outline" className="gap-1">Desconectado</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Integrações de Plataformas */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Plug className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Integrações de Plataformas</h2>
        </div>

        <ScrollArea className="h-[300px]">
          <div className="space-y-3 pr-4">
            {integrations.map((integration) => (
              <div 
                key={integration.id} 
                className="bg-secondary/30 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-background/50 flex items-center justify-center">
                      {getIcone(integration.icone)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{integration.nome}</h3>
                        {getStatusBadge(integration.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {integration.descricao}
                      </p>
                      {integration.status === 'conectado' && integration.ultimaSync && (
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <RefreshCw className="h-3 w-3" />
                            Sincronizado: {new Date(integration.ultimaSync).toLocaleTimeString('pt-BR')}
                          </span>
                          {integration.pedidosHoje !== undefined && (
                            <span>{integration.pedidosHoje} pedidos hoje</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {integration.status === 'conectado' ? (
                      <>
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDisconnect(integration.id)}
                        >
                          Desconectar
                        </Button>
                      </>
                    ) : (
                      <Button 
                        size="sm" 
                        className="gap-2"
                        onClick={() => handleConnect(integration.id)}
                      >
                        <Plug className="h-4 w-4" />
                        Conectar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Webhook API */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Webhook className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">API Webhook</h2>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="test-mode" className="text-sm">Modo de Teste</Label>
            <Switch 
              id="test-mode"
              checked={testMode}
              onCheckedChange={setTestMode}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-secondary/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm">URL do Webhook</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1 h-7"
                onClick={() => handleCopy(webhookUrl, 'URL')}
              >
                <Copy className="h-3 w-3" />
                Copiar
              </Button>
            </div>
            <Input 
              value={webhookUrl}
              readOnly
              className="font-mono text-xs bg-background/50"
            />
          </div>

          <div className="bg-secondary/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm">Chave Secreta</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1 h-7"
                onClick={() => handleCopy(webhookSecret, 'Chave')}
              >
                <Copy className="h-3 w-3" />
                Copiar
              </Button>
            </div>
            <Input 
              value={webhookSecret}
              type="password"
              readOnly
              className="font-mono text-xs bg-background/50"
            />
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Formato do Payload</p>
              <p className="text-muted-foreground text-xs mt-1">
                Envie pedidos via POST com os campos: numeroNota, cliente, endereco, valor, telefone
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={handleTestWebhook}>
              <RefreshCw className="h-4 w-4" />
              Testar Webhook
            </Button>
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Ver Documentação
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
