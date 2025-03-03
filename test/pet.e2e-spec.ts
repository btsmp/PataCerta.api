import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/shared/config/prisma';
import * as bcrypt from 'bcryptjs';

describe('PetController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cookie: string; // Variável para armazenar o cookie de autenticação

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
    await prisma.pet.deleteMany();

    // Criação de um usuário de teste
    await prisma.user.create({
      data: {
        email: 'valid@example.com',
        password: await bcrypt.hash('correct-password', 10),
        name: 'Test User',
      },
    });

    // Login para obter o cookie de autenticação
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'valid@example.com',
        password: 'correct-password',
      })
      .expect(200);

    cookie = loginResponse.headers['set-cookie'][0]; // Captura o cookie
  });

  it('/pets (POST) - deve criar um novo pet', async () => {
    const newPet = {
      name: 'Fido',
      age: 2,
      type: 'dog',
      ownerId: 'some-user-id', // Certifique-se de que o usuário existe
    };

    const response = await request(app.getHttpServer())
      .post('/pets')
      .set('Cookie', cookie) // Envia o cookie de autenticação
      .send(newPet)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', newPet.name);
  });

  it('/pets (PATCH) - deve editar um pet existente', async () => {
    // Primeiro, crie um pet para editar
    const createdPetResponse = await request(app.getHttpServer())
      .post('/pets')
      .set('Cookie', cookie)
      .send({
        name: 'Fido',
        age: 2,
        type: 'dog',
        ownerId: 'some-user-id',
      })
      .expect(201);

    const petId = createdPetResponse.body.id; // Captura o ID do pet criado

    const updatedPet = {
      name: 'Fido Updated',
      age: 3,
      type: 'dog',
    };

    const response = await request(app.getHttpServer())
      .patch(`/pets/${petId}`)
      .set('Cookie', cookie) // Envia o cookie de autenticação
      .send(updatedPet)
      .expect(200);

    expect(response.body).toHaveProperty('id', petId);
    expect(response.body).toHaveProperty('name', updatedPet.name);
  });

  it('/pets (DELETE) - deve deletar um pet existente', async () => {
    // Primeiro, crie um pet para deletar
    const createdPetResponse = await request(app.getHttpServer())
      .post('/pets')
      .set('Cookie', cookie)
      .send({
        name: 'Fido',
        age: 2,
        type: 'dog',
        ownerId: 'some-user-id',
      })
      .expect(201);

    const petId = createdPetResponse.body.id; // Captura o ID do pet criado

    const response = await request(app.getHttpServer())
      .delete(`/pets/${petId}`)
      .set('Cookie', cookie) // Envia o cookie de autenticação
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Pet deleted successfully');
  });

  afterAll(async () => {
    await app.close();
  });
});
