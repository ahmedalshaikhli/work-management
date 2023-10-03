import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierProductCreateComponent } from './supplier-product-create.component';

describe('SupplierProductCreateComponent', () => {
  let component: SupplierProductCreateComponent;
  let fixture: ComponentFixture<SupplierProductCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierProductCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierProductCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
