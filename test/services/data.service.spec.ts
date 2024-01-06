import { TestBed } from '@angular/core/testing';

import { DataService } from '../../src/app/services/data.service';
import { Task } from '../../src/app/models/task.model';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update task Observer', () => {
    const inputTasks: Array<Task> = [
      {
        _id: 'doaishdi8a7s3ja93asd',
        name: 'test task',
        description: 'this is a test task',
        creationDate: new Date(),
        endingDate: new Date(),
        lastChange: new Date(),
        state: 'creado'
      }
    ]
    service.updateTasks(inputTasks);
    service.task$.subscribe(tasks => {
      expect(tasks).toEqual(inputTasks);
    });
  });
});
