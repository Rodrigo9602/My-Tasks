import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorComponent } from '../../../src/app/pages/error/error.component';
import { ActivatedRoute } from '@angular/router';


describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {snapshot: {}}} 
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ErrorComponent);
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
