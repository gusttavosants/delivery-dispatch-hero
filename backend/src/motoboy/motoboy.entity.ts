import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum StatusMotoboy {
  DISPONIVEL = 'disponivel',
  EM_ENTREGA = 'em_entrega',
  AUSENTE = 'ausente',
}

@Entity()
export class Motoboy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  telefone: string;

  @Column()
  placa: string;

  @Column({
    type: 'enum',
    enum: StatusMotoboy,
    default: StatusMotoboy.DISPONIVEL,
  })
  status: StatusMotoboy;

  @Column({ default: 0 })
  totalEntregas: number;

  @Column({ type: 'float', default: 0 })
  totalValor: number;
}
