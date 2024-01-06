import { TestBed } from '@angular/core/testing';

import { SessionService } from '../../src/app/services/session.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SessionService', () => {
  let service: SessionService;
  

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SessionService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set session', () => {
    service.setSession('test_id', 'test_token');
    expect(localStorage.getItem('id')).toEqual('test_id');
    expect(localStorage.getItem('token')).toEqual('test_token');

  });

  it('should log out', () => {
    service.logout();
    expect(localStorage.length).toEqual(0);
  });
});
