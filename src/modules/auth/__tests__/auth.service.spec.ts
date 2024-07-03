import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../../shared/config/prisma';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

// Mock do PrismaService
jest.mock('../../../shared/config/prisma');

// Mock do JwtService
jest.mock('@nestjs/jwt');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should throw UnauthorizedException for invalid credentials', async () => {
      const signInDTO = {
        email: 'invalid@example.com',
        password: 'invalid-password',
      };

      // Mock do método findFirst para retornar null (usuário não encontrado)
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValueOnce(null);

      await expect(service.validateUser(signInDTO)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for incorrect password', async () => {
      const signInDTO = {
        email: 'valid@example.com',
        password: 'incorrect-password',
      };
      const user = {
        id: 'test-uuid',
        name: 'John Doe',
        email: 'valid@example.com',
        password: await bcrypt.hash('correct-password', 10),
        isValidated: true,
        isOng: false,
        cpf: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock do método findFirst para retornar um usuário
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValueOnce(user);

      await expect(service.validateUser(signInDTO)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('should return token for valid credentials', async () => {
      const signInDTO = {
        email: 'valid@example.com',
        password: 'correct-password',
      };
      const user = {
        id: 'test-uuid',
        name: 'John Doe',
        email: 'valid@example.com',
        password: await bcrypt.hash('correct-password', 10),
        isValidated: true,
        isOng: false,
        cpf: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock do método findFirst para retornar um usuário
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValueOnce(user);

      // Mock do método signAsync para retornar um token
      const token = 'mocked-access-token';
      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce(token);

      const result = await service.validateUser(signInDTO);

      expect(result.access_token).toEqual(token);
      expect(result.user).toEqual({
        id: user.id,
        name: user.name,
        email: user.email,
        isValidate: user.isValidated,
        isOng: user.isOng,
      });
    });
  });

  // Adicione mais testes para outros métodos conforme necessário

  afterEach(() => {
    jest.clearAllMocks();
  });
});
