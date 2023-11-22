import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../shared/config/prisma';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

const generateFakeUser = (): User => {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    cpf: faker.number.int({ min: 11111111111, max: 99999999999 }).toString(),
    name: faker.person.fullName(),
    password: faker.internet.password({ length: 6 }),
    isOng: faker.datatype.boolean(),
    createdAt: new Date(),
    updatedAt: new Date(),
    isValidated: faker.datatype.boolean(),
  };
};

const fakeUsers: User[] = Array.from({ length: 3 }, generateFakeUser);

const prismaMock = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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

  describe('create', () => {
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
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Invalid input data');
      }
      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });
  });

  describe('list', () => {
    it('should be able to list all users', async () => {
      prismaMock.user.findMany.mockReturnValue(fakeUsers);
      const response = await sut.findAll();
      expect(response).toBeDefined();
      expect(response).toEqual(fakeUsers);
      expect(prismaMock.user.findMany).toHaveBeenCalled();
    });

    it('should be able to find one specific user by id', async () => {
      prismaMock.user.findFirst.mockReturnValue(fakeUsers[2]);
      const id = fakeUsers[2].id;
      const response = await sut.findOne(id);
      expect(response).toBeDefined();
      expect(response).toMatchObject(fakeUsers[2]);
      expect(prismaMock.user.findFirst).toHaveBeenCalled();
    });

    it('should throw an error if id provided is invalid', async () => {
      const id = faker.string.uuid();
      try {
        await sut.findOne(id);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toBe(`User ${id} does not exist`);
      }
      expect(prismaMock.user.findFirst).toHaveBeenCalled();
      expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should be able to update a field', async () => {
      const existingUser: User = generateFakeUser();
      const userUpdateMock: UpdateUserDto = {
        email: 'teste2@gmail.com',
      };
      prismaMock.user.findFirst.mockResolvedValue(existingUser);
      prismaMock.user.update.mockResolvedValue({
        ...existingUser,
        ...userUpdateMock,
      });
      const updatedUser = await sut.update(existingUser.id, userUpdateMock);

      expect(updatedUser).toBeDefined();
      expect(updatedUser).toEqual({ ...existingUser, ...userUpdateMock });

      expect(prismaMock.user.update).toHaveBeenCalled();
      expect(prismaMock.user.update).toHaveBeenCalledTimes(1);

      expect(prismaMock.user.findFirst).toHaveBeenCalled();
    });

    it('should throw an error if user to update is not found', async () => {
      const nonExistentUserId = faker.string.uuid();
      const updatedUserData: UpdateUserDto = {
        email: faker.internet.email(),
      };
      prismaMock.user.findFirst.mockResolvedValue(null);
      try {
        await sut.update(nonExistentUserId, updatedUserData);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toBe(`User ${nonExistentUserId} does not exist`);
      }
      expect(prismaMock.user.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should be able to delete a user', async () => {});
    it('should not be able to delete a user if a non existent user', async () => {});
  });
});
