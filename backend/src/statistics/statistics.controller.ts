import { Controller, Get } from '@nestjs/common';
import { PedidoService } from '../pedido/pedido.service';
import { MotoboyService } from '../motoboy/motoboy.service';
import { StatusPedido } from '../pedido/pedido.entity';
import { StatusMotoboy } from '../motoboy/motoboy.entity';

@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly pedidoService: PedidoService,
    private readonly motoboyService: MotoboyService,
  ) {}

  @Get()
  async getStatistics() {
    const pedidos = await this.pedidoService.findAll();
    const motoboys = await this.motoboyService.findAll();

    const totalPedidos = pedidos.length;
    const pedidosEntregues = pedidos.filter(
      (p) => p.status === StatusPedido.ENTREGUE,
    ).length;
    const pedidosPendentes = pedidos.filter(
      (p) =>
        p.status === StatusPedido.PENDENTE || p.status === StatusPedido.EM_ROTA,
    ).length;
    const valorTotal = pedidos.reduce((acc, p) => acc + p.valor, 0);
    const taxasTotal = pedidos.reduce((acc, p) => acc + p.taxaEntrega, 0);
    const motoboyAtivos = motoboys.filter(
      (m) => m.status !== StatusMotoboy.AUSENTE,
    ).length;

    return {
      totalPedidos,
      pedidosEntregues,
      pedidosPendentes,
      valorTotal,
      taxasTotal,
      motoboyAtivos,
    };
  }
}
