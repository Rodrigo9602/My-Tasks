import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainboardComponent } from '../../../src/app/pages/home/mainboard/mainboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('MainboardComponent', () => {
  let component: MainboardComponent;
  let fixture: ComponentFixture<MainboardComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainboardComponent, BrowserAnimationsModule, HttpClientTestingModule],      
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainboardComponent);
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
