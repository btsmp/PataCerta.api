import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { faker } from '@faker-js/faker';
import { PrismaService } from '../shared/config/prisma';

const generateFakeUser = (): CreateUserDto => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 6 }),
    isOng: faker.datatype.boolean(),
  };
};
const fakeUsers: CreateUserDto[] = Array.from({ length: 3 }, generateFakeUser);
const prismaMock = {
  user: {
    create: jest.fn().mockReturnValue(fakeUsers[0]),
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

  it('should create a new user', async () => {
    const response = await sut.create(fakeUsers[0]);

    expect(response).toBe(fakeUsers[0]);
    expect(prisma.user.create).toHaveBeenCalledTimes(1);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: fakeUsers[0],
    });
  });
});
