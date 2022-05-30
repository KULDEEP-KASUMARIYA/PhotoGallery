import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredViaSocialComponent } from './registered-via-social.component';

describe('RegisteredViaSocialComponent', () => {
  let component: RegisteredViaSocialComponent;
  let fixture: ComponentFixture<RegisteredViaSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisteredViaSocialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredViaSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
