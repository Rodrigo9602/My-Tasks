import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';

import { authInterceptor } from '../src/app/auth.interceptor';
import { UserService } from '../src/app/services/user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('authInterceptor', () => {
  
  const interceptor: HttpInterceptorFn = (req, next) => TestBed.runInInjectionContext(() => authInterceptor(req, next));
  let service: UserService;
  let req: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    
    service = TestBed.inject(UserService);
    req = new HttpRequest('GET', 'https://example.com');
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should intercept outgoing requests', () => {
    const nextSpy = jest.fn();
    authInterceptor(req, nextSpy);
    expect(nextSpy).toHaveBeenCalled();
  });

  it('should get the token value from localStorage', () => {
    const token = '123456';
    jest.spyOn(Storage.prototype, 'getItem')
      .mockImplementation((key: string) => {
        if (key === 'token') {
          return token;
        }
        return null;
      });
    const nextSpy = jest.fn();
    authInterceptor(req, nextSpy);
    expect(localStorage.getItem).toHaveBeenCalledWith('token');

  });

  it('should add Authorization header to request', () => {
    const token = '123456';
    jest.spyOn(Storage.prototype, 'getItem')
      .mockImplementation((key: string) => {
        if (key === 'token') {
          return token;
        }
        return null;
      });

    service.find('658cbe5dert5617a2b4cdfc6').subscribe(res => {
      expect(res.request.headers.has('Authorization')).toEqual(true);
      expect(res.request.headers.get('Authorization')).toEqual(`Bearer ${token}`);
    });


  });

});
