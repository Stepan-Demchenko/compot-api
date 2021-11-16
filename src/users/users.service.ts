import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getConnection, InsertResult, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AwsFileService } from '../images/aws-file.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly connection: Connection,
    private readonly awsFileService: AwsFileService,
  ) {}

  async create(createUserDto: CreateUserDto, avatar: Express.Multer.File): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const salt = await bcrypt.genSalt();
      let { password } = createUserDto;
      password = await this.hashPassword(password, salt);
      const user = this.userRepository.create({
        ...createUserDto,
        password,
        salt,
      });
      debugger;
      const userAvatar: InsertResult = await this.awsFileService.uploadPublicFile(avatar.buffer);
      const idOfCreatedUser = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(user)
        .returning('id')
        .execute();
      await queryRunner.manager.createQueryBuilder().relation(User, 'avatar').of(idOfCreatedUser).set(userAvatar);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.code === '23505') {
        throw new HttpException(`User with ${createUserDto.email} email is already exist`, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(error, HttpStatus.FORBIDDEN);
    } finally {
      await queryRunner.release();
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
