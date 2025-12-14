import { useState } from 'react';
import { 
  FileText, Download, Printer, Mail, Calendar, 
  Bike, Package, DollarSign, Clock, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Vale } from './ValesModule';

interface MotoboyFechamento {
  id: string;
  nome: string;
  entregas: number;
  taxas: number;
  valesPendentes: number;
  valorFinal: number;
  tempoMedio: number;
}

interface PDFGeneratorProps {
  motoboys: Array<{ id: string; nome: string; totalValor: number; entregas: number }>;
  pedidos: any[];
  vales: Vale[];
}

export function PDFGenerator({ motoboys, pedidos, vales }: PDFGeneratorProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedMotoboy, setSelectedMotoboy] = useState<string | null>(null);
  const [emailTo, setEmailTo] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Calcular fechamento por motoboy
  const calcularFechamento = (motoboyId: string): MotoboyFechamento | null => {
    const motoboy = motoboys.find(m => m.id === motoboyId);
    if (!motoboy) return null;

    const pedidosMotoboy = pedidos.filter(p => p.motoboyId === motoboyId && p.status === 'entregue');
    const valesPendentes = vales
      .filter(v => v.motoboyId === motoboyId && v.status === 'pendente')
      .reduce((acc, v) => acc + v.valor, 0);

    const taxas = pedidosMotoboy.reduce((acc, p) => acc + (p.taxa || 5), 0);
    const valorFinal = taxas - valesPendentes;

    return {
      id: motoboy.id,
      nome: motoboy.nome,
      entregas: pedidosMotoboy.length,
      taxas,
      valesPendentes,
      valorFinal,
      tempoMedio: 22, // Simulado
    };
  };

  const handleGeneratePDF = () => {
    if (!selectedMotoboy) {
      toast({
        title: 'Selecione um motoboy',
        variant: 'destructive',
      });
      return;
    }

    const fechamento = calcularFechamento(selectedMotoboy);
    if (!fechamento) return;

    // Simula geração de PDF
    const pdfContent = `
FECHAMENTO DIÁRIO - ${new Date(selectedDate).toLocaleDateString('pt-BR')}
============================================

Motoboy: ${fechamento.nome}

RESUMO DE ENTREGAS
------------------
Total de Entregas: ${fechamento.entregas}
Tempo Médio: ${fechamento.tempoMedio} min

FINANCEIRO
----------
Taxas de Entrega: R$ ${fechamento.taxas.toFixed(2)}
Vales/Adiantamentos: R$ ${fechamento.valesPendentes.toFixed(2)}
------------------
VALOR FINAL: R$ ${fechamento.valorFinal.toFixed(2)}

${fechamento.valorFinal >= 0 ? 'A PAGAR ao motoboy' : 'A RECEBER do motoboy'}
    `.trim();

    // Criar blob e download
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fechamento_${fechamento.nome.replace(/\s/g, '_')}_${selectedDate}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: 'PDF gerado com sucesso!' });
  };

  const handleSendEmail = () => {
    if (!emailTo || !selectedMotoboy) {
      toast({
        title: 'Preencha o e-mail e selecione o motoboy',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'E-mail enviado!',
      description: `Fechamento enviado para ${emailTo}`,
    });
    setEmailTo('');
  };

  const handlePrint = () => {
    if (!selectedMotoboy) {
      toast({
        title: 'Selecione um motoboy',
        variant: 'destructive',
      });
      return;
    }

    const fechamento = calcularFechamento(selectedMotoboy);
    if (!fechamento) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Fechamento - ${fechamento.nome}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px; }
            .row { display: flex; justify-content: space-between; padding: 5px 0; }
            .total { font-size: 1.2em; font-weight: bold; border-top: 2px solid #000; padding-top: 10px; margin-top: 10px; }
            .status { text-align: center; padding: 10px; background: #f0f0f0; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FECHAMENTO DIÁRIO</h1>
            <p>${new Date(selectedDate).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          
          <div class="section">
            <div class="section-title">MOTOBOY</div>
            <p><strong>${fechamento.nome}</strong></p>
          </div>
          
          <div class="section">
            <div class="section-title">RESUMO DE ENTREGAS</div>
            <div class="row"><span>Total de Entregas:</span><span>${fechamento.entregas}</span></div>
            <div class="row"><span>Tempo Médio:</span><span>${fechamento.tempoMedio} min</span></div>
          </div>
          
          <div class="section">
            <div class="section-title">FINANCEIRO</div>
            <div class="row"><span>Taxas de Entrega:</span><span>R$ ${fechamento.taxas.toFixed(2)}</span></div>
            <div class="row"><span>Vales/Adiantamentos:</span><span>- R$ ${fechamento.valesPendentes.toFixed(2)}</span></div>
            <div class="row total">
              <span>VALOR FINAL:</span>
              <span>R$ ${fechamento.valorFinal.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="status">
            <strong>${fechamento.valorFinal >= 0 ? '✓ A PAGAR ao motoboy' : '⚠ A RECEBER do motoboy'}</strong>
          </div>
          
          <p style="text-align: center; margin-top: 40px; font-size: 12px; color: #666;">
            Documento gerado automaticamente pelo DeliveryControl
          </p>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const fechamentoAtual = selectedMotoboy ? calcularFechamento(selectedMotoboy) : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          Gerar Fechamento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Faturamento do Motoboy
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Seleção */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Motoboy</Label>
              <Select
                value={selectedMotoboy || ''}
                onValueChange={setSelectedMotoboy}
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
              <Label>Data</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>

          {/* Preview do Fechamento */}
          {fechamentoAtual && (
            <div className="bg-secondary/30 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bike className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{fechamentoAtual.nome}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(selectedDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-background/50 rounded-lg p-3 text-center">
                  <Package className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <p className="text-xl font-bold">{fechamentoAtual.entregas}</p>
                  <p className="text-xs text-muted-foreground">Entregas</p>
                </div>
                <div className="bg-background/50 rounded-lg p-3 text-center">
                  <Clock className="h-5 w-5 mx-auto mb-1 text-warning" />
                  <p className="text-xl font-bold">{fechamentoAtual.tempoMedio} min</p>
                  <p className="text-xs text-muted-foreground">Tempo Médio</p>
                </div>
                <div className="bg-background/50 rounded-lg p-3 text-center">
                  <DollarSign className="h-5 w-5 mx-auto mb-1 text-success" />
                  <p className="text-xl font-bold">R$ {fechamentoAtual.taxas.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Taxas</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Taxas de Entrega</span>
                  <span className="font-medium">R$ {fechamentoAtual.taxas.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-destructive">
                  <span>Vales/Adiantamentos</span>
                  <span className="font-medium">- R$ {fechamentoAtual.valesPendentes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border text-lg font-bold">
                  <span>Valor Final</span>
                  <span className={fechamentoAtual.valorFinal >= 0 ? 'text-success' : 'text-destructive'}>
                    R$ {fechamentoAtual.valorFinal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
                fechamentoAtual.valorFinal >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
              }`}>
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">
                  {fechamentoAtual.valorFinal >= 0 ? 'A PAGAR ao motoboy' : 'A RECEBER do motoboy'}
                </span>
              </div>
            </div>
          )}

          {/* Enviar por e-mail */}
          {fechamentoAtual && (
            <div className="flex items-center gap-2">
              <Input
                type="email"
                placeholder="E-mail do motoboy"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
              />
              <Button variant="outline" onClick={handleSendEmail} className="gap-2">
                <Mail className="h-4 w-4" />
                Enviar
              </Button>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-2">
            <Button className="flex-1 gap-2" onClick={handleGeneratePDF} disabled={!selectedMotoboy}>
              <Download className="h-4 w-4" />
              Baixar PDF
            </Button>
            <Button variant="outline" className="gap-2" onClick={handlePrint} disabled={!selectedMotoboy}>
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
