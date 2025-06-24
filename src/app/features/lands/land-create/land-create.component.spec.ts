import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandCreateComponent } from './land-create.component';

describe('LandCreateComponent', () => {
  let component: LandCreateComponent;
  let fixture: ComponentFixture<LandCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
