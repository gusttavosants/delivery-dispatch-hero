import { Motoboy, Pedido, StatusMotoboy, StatusPedido } from '@/types/delivery';

const API_BASE = 'http://localhost:3000';

export const fetchMotoboys = async (): Promise<Motoboy[]> => {
  const res = await fetch(`${API_BASE}/motoboys`);
  if (!res.ok) throw new Error('Failed to fetch motoboys');
  return res.json();
};

export const createMotoboy = async (data: Omit<Motoboy, 'id' | 'totalEntregas' | 'totalValor'>): Promise<Motoboy> => {
  const res = await fetch(`${API_BASE}/motoboys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create motoboy');
  return res.json();
};

export const updateMotoboy = async (id: string, data: Partial<Pick<Motoboy, 'nome' | 'telefone' | 'placa' | 'status'>>): Promise<Motoboy> => {
  const res = await fetch(`${API_BASE}/motoboys/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update motoboy');
  return res.json();
};

export const deleteMotoboy = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/motoboys/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete motoboy');
};

export const fetchPedidos = async (): Promise<Pedido[]> => {
  const res = await fetch(`${API_BASE}/pedidos`);
  if (!res.ok) throw new Error('Failed to fetch pedidos');
  return res.json();
};

export const createPedido = async (data: Omit<Pedido, 'id' | 'horario'>): Promise<Pedido> => {
  const res = await fetch(`${API_BASE}/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create pedido');
  return res.json();
};

export const updatePedido = async (id: string, data: Partial<Pick<Pedido, 'motoboyId' | 'numeroNota' | 'cliente' | 'endereco' | 'valor' | 'taxaEntrega' | 'status' | 'observacao'>>): Promise<Pedido> => {
  const res = await fetch(`${API_BASE}/pedidos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update pedido');
  return res.json();
};

export const deletePedido = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/pedidos/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete pedido');
};

export const fetchStats = async (): Promise<{
  totalPedidos: number;
  pedidosEntregues: number;
  pedidosPendentes: number;
  valorTotal: number;
  taxasTotal: number;
  motoboyAtivos: number;
}> => {
  const res = await fetch(`${API_BASE}/statistics`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
};
