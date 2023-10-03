import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CJProductsComponent } from './cj-products.component';

describe('CJProductsComponent', () => {
  let component: CJProductsComponent;
  let fixture: ComponentFixture<CJProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CJProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CJProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
