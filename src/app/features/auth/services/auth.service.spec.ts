import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AlertService } from '../../../shared/services/alert.service';
import { LoginSignupModalService } from './login-signup-modal.service';
import { UserRole, IUser } from '../interface';
import { provideHttpClient } from '@angular/common/http';
import * as dbModule from '../../../db/app.db'; // <-- import db module to spy on it

describe('AuthService (Standalone)', () => {
  let service: AuthService;
  let mockLoginModalService: jasmine.SpyObj<LoginSignupModalService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;

  const mockUser: IUser = {
    id: 1,
    email: 'test@test.com',
    password: '1234',
    name: 'Test User',
    role: UserRole.Renter,
  };

  beforeEach(() => {
    mockLoginModalService = jasmine.createSpyObj<LoginSignupModalService>(
      'LoginSignupModalService',
      ['openLogin', 'openSignup']
    );
    mockAlertService = jasmine.createSpyObj<AlertService>('AlertService', [
      'success',
      'error',
    ]);

    // Clear localStorage before each test
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        AuthService,
        { provide: LoginSignupModalService, useValue: mockLoginModalService },
        { provide: AlertService, useValue: mockAlertService },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load user from localStorage on init', () => {
    localStorage.setItem('currentUser', JSON.stringify(mockUser));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        AuthService,
        { provide: LoginSignupModalService, useValue: mockLoginModalService },
        { provide: AlertService, useValue: mockAlertService },
      ],
    });

    const newService = TestBed.inject(AuthService);
    expect(newService.currentUser()).toEqual(mockUser);
  });

  describe('#saveUser', () => {
    it('should add user if not exists', async () => {
      spyOn(dbModule.db.users, 'where').and.returnValue({
        equalsIgnoreCase: () => ({
          toArray: () => Promise.resolve([]),
        }),
      } as any);

      spyOn(dbModule.db.users, 'add').and.returnValue(
        Promise.resolve(1) as any
      );

      const result = await service.saveUser(mockUser);
      expect(result.success).toBeTrue();
      expect(dbModule.db.users.add).toHaveBeenCalledWith(mockUser);
    });

    it('should not add user if email exists', async () => {
      spyOn(dbModule.db.users, 'where').and.returnValue({
        equalsIgnoreCase: () => ({
          toArray: () => Promise.resolve([mockUser]),
        }),
      } as any);

      spyOn(dbModule.db.users, 'add');

      const result = await service.saveUser(mockUser);
      expect(result.success).toBeFalse();
      expect(result.message).toBe('user already exists');
      expect(dbModule.db.users.add).not.toHaveBeenCalled();
    });
  });

  describe('#loginUser', () => {
    it('should return user if email and password match', async () => {
      spyOn(dbModule.db.users, 'where').and.returnValue({
        equalsIgnoreCase: () => ({
          first: () => Promise.resolve(mockUser),
        }),
      } as any);

      const user = await service.loginUser({
        email: mockUser.email,
        password: mockUser.password,
      });
      expect(user).toEqual(mockUser);
    });

    it('should return null if password does not match', async () => {
      spyOn(dbModule.db.users, 'where').and.returnValue({
        equalsIgnoreCase: () => ({
          first: () => Promise.resolve({ ...mockUser, password: 'wrong' }),
        }),
      } as any);

      const user = await service.loginUser({
        email: mockUser.email,
        password: mockUser.password,
      });
      expect(user).toBeNull();
    });

    it('should return null if user not found', async () => {
      spyOn(dbModule.db.users, 'where').and.returnValue({
        equalsIgnoreCase: () => ({
          first: () => Promise.resolve(null),
        }),
      } as any);

      const user = await service.loginUser({
        email: mockUser.email,
        password: mockUser.password,
      });
      expect(user).toBeNull();
    });
  });

  describe('#loginSubmit', () => {
    it('should return user if login is successful', async () => {
      mockLoginModalService.openLogin.and.returnValue(
        Promise.resolve({ email: mockUser.email, password: mockUser.password })
      );
      spyOn(service, 'loginUser').and.returnValue(Promise.resolve(mockUser));

      const result = await service.loginSubmit();
      expect(result).toEqual(mockUser);
      expect(mockAlertService.error).not.toHaveBeenCalled();
    });

    it('should call alert if login fails', async () => {
      mockLoginModalService.openLogin.and.returnValue(
        Promise.resolve({ email: mockUser.email, password: 'wrong' })
      );
      spyOn(service, 'loginUser').and.returnValue(Promise.resolve(null));

      const result = await service.loginSubmit();
      expect(result).toBeNull();
      expect(mockAlertService.error).toHaveBeenCalledWith(
        'Invalid email or password'
      );
    });
  });

  describe('#signup', () => {
    it('should show success and close modal on success', async () => {
      const modalRef = { close: jasmine.createSpy() } as any;
      spyOn(service, 'saveUser').and.returnValue(
        Promise.resolve({ success: true, message: 'user added successfully' })
      );

      await service.signup(mockUser, modalRef);
      expect(mockAlertService.success).toHaveBeenCalled();
      expect(modalRef.close).toHaveBeenCalled();
    });

    it('should show error on failure', async () => {
      const modalRef = { close: jasmine.createSpy() } as any;
      spyOn(service, 'saveUser').and.returnValue(
        Promise.resolve({ success: false, message: 'user already exists' })
      );

      await service.signup(mockUser, modalRef);
      expect(mockAlertService.error).toHaveBeenCalledWith(
        'user already exists'
      );
      expect(modalRef.close).not.toHaveBeenCalled();
    });
  });

  describe('#logout', () => {
    it('should clear current user', () => {
      (service as any)._currentUser.set(mockUser);
      service.logout();
      expect(service.currentUser()).toBeNull();
    });
  });

  describe('#getUsers', () => {
    it('should return all users from localStorage', (done) => {
      localStorage.setItem('users', JSON.stringify([mockUser]));
      service.getUsers().subscribe((users) => {
        expect(users.length).toBe(1);
        expect(users[0].email).toBe(mockUser.email);
        done();
      });
    });
  });

  it('should compute isLoggedIn and isLandLord correctly', () => {
    const landlord = { ...mockUser, role: UserRole.LandLord };
    (service as any)._currentUser.set(landlord);

    expect(service.isLoggedIn()).toBeTrue();
    expect(service.isLandLord()).toBeTrue();
    expect(service.currentUserRole()).toBe(UserRole.LandLord);
  });
});
