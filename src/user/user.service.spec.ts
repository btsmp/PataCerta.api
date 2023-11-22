import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../shared/config/prisma';
import { BadRequestException } from '@nestjs/common';

const prismaMock = {
  user: {
    create: jest.fn(),
    update: jest.fn(),
  },
};
describe('UserService', () => {
  let sut: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    sut = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('method create', () => {
    it('should be able to create a new user', async () => {
      const testUser: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'passwordExample',
        isOng: false,
      };

      prismaMock.user.create.mockReturnValue(testUser);

      const response = await sut.create(testUser);

      expect(response).toBeDefined();
      expect(response).toEqual(testUser);

      expect(prismaMock.user.create).toHaveBeenCalled();
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: testUser,
      });
    });

    it('should not be able to create a new user if any required field is missing', async () => {
      const testUser: CreateUserDto = {
        email: 'test@example.com',
        name: undefined,
        password: 'passwordExample',
        isOng: false,
      };

      try {
        await sut.create(testUser);
        fail('Expected exception was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Invalid input data');
      }

      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });
  });
});
