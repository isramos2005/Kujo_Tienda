import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesListadoComponent } from './clientes-listado.component';

describe('ClientesListadoComponent', () => {
  let component: ClientesListadoComponent;
  let fixture: ComponentFixture<ClientesListadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientesListadoComponent]
    });
    fixture = TestBed.createComponent(ClientesListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
