import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskSidebarComponent } from './task-sidebar.component';

describe('TaskSidebarComponent', () => {
  let component: TaskSidebarComponent;
  let fixture: ComponentFixture<TaskSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskSidebarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskSidebarComponent);
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
