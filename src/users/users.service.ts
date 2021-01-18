import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const salt = await bcrypt.genSalt();
      let { password } = createUserDto;
      password = await this.hashPassword(password, salt);
      const user = this.userRepository.create({
        ...createUserDto,
        password,
        salt,
      });
      return this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException(
          `User with ${createUserDto.email} email is already exist`,
          HttpStatus.FORBIDDEN,
        );
      }
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email });
  }
}
