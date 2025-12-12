import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Motoboy } from '../motoboy/motoboy.entity';

export enum StatusPedido {
  PENDENTE = 'pendente',
  EM_ROTA = 'em_rota',
  ENTREGUE = 'entregue',
  CANCELADO = 'cancelado',
}

@Entity()
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  motoboyId: string;

  @ManyToOne(() => Motoboy)
  @JoinColumn({ name: 'motoboyId' })
  motoboy: Motoboy;

  @Column()
  numeroNota: string;

  @Column()
  cliente: string;

  @Column()
  endereco: string;

  @Column({ type: 'float' })
  valor: number;

  @Column({ type: 'float' })
  taxaEntrega: number;

  @Column({
    type: 'enum',
    enum: StatusPedido,
    default: StatusPedido.PENDENTE,
  })
  status: StatusPedido;

  @Column()
  horario: string;

  @Column({ nullable: true })
  observacao?: string;
}
