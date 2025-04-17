import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailSidebarComponent } from './task-detail-sidebar.component';

describe('TaskDetailSidebarComponent', () => {
  let component: TaskDetailSidebarComponent;
  let fixture: ComponentFixture<TaskDetailSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDetailSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDetailSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
