import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRowItemComponent } from './user-row-item.component';

describe('UserRowItemComponent', () => {
  let component: UserRowItemComponent;
  let fixture: ComponentFixture<UserRowItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRowItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRowItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
