import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/modules/users/service/users.service';
import { JwtService } from '@nestjs/jwt';
import { Encryption } from 'src/shared/helpers/encryption';
import { SignUpDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { ErrorCode } from 'src/shared/enums/error-codes.enum';
import AppError from 'src/shared/helpers/app-error';

jest.mock('src/shared/helpers/encryption');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;

  const mockUser = {
    _id: '123456',
    username: 'testuser',
    password: 'hashed-password',
    githubAccessKey: 'encrypted-key',
    toJSON: function () {
      return this;
    }
  };

  const mockUsersService = {
    createUser: jest.fn().mockResolvedValue(mockUser),
    updateUser: jest.fn().mockResolvedValue(mockUser),
    getUserByUsername: jest.fn().mockResolvedValue(mockUser),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockImplementation(payload => `token-${payload.userId}`),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
  });

  describe('signUp', () => {
    it('should create user and return tokens', async () => {
      (Encryption.hashData as jest.Mock).mockResolvedValue('hashed-password');
      (Encryption.encryptData as jest.Mock).mockReturnValue('encrypted-key');

      const dto: SignUpDto = {
        username: 'testuser',
        password: 'password123',
        githubAccessKey: 'github-key'
      };

      const result = await service.signUp(dto);

      expect(result).toEqual({
        id: mockUser._id,
        username: mockUser.username,
        accessToken: `token-${mockUser._id}`,
        refreshToken: `token-${mockUser._id}`
      });

      expect(mockUsersService.createUser).toHaveBeenCalled();
      expect(mockUsersService.updateUser).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return tokens for valid login', async () => {
      (Encryption.verifyData as jest.Mock).mockResolvedValue(true);

      const dto: LoginDto = {
        username: 'testuser',
        password: 'password123',
      };

      const result = await service.login(dto);

      expect(result).toEqual({
        id: mockUser._id,
        username: mockUser.username,
        accessToken: `token-${mockUser._id}`,
        refreshToken: `token-${mockUser._id}`
      });
    });

    it('should throw if password is invalid', async () => {
      (Encryption.verifyData as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ username: 'testuser', password: 'wrongpass' })
      ).rejects.toThrow(new AppError(ErrorCode['0004'], "Invalid login credentials"));
    });
  });
});