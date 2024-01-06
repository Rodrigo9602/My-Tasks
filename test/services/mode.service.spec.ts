import { TestBed } from '@angular/core/testing';

import { ModeConfigService} from '../../src/app/services/mode.service';

describe('ModeService', () => {
  let service: ModeConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModeConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should change visualization mode', () => {
    service.changeMode(false);
    service.modo$.subscribe(mode => {
      expect(mode).toEqual(false);
    });
  });
});
