export class Facturas {
    Id: any;
    ClienteId!: any;
    Cliente!: any;
    RTN!: any;
    Fecha!: any;
    MetodoPago!: any;
    Detalles!: DetalleFactura[];
  }
  
  export interface DetalleFactura {
    Id: any;
    Producto: any;
    ProductoId:any;
    Cantidad: any;
    PrecioUnitario: any;
    Total: any;
    Imagen:any;
    Existencias: any;

  }