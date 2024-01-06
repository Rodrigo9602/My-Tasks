import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTableComponent } from '../../../src/app/components/task-table/task-table.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('TaskTableComponent', () => {
  let component: TaskTableComponent;
  let fixture: ComponentFixture<TaskTableComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskTableComponent, HttpClientTestingModule],      
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should match initial snapshot', () => {
    expect(compiled).toMatchSnapshot();
  });
});
