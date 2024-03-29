import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { CreateUserDto, LoginUserDto, ResetPasswordDto } from './dto';
import { ErrorHandlingService } from 'src/common/error-handling/error-handling.service';
import { JwtPayload } from './interfaces';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('RecordsService');

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly errorHandlingService: ErrorHandlingService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);

      delete user.password;

      return { ...user, token: this.getJwToken({ id: user.id }) };
    } catch (error) {
      this.errorHandlingService.handleDBExceptions(error)
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.usersService.findOneByEmail(email);

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');

    delete user.password;

    console.log(`El mamoncete ${user.username} se acaba de conectar`);
    return { ...user, token: this.getJwToken({ id: user.id }) };
  }

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException('Email does not exist');

    //Creates a 10 minutes valid token 
    const token = this.getJwToken({ id: user.id }, { expiresIn: '10 minutes' });

    this.mailService.sendEmailForgotPassword(user, token);

    return true;
  }

  async resetPasswordToken(token: string, resetPasswordDto: ResetPasswordDto): Promise<User> {
    try {
      const { id } = this.jwtService.verify(token);

      if (!id) throw new UnauthorizedException('Token is not valid');

      const user = this.usersService.updateUserPassword(id, resetPasswordDto);

      return user;
    } catch (error) {
      throw new UnauthorizedException('Token is not valid');
    }
  }

  async sendEmailVerification(email: string): Promise<boolean> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException('Email does not exist');

    //Here we can check if the user is already verified before send email again

    //Creates a 60 minutes valid token 
    const token = this.getJwToken({ id: user.id }, { expiresIn: '60 minutes' });

    this.mailService.sendEmailVerification(user, token);

    return true;
  }

  async verifyEmailToken(token: string): Promise<User> {
    try {
      const { id } = this.jwtService.verify(token);

      if (!id) throw new UnauthorizedException('Token is not valid');

      const user = this.usersService.setUserEmailVerified(id);

      return user;
    } catch (error) {
      throw new UnauthorizedException('Token is not valid');
    }
  }


  async checkAuthStatus(user: User) {
    return { ...user, token: this.getJwToken({ id: user.id }) };
  }

  private getJwToken(payload: JwtPayload, options?: JwtSignOptions) {
    return this.jwtService.sign(payload, options);
  }

}
