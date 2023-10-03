import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CjProductDetailsComponent } from './cj-product-details.component';

describe('CjProductDetailsComponent', () => {
  let component: CjProductDetailsComponent;
  let fixture: ComponentFixture<CjProductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CjProductDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CjProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
