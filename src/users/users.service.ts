import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    try {
      const salt = await bcrypt.genSalt();
      let { password } = createUserDto;
      password = await this.hashPassword(password, salt);
      const user = this.userRepository.create({
        ...createUserDto,
        password,
        salt,
      });
      await getConnection().createQueryBuilder().insert().into(User).values(user).execute();
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException(`User with ${createUserDto.email} email is already exist`, HttpStatus.FORBIDDEN);
      }
    }
  }

  findOne(user: Partial<User>) {
    return this.userRepository.findOne(user);
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

  async getFullUserData(email: string): Promise<User> {
    return await getConnection()
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.email = :email', { email })
      .addSelect(['user.password', 'user.salt'])
      .getOne();
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
