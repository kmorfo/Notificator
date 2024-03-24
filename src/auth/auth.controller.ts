import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { Auth, GetUser } from 'src/auth/decorators';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, ResetPasswordDto } from './dto';
import { User } from 'src/users/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiResponse({ status: 201, description: 'Create API account', type: User })
  @ApiResponse({ status: 400, description: 'Invalid parameters' })
  createUser(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  @ApiResponse({ status: 201, description: 'Login API', type: User })
  @ApiResponse({ status: 400, description: 'Invalid parameters' })
  @ApiResponse({ status: 401, description: 'Credentials are nor valid(password)' })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @ApiResponse({ status: 200, description: 'User is active, renew token', type: User })
  @ApiResponse({ status: 401, description: 'Credentials are nor valid(password)' })
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }


  @Get('forgot-password/:email')
  @ApiResponse({ status: 200, description: 'Email send', type: Boolean })
  @ApiResponse({ status: 401, description: 'Email does not exist' })
  public async sendEmailForgotPassword(
    @Param('email') email: string
    ) {
    return await this.authService.forgotPassword(email);
  }

  @Get('reset-password/:token')
  @ApiResponse({ status: 200, description: 'User reset password correct', type: User })
  @ApiResponse({ status: 401, description: 'Token is not valid' })
  public async resetPasswordToken(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Param('token') token: string
  ) {
    return await this.authService.resetPasswordToken(token, resetPasswordDto);
  }

  @Get('send-verification/:email')
  @ApiResponse({ status: 200, description: 'Email send', type: Boolean })
  @ApiResponse({ status: 401, description: 'Email does not exist' })
  public async sendValidationEmail(
    @Param('email') email: string
    ) {
    return await this.authService.sendEmailVerification(email);
  }

  @Get('verify-email/:token')
  @ApiResponse({ status: 200, description: 'User email validation successfully', type: User })
  @ApiResponse({ status: 401, description: 'Token is not valid' })
  public async verifyEmailToken(
    @Param('token') token: string
  ) {
    return await this.authService.verifyEmailToken(token);
  }

}
