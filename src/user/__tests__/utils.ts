import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';

export const generateFakeUser = (): User => {
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

export const generateFakeDataToCreateUser = (): CreateUserDto => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    isOng: faker.datatype.boolean(),
  };
};

export const fakeDBUsers: User[] = Array.from({ length: 3 }, generateFakeUser);
