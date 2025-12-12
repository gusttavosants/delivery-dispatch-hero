import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MotoboyService } from '../motoboy/motoboy.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private motoboyService: MotoboyService,
    private jwtService: JwtService,
  ) {}

  async validateUser(telefone: string, password: string): Promise<any> {
    try {
      const motoboy = await this.motoboyService.findByTelefone(telefone);
      if (motoboy && await bcrypt.compare(password, motoboy.password)) {
        const { password, ...result } = motoboy;
        return result;
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  async login(user: any) {
    const payload = { telefone: user.telefone, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
