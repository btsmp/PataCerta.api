import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { signInDTO } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthGuard } from '../../guards/auth.guard';
import { User } from '../../decorators/user.decorator';
import { AuthenticatedUser } from '../../interfaces/authenticated-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async create(@Body() signInDTO: signInDTO, @Res() response: Response) {
    const tokenData = await this.authService.validateUser(signInDTO);
    console.log(tokenData.user);
    this.setCookies(response, tokenData.access_token);
    return response.json(tokenData.user);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  public async infoUser(@User() user: AuthenticatedUser) {
    return user;
  }

  @UseGuards(AuthGuard)
  @Delete('logout')
  @HttpCode(HttpStatus.OK)
  public remove(@Res() response: Response) {
    this.logout(response);
    return response.json({ message: 'Logged out successfully' });
  }
  private setCookies(response: Response, access_token: string) {
    response.cookie('access_token', access_token, { httpOnly: true });
  }

  private logout(response: Response) {
    response.clearCookie('access_token');
  }
}
