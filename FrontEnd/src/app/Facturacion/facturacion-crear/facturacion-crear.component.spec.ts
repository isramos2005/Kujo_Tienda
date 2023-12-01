import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturacionCrearComponent } from './facturacion-crear.component';

describe('FacturacionCrearComponent', () => {
  let component: FacturacionCrearComponent;
  let fixture: ComponentFixture<FacturacionCrearComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FacturacionCrearComponent]
    });
    fixture = TestBed.createComponent(FacturacionCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
