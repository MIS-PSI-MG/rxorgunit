import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SouComponent } from './sou.component';

describe('SouComponent', () => {
  let component: SouComponent;
  let fixture: ComponentFixture<SouComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SouComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
