import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierInterfaceComponent } from './supplier-interface.component';

describe('SupplierInterfaceComponent', () => {
  let component: SupplierInterfaceComponent;
  let fixture: ComponentFixture<SupplierInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierInterfaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
