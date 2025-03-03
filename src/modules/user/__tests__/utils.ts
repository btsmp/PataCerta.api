import { CreateUserDto } from '../dto/create-user.dto';
import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';

export const generateFakeUser = (): User => {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    cpf: faker.number.int({ min: 11111111111, max: 99999999999 }).toString(),
    name: faker.person.fullName(),
    password: faker.internet.password({ length: 6 }),
    createdAt: new Date(),
    updatedAt: new Date(),
    age: faker.number.int({ min: 12, max: 99 }),
    aboutMe: faker.person.bio(),
    profilePicUrl: faker.internet.domainWord(),
    city: faker.location.city(),
    uf: faker.string.alpha({ length: 2 }),
    role: 'USER',
  };
};

export const generateFakeDataToCreateUser = (): CreateUserDto => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
};

export const fakeDBUsers: User[] = Array.from({ length: 3 }, generateFakeUser);
