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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login de usuário' })
  @ApiResponse({
    status: 200,
    description: 'Login bem-sucedido, retorna token de acesso.',
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async create(@Body() signInDTO: signInDTO, @Res() response: Response) {
    const tokenData = await this.authService.validateUser(signInDTO);

    this.setCookies(response, tokenData.access_token);
    return response.json(tokenData);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obter informações do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Informações do usuário retornadas com sucesso.',
  })
  public async infoUser(@User() user: AuthenticatedUser) {
    return user;
  }

  @UseGuards(AuthGuard)
  @Delete('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout de usuário' })
  @ApiResponse({ status: 200, description: 'Logout bem-sucedido.' })
  public remove(@Res() response: Response) {
    this.logout(response);
    return response.json({ message: 'Logged out successfully' });
  }
  private setCookies(response: Response, access_token: string) {
    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }

  private logout(response: Response) {
    response.clearCookie('access_token');
  }
}
