import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandListComponent } from './land-list.component';

describe('LandListComponent', () => {
  let component: LandListComponent;
  let fixture: ComponentFixture<LandListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
