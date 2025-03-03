import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/shared/config/prisma';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  it('/user (POST) - deve criar um novo usuário', async () => {
    const newUser = {
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User',
    };

    const response = await request(app.getHttpServer())
      .post('/user')
      .send(newUser)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email', newUser.email);
  });

  afterAll(async () => {
    await prisma.user.deleteMany(); // Limpeza dos dados de teste
    await app.close();
  });
});
