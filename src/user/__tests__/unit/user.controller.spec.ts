import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../user.controller';
import { UserService } from '../../user.service';

describe('UserController', () => {
  let sut: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    sut = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });
});
