import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { CreateUserDto } from '../../dto/create-user.dto';
import { PrismaService } from 'src/shared/config/prisma';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user.service';
import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';
import {
  generateFakeDataToCreateUser,
  fakeDBUsers,
  generateFakeUser,
} from '../utils';

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
      const testUser = generateFakeDataToCreateUser();
      prismaMock.user.create.mockReturnValue(fakeDBUsers[0]);
      const response = await sut.create(testUser);

      expect(response).toBeDefined();
      expect(response).toMatchObject(fakeDBUsers[0]);

      expect(prismaMock.user.create).toHaveBeenCalled();
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: testUser,
      });
    });

    it('should not be able to create a new user if any required field is missing', async () => {
      const testUser: CreateUserDto = {
        email: undefined,
        name: 'John Doe',
        password: 'password',
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
      prismaMock.user.findMany.mockReturnValue(fakeDBUsers);
      const response = await sut.findAll();
      expect(response).toBeDefined();
      expect(response).toEqual(fakeDBUsers);
      expect(prismaMock.user.findMany).toHaveBeenCalled();
    });

    it('should be able to find one specific user by id', async () => {
      prismaMock.user.findFirst.mockReturnValue(fakeDBUsers[2]);
      const id = fakeDBUsers[2].id;
      const response = await sut.findOne(id);
      expect(response).toBeDefined();
      expect(response).toMatchObject(fakeDBUsers[2]);
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
    it('should be able to delete a user', async () => {
      const existingUser = generateFakeUser();
      prismaMock.user.findFirst.mockResolvedValue(existingUser);

      await sut.delete(existingUser.id);

      expect(prismaMock.user.delete).toHaveBeenCalledWith({
        where: { id: existingUser.id },
      });
    });
    it('should throw an error if user to delete is not found', async () => {
      const nonExistentUserId = faker.string.uuid();
      prismaMock.user.findFirst.mockResolvedValue(null);

      try {
        await sut.delete(nonExistentUserId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toBe(`User ${nonExistentUserId} does not exist`);
      }
      expect(prismaMock.user.delete).not.toHaveBeenCalled();
    });
  });
});
