import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { Response } from 'express';

// Mock do AuthService
jest.mock('../auth.service');

// Mock do AuthGuard
jest.mock('../../../guards/auth.guard');

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('create', () => {
    it('should return user data and set cookies', async () => {
      const signInDTO = {
        email: 'john@example.com',
        password: 'testpassword',
      };
      const tokenData = {
        access_token: 'mocked-access-token',
        user: {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
        },
      };

      // Mock do método validateUser para retornar os dados do token
      jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(tokenData);

      const responseMock: Partial<Response> = {
        cookie: jest.fn(),
        json: jest.fn(),
      };

      await controller.create(signInDTO, responseMock as Response);

      expect(authService.validateUser).toHaveBeenCalledWith(signInDTO);
      expect(responseMock.cookie).toHaveBeenCalledWith(
        'access_token',
        tokenData.access_token,
        { httpOnly: true },
      );
      expect(responseMock.json).toHaveBeenCalledWith(tokenData.user);
    });
  });

  describe('remove', () => {
    it('should clear cookies', () => {
      const responseMock: Partial<Response> = {
        clearCookie: jest.fn(),
        json: jest.fn(),
      };

      controller.remove(responseMock as Response);

      expect(responseMock.clearCookie).toHaveBeenCalledWith('access_token');
      expect(responseMock.json).toHaveBeenCalledWith({
        message: 'Logged out successfully',
      });
    });
  });
});
