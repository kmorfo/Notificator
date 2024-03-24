import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateAppUserDto } from 'src/applications/dto/create-app-user.dto';
import { CreateUserDto, ResetPasswordDto } from 'src/auth/dto';
import { ErrorHandlingService } from 'src/common/error-handling/error-handling.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';


@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly errorHandlingService: ErrorHandlingService
  ) { }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find()
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true, username: true, roles: true }
    });
  }

  async findOneById(id: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({ id });
  }

  async create(createUserDto: CreateUserDto): Promise<User | undefined> {
    return await this._createUser(createUserDto);
  }

  async updateUserRoles(user: User, roles: string[]) {
    user.roles = roles;
    this.userRepository.save(user);
  }

  async updateUserPassword(id: string, resetPasswordDto: ResetPasswordDto): Promise<User | undefined> {
    try {
      const user = await this.findOneById(id);
      if (!user) throw new NotFoundException(`User not found`);

      user.password = bcrypt.hashSync(resetPasswordDto.password, 10);

      await this.userRepository.save(user);
      delete user.password;
      return user;
    } catch (error) {
      this.errorHandlingService.handleDBExceptions(error);
    }
  }

  private async _createUser(createUserDto: CreateUserDto): Promise<User | undefined> {
    const { password, ...userData } = createUserDto;

    const user = this.userRepository.create({
      ...userData,
      password: bcrypt.hashSync(password, 10)
    });

    await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  async setUserEmailVerified(id: string): Promise<User | undefined> {
    try {
      const user = await this.findOneById(id);
      if (!user) throw new NotFoundException(`User not found`);
      user.isEmailVerified = true;

      await this.userRepository.save(user);

      return user;
    } catch (error) {
      this.errorHandlingService.handleDBExceptions(error);
    }
  }

  async update(updateUserDto: UpdateUserDto, user: User): Promise<User | undefined> {
    try {
      const { email, username, isActive } = updateUserDto;

      //If email is changed, check if exist
      if (email != undefined && email != user.email && await this.findOneByEmail(email) != undefined)
        throw new BadRequestException('The Email sent belongs to another user');

      const userUpdated = await this.userRepository.preload({ id: user.id, email: email, username: username, isActive: isActive })
      this.userRepository.save(userUpdated)

      return userUpdated;
    } catch (error) {
      this.errorHandlingService.handleDBExceptions(error);
    }
  }

  async createAppUser(createAppUserDto: CreateAppUserDto): Promise<User | undefined> {
    try {
      const { applicationId, ...createUserDTO } = createAppUserDto
      const user = await this._createUser(createUserDTO);

      return user;
    } catch (error) {
      this.errorHandlingService.handleDBExceptions(error)
    }
  }

  async removeUserById(id: string): Promise<User | undefined> {
    const user = await this.findOneById(id);
    if (!user) throw new NotFoundException(`User with ${id} not found`);

    user.isActive = false;
    this.userRepository.save(user);
    return user;
  }

}
