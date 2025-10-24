import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSection } from './room-section';

describe('RoomSection', () => {
  let component: RoomSection;
  let fixture: ComponentFixture<RoomSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
