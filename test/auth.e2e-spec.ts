import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/shared/config/prisma';
import * as bcrypt from 'bcryptjs';

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set in environment variables!');
  // Use a fallback for tests only
  process.env.JWT_SECRET = 'fallback-test-secret';
}
describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let uniqueEmail: string; // Variável para armazenar o email único

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    // Limpeza do banco de dados antes de cada teste
    await prisma.user.deleteMany();

    uniqueEmail = `test-${Date.now()}@example.com`; // Email único para cada teste
    await prisma.user.create({
      data: {
        email: uniqueEmail, // Usando email único
        password: await bcrypt.hash('correct-password', 10),
        name: 'Test User',
      },
    });
  });

  it('/auth/login (POST) - deve retornar token e dados do usuário com credenciais válidas', async () => {
    // Criação de um usuário de teste

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: uniqueEmail, // Usando o mesmo email do usuário criado
        password: 'correct-password',
      })
      .expect(200);

    const cookie = response.headers['set-cookie'][0];

    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('id');

    return cookie;
  });

  it('/auth/login (POST) - deve retornar 401 com credenciais inválidas', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'invalid@example.com',
        password: 'wrong-password',
      })
      .expect(401);

    expect(response.body).toHaveProperty(
      'message',
      'Email ou senha incorretas',
    );
  });

  it('/auth/logout (DELETE) - deve limpar o cookie de acesso', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: uniqueEmail, // Usando o mesmo email do usuário criado
        password: 'correct-password',
      })
      .expect(200);

    const cookie = loginResponse.headers['set-cookie'][0];

    const logoutResponse = await request(app.getHttpServer())
      .delete('/auth/logout')
      .set('Cookie', cookie)
      .expect(200);

    expect(logoutResponse.body).toHaveProperty(
      'message',
      'Logged out successfully',
    );
    expect(logoutResponse.headers['set-cookie'][0]).toMatch(/access_token=;/);
  });

  it('/auth/me (GET) - deve retornar informações do usuário autenticado', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: uniqueEmail, // Usando o mesmo email do usuário criado
        password: 'correct-password',
      })
      .expect(200);

    const cookie = loginResponse.headers['set-cookie'][0];

    const userInfoResponse = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', cookie)
      .expect(200);

    expect(userInfoResponse.body).toHaveProperty('email', uniqueEmail);
    expect(userInfoResponse.body).toHaveProperty('name', 'Test User');
  });

  it('/auth/me (GET) - deve retornar 401 se não autenticado', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
