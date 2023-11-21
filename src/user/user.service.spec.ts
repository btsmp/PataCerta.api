import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { faker } from '@faker-js/faker';
import { PrismaService } from '../shared/config/prisma';
import { User } from '@prisma/client';

const UserMock: User = {
  id: faker.string.uuid(),
  cpf: null,
  name: 'Test User',
  email: 'test@example.com',
  password: 'passwordExample',
  isOng: false,
  isValidated: faker.datatype.boolean(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const prismaMock = {
  user: {
    create: jest.fn().mockReturnValue(UserMock),
    update: jest.fn().mockReturnValue(UserMock),
  },
};
describe('UserService', () => {
  let sut: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    sut = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
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

      const response = await sut.create(testUser);
      console.log(response);
      console.log(UserMock);

      expect(response).toBeDefined();
      expect(response).toMatchObject(UserMock);
      expect(response).toEqual(UserMock);

      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(prisma.user.create).toHaveBeenCalled();
    });

    it('should not be able to create a new user', async () => {
      const testUser = {
        email: undefined,
        name: 'Test User',
        password: 'passwordExample',
        isOng: false,
      };
      jest.spyOn(prisma.user, 'create').mockReturnValue(undefined);

      const response = await sut.create(testUser);
      console.log(response);
      expect(response).not.toBeDefined();
    });
  });

  it('should update a user', () => {});
});
