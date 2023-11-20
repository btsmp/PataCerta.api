import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { faker } from '@faker-js/faker';

describe('UserService', () => {
  let sut: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    sut = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should create a new user', async () => {
    const newUser: CreateUserDto = {
      cpf: faker.number.int({ min: 10000000000, max: 99999999999 }).toString(),
      email: faker.internet.email(),
      isOng: faker.datatype.boolean(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
    };

    const createdUser = await sut.create(newUser);
    expect(createdUser).toBeDefined();
    expect(createdUser.name).toEqual(newUser.name);
    expect(createdUser.cpf).toEqual(newUser.cpf);
    expect(createdUser.email).toEqual(newUser.email);
    expect(createdUser.password).toEqual(newUser.password);
    expect(createdUser.isOng).toEqual(newUser.isOng);
  });
});
