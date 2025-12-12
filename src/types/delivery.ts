export interface Motoboy {
  id: string;
  nome: string;
  telefone: string;
  placa: string;
  status: 'disponivel' | 'em_entrega' | 'ausente';
  totalEntregas: number;
  totalValor: number;
}

export interface Pedido {
  id: string;
  motoboyId: string;
  numeroNota: string;
  cliente: string;
  endereco: string;
  valor: number;
  taxaEntrega: number;
  status: 'pendente' | 'em_rota' | 'entregue' | 'cancelado';
  horario: string;
  observacao?: string;
}

export type StatusMotoboy = Motoboy['status'];
export type StatusPedido = Pedido['status'];
