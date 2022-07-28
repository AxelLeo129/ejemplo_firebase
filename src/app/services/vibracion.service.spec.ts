import { TestBed } from '@angular/core/testing';

import { VibracionService } from './vibracion.service';

describe('VibracionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VibracionService = TestBed.get(VibracionService);
    expect(service).toBeTruthy();
  });
});
