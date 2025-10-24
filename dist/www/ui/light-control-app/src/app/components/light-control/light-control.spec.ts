import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightControl } from './light-control';

describe('LightControl', () => {
  let component: LightControl;
  let fixture: ComponentFixture<LightControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LightControl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LightControl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
