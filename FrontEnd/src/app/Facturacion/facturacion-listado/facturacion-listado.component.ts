import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { DetalleFactura, Facturas } from 'src/app/Models/Facturas';
import { ParqServicesService } from 'src/app/ParqServices/parq-services.service';
import { ImgbbService } from 'src/app/Service_IMG/imgbb-service.service';
import { ToastUtils } from 'src/app/Utilities/ToastUtils';

@Component({
  selector: 'app-facturacion-listado',
  templateUrl: './facturacion-listado.component.html',
  styleUrls: ['./facturacion-listado.component.css']
})
export class FacturacionListadoComponent {
  Factura!: Facturas[];
  deleteFactura: Facturas = new Facturas();
  Id: any;
  showModalD = false;
  filtro: string = '';
  p: number = 1;
  selectedPageSize = 10;
  pageSizeOptions: number[] = [10, 20, 50];
  expandedItemId: number | null = null;
  items: any[] = [];


  Factura_Create_Requerido = false;
  RTN_Create_Requerido = false;
  Direccion_Create_Requerido = false;

  Factura_Update_Requerido = false;
  RTN_Update_Requerido = false;
  Direccion_Update_Requerido = false;

  constructor(
    private service: ParqServicesService,
    private elementRef: ElementRef,
    private renderer2: Renderer2,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.Token();
    this.getFacturas();
    this.showModalD = false;
  }

  Token(){
    const Token = localStorage.getItem('TOKEN');

    if (Token != 'Logueado') {
      this.router.navigate(['pages-login']);
      return;
    }
  }

  getFacturas() {
    this.service.getFacturas().subscribe(data => {
      console.log(data);
      this.Factura = data;
    });
  }

  get detallesFiltrados(): DetalleFactura[] {
    const facturaSeleccionada = this.Factura.find(factura => factura.Id === this.expandedItemId);
    return facturaSeleccionada ? facturaSeleccionada.Detalles : [];
  }

get subtotal(): number {
  return this.detallesFiltrados.reduce((total, detalle) => total + detalle.Total, 0);
}

get isv(): number {
  const porcentajeISV = 15; // Ejemplo: 15%
  return (this.subtotal * porcentajeISV) / 100;
}

get total(): number {
  return this.subtotal + this.isv;
}


  filtrarFacturas(): Facturas[] {
    const filtroLowerCase = this.filtro.toLowerCase();

    return this.Factura.filter(Factura => {
      const nombreValido = Factura.Cliente.toLowerCase().includes(filtroLowerCase);
      const idValido = Factura.Id.toString().includes(this.filtro);
      const rtnvalido = Factura.RTN.toString().includes(this.filtro);
      return nombreValido || idValido || rtnvalido;
    });
  };

  RedirectCreate() {
    this.router.navigate(['/Facturacion/Crear']);
  }

  //#region UPDATE

  onUpdate(Factura: Facturas) {

    //this.updateFactura.Id = Factura.Id;
    //this.updateFactura.Nombre = Factura.Nombre;
    //this.updateFactura.RTN = Factura.RTN;
    //this.updateFactura.Direccion = Factura.Direccion;
    //    this.router.navigate(['/Facturacion/Crear']);

  }
  //#endregion UPDATE

  //#region MODAL DELETE 
  onDelete(id: number) {
    this.deleteFactura.Id = id;
    this.openDeleteModal();
  }

  openDeleteModal() {
    const modalDelete = this.elementRef.nativeElement.querySelector('#modalDelete');
    this.renderer2.setStyle(modalDelete, 'display', 'block');
    setTimeout(() => {
      this.renderer2.addClass(modalDelete, 'show');
      this.showModalD = true;
    }, 0);
  }

  closeDeleteModal() {
    const modalDelete = this.elementRef.nativeElement.querySelector('#modalDelete');
    this.renderer2.removeClass(modalDelete, 'show');
    setTimeout(() => {
      this.renderer2.setStyle(modalDelete, 'display', 'none');
      this.showModalD = false;
    }, 300); // Ajusta el tiempo para que coincida con la duración de la transición en CSS
  }


  confirmDelete() {
    this.service.deleteFactura(this.deleteFactura).subscribe((response: any) => {
      if (response.code == 200) {
        ToastUtils.showSuccessToast(response.message);
        this.getFacturas();
        this.closeDeleteModal();
      } else if (response.code == 409) {
        ToastUtils.showWarningToast(response.message);
      } else {
        ToastUtils.showErrorToast(response.message);
      }
    })
  }

  //#endregion MODAL DELETE
  toggleDetails(item: any): void {
    if (this.expandedItemId === item.Id) {
      this.expandedItemId = null;
    } else {
      this.expandedItemId = item.Id;
    }
  }

}
