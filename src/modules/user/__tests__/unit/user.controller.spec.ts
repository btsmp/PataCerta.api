import { fakeDBUsers, generateFakeDataToCreateUser } from '../utils';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UserController } from '../../user.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../../../../guards/auth.guard';

describe('UserController', () => {
  let sut: UserController;

  const userServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const jwtServiceMock = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        AuthGuard,
      ],
    }).compile();

    sut = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should be able to create a new user', async () => {
    const userDTO = generateFakeDataToCreateUser();
    userServiceMock.create.mockReturnValue(fakeDBUsers[0]);
    const response = await sut.create(userDTO);
    expect(response).toBeDefined();
  });

  it('should be able to find all users', async () => {
    userServiceMock.findAll.mockReturnValue(fakeDBUsers);
    const response = await sut.findAll();

    expect(response).toMatchObject(fakeDBUsers);
  });

  it('should be able to find one user by id', async () => {
    const userId = fakeDBUsers[0].id;
    userServiceMock.findOne.mockReturnValue(fakeDBUsers[0]);

    const response = await sut.findOne(userId);

    expect(response).toMatchObject(fakeDBUsers[0]);
    expect(response.id).toEqual(userId);
  });

  it('should be able to update an existing user', async () => {
    const user: AuthenticatedUser = {
      email: fakeDBUsers[0].email,
      id: fakeDBUsers[0].id,
      name: fakeDBUsers[0].name,
    };
    const userDTO: UpdateUserDto = {
      email: 'user@example.com',
    };
    userServiceMock.update.mockReturnValue({ ...fakeDBUsers[0], ...userDTO });

    const response = await sut.update(user, userDTO);

    expect(response).toEqual({ ...fakeDBUsers[0], ...userDTO });
  });

  it('should be able to delete a user', async () => {
    const userId = fakeDBUsers[2].id;
    userServiceMock.delete.mockReturnValue(fakeDBUsers[2]);

    const response = await sut.remove(userId);

    expect(response).toBeDefined();
  });
});
