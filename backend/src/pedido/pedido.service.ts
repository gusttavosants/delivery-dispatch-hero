import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './pedido.entity';
import { CreatePedidoDto, UpdatePedidoDto } from './pedido.dto';
import { MotoboyService } from '../motoboy/motoboy.service';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,
    private motoboyService: MotoboyService,
  ) {}

  async findAll(): Promise<Pedido[]> {
    return this.pedidoRepository.find({ relations: ['motoboy'] });
  }

  async findOne(id: string): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({
      where: { id },
      relations: ['motoboy'],
    });
    if (!pedido) {
      throw new Error('Pedido not found');
    }
    return pedido;
  }

  async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    const pedido = this.pedidoRepository.create({
      ...createPedidoDto,
      horario: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
    const savedPedido = await this.pedidoRepository.save(pedido);
    // Update motoboy totals
    const motoboy = await this.motoboyService.findOne(savedPedido.motoboyId);
    motoboy.totalEntregas += 1;
    motoboy.totalValor += savedPedido.taxaEntrega;
    await this.motoboyService.update(savedPedido.motoboyId, {
      totalEntregas: motoboy.totalEntregas,
      totalValor: motoboy.totalValor,
    });
    return savedPedido;
  }

  async update(id: string, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    await this.pedidoRepository.update(id, updatePedidoDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const pedido = await this.findOne(id);
    // Update motoboy totals
    const motoboy = await this.motoboyService.findOne(pedido.motoboyId);
    motoboy.totalEntregas = Math.max(0, motoboy.totalEntregas - 1);
    motoboy.totalValor = Math.max(0, motoboy.totalValor - pedido.taxaEntrega);
    await this.motoboyService.update(pedido.motoboyId, {
      totalEntregas: motoboy.totalEntregas,
      totalValor: motoboy.totalValor,
    });
    await this.pedidoRepository.remove(pedido);
  }

  async findByMotoboy(motoboyId: string): Promise<Pedido[]> {
    return this.pedidoRepository.find({
      where: { motoboyId },
      relations: ['motoboy'],
    });
  }
}
