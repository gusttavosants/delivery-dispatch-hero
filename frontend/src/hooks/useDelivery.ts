import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api';
import { Motoboy, Pedido, StatusMotoboy, StatusPedido } from '@/types/delivery';

export function useDelivery() {
  const queryClient = useQueryClient();
  const { data: motoboys = [] } = useQuery({
    queryKey: ['motoboys'],
    queryFn: api.fetchMotoboys,
  });
  const { data: pedidos = [] } = useQuery({
    queryKey: ['pedidos'],
    queryFn: api.fetchPedidos,
  });
  const { data: stats = { totalPedidos: 0, pedidosEntregues: 0, pedidosPendentes: 0, valorTotal: 0, taxasTotal: 0, motoboyAtivos: 0 } } = useQuery({
    queryKey: ['stats'],
    queryFn: api.fetchStats,
  });
  const createMotoboyMutation = useMutation({
    mutationFn: api.createMotoboy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motoboys'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
  const deleteMotoboyMutation = useMutation({
    mutationFn: api.deleteMotoboy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motoboys'] });
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
  const updateMotoboyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Pick<Motoboy, 'nome' | 'telefone' | 'placa' | 'status'>> }) => api.updateMotoboy(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motoboys'] });
    },
  });
  const createPedidoMutation = useMutation({
    mutationFn: api.createPedido,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['motoboys'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
  const updatePedidoMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Pick<Pedido, 'motoboyId' | 'numeroNota' | 'cliente' | 'endereco' | 'valor' | 'taxaEntrega' | 'status' | 'observacao'>> }) => api.updatePedido(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['motoboys'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
  const deletePedidoMutation = useMutation({
    mutationFn: api.deletePedido,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['motoboys'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
  const adicionarMotoboy = async (data: Omit<Motoboy, 'id' | 'totalEntregas' | 'totalValor'>) => {
    return await createMotoboyMutation.mutateAsync(data);
  };
  const removerMotoboy = async (id: string) => {
    await deleteMotoboyMutation.mutateAsync(id);
  };
  const atualizarStatusMotoboy = async (id: string, status: StatusMotoboy) => {
    await updateMotoboyMutation.mutateAsync({ id, data: { status } });
  };
  const adicionarPedido = async (data: Omit<Pedido, 'id' | 'horario'>) => {
    return await createPedidoMutation.mutateAsync(data);
  };
  const atualizarStatusPedido = async (id: string, status: StatusPedido) => {
    await updatePedidoMutation.mutateAsync({ id, data: { status } });
  };
  const removerPedido = async (id: string) => {
    await deletePedidoMutation.mutateAsync(id);
  };
  const getPedidosPorMotoboy = (motoboyId: string) => {
    return pedidos.filter(p => p.motoboyId === motoboyId);
  };
  const getEstatisticas = () => {
    return stats;
  };
  return {
    motoboys,
    pedidos,
    adicionarMotoboy,
    removerMotoboy,
    atualizarStatusMotoboy,
    adicionarPedido,
    atualizarStatusPedido,
    removerPedido,
    getPedidosPorMotoboy,
    getEstatisticas,
  };
}
