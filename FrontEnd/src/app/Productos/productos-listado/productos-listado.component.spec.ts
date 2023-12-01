import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosListadoComponent } from './productos-listado.component';

describe('ProductosListadoComponent', () => {
  let component: ProductosListadoComponent;
  let fixture: ComponentFixture<ProductosListadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductosListadoComponent]
    });
    fixture = TestBed.createComponent(ProductosListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
