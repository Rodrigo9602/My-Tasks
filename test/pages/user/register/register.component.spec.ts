import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from '../../../../src/app/pages/user/register/register.component';
import { ActivatedRoute } from '@angular/router';


describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {snapshot: {}}} 
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterComponent);
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
