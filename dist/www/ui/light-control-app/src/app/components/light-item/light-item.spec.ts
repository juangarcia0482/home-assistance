import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightItem } from './light-item';

describe('LightItem', () => {
  let component: LightItem;
  let fixture: ComponentFixture<LightItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LightItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LightItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
