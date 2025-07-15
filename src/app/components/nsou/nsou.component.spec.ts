import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NsouComponent } from './nsou.component';

describe('NsouComponent', () => {
  let component: NsouComponent;
  let fixture: ComponentFixture<NsouComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NsouComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NsouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
