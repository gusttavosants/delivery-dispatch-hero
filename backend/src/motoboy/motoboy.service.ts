import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Motoboy } from './motoboy.entity';
import { CreateMotoboyDto, UpdateMotoboyDto } from './motoboy.dto';

@Injectable()
export class MotoboyService {
  constructor(
    @InjectRepository(Motoboy)
    private motoboyRepository: Repository<Motoboy>,
  ) {}

  async findAll(): Promise<Motoboy[]> {
    return this.motoboyRepository.find();
  }

  async findOne(id: string): Promise<Motoboy> {
    const motoboy = await this.motoboyRepository.findOne({ where: { id } });
    if (!motoboy) {
      throw new Error('Motoboy not found');
    }
    return motoboy;
  }

  async create(createMotoboyDto: CreateMotoboyDto): Promise<Motoboy> {
    const motoboy = this.motoboyRepository.create(createMotoboyDto);
    return this.motoboyRepository.save(motoboy);
  }

  async update(
    id: string,
    updateMotoboyDto: UpdateMotoboyDto,
  ): Promise<Motoboy> {
    await this.motoboyRepository.update(id, updateMotoboyDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const motoboy = await this.findOne(id);
    await this.motoboyRepository.remove(motoboy);
  }
}
