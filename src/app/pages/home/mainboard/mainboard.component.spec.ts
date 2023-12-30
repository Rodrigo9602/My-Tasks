import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainboardComponent } from './mainboard.component';

describe('MainboardComponent', () => {
  let component: MainboardComponent;
  let fixture: ComponentFixture<MainboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
