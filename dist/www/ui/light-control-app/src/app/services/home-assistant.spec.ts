import { TestBed } from '@angular/core/testing';

import { HomeAssistant } from './home-assistant';

describe('HomeAssistant', () => {
  let service: HomeAssistant;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeAssistant);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
