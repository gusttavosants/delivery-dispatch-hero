import { useState, useCallback } from 'react';
import { Motoboy, Pedido } from '@/types/delivery';

const generateId = () => Math.random().toString(36).substr(2, 9);

export function useDelivery() {
  const [motoboys, setMotoboys] = useState<Motoboy[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const adicionarMotoboy = useCallback((dados: Omit<Motoboy, 'id' | 'totalEntregas' | 'totalValor'>) => {
    const novoMotoboy: Motoboy = {
      ...dados,
      id: generateId(),
      totalEntregas: 0,
      totalValor: 0,
    };
    setMotoboys(prev => [...prev, novoMotoboy]);
    return novoMotoboy;
  }, []);

  const removerMotoboy = useCallback((id: string) => {
    setMotoboys(prev => prev.filter(m => m.id !== id));
    setPedidos(prev => prev.filter(p => p.motoboyId !== id));
  }, []);

  const atualizarStatusMotoboy = useCallback((id: string, status: Motoboy['status']) => {
    setMotoboys(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  }, []);

  const adicionarPedido = useCallback((dados: Omit<Pedido, 'id' | 'horario'>) => {
    const novoPedido: Pedido = {
      ...dados,
      id: generateId(),
      horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    setPedidos(prev => [...prev, novoPedido]);
    
    // Atualiza totais do motoboy
    setMotoboys(prev => prev.map(m => {
      if (m.id === dados.motoboyId) {
        return {
          ...m,
          totalEntregas: m.totalEntregas + 1,
          totalValor: m.totalValor + dados.taxaEntrega,
        };
      }
      return m;
    }));
    
    return novoPedido;
  }, []);

  const atualizarStatusPedido = useCallback((id: string, status: Pedido['status']) => {
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  }, []);

  const removerPedido = useCallback((id: string) => {
    const pedido = pedidos.find(p => p.id === id);
    if (pedido) {
      setPedidos(prev => prev.filter(p => p.id !== id));
      setMotoboys(prev => prev.map(m => {
        if (m.id === pedido.motoboyId) {
          return {
            ...m,
            totalEntregas: Math.max(0, m.totalEntregas - 1),
            totalValor: Math.max(0, m.totalValor - pedido.taxaEntrega),
          };
        }
        return m;
      }));
    }
  }, [pedidos]);

  const getPedidosPorMotoboy = useCallback((motoboyId: string) => {
    return pedidos.filter(p => p.motoboyId === motoboyId);
  }, [pedidos]);

  const getEstatisticas = useCallback(() => {
    const totalPedidos = pedidos.length;
    const pedidosEntregues = pedidos.filter(p => p.status === 'entregue').length;
    const pedidosPendentes = pedidos.filter(p => p.status === 'pendente' || p.status === 'em_rota').length;
    const valorTotal = pedidos.reduce((acc, p) => acc + p.valor, 0);
    const taxasTotal = pedidos.reduce((acc, p) => acc + p.taxaEntrega, 0);
    
    return {
      totalPedidos,
      pedidosEntregues,
      pedidosPendentes,
      valorTotal,
      taxasTotal,
      motoboyAtivos: motoboys.filter(m => m.status !== 'ausente').length,
    };
  }, [pedidos, motoboys]);

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
