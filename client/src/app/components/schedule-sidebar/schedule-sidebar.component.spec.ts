import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleSidebarComponent } from './schedule-sidebar.component';

describe('ScheduleSidebarComponent', () => {
  let component: ScheduleSidebarComponent;
  let fixture: ComponentFixture<ScheduleSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidebar visibility', () => {
    expect(component.isOpen).toBeFalse();
    component.toggleSidebar();
    expect(component.isOpen).toBeTrue();
  });
});
