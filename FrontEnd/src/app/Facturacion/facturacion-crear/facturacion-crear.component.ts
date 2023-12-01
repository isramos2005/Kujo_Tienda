import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/Models/Cliente';
import { DetalleFactura, Facturas } from 'src/app/Models/Facturas';
import { Productos } from 'src/app/Models/Productos';
import { ParqServicesService } from 'src/app/ParqServices/parq-services.service';
import { ToastUtils } from 'src/app/Utilities/ToastUtils';

@Component({
  selector: 'app-facturacion-crear',
  templateUrl: './facturacion-crear.component.html',
  styleUrls: ['./facturacion-crear.component.css']
})
export class FacturacionCrearComponent implements OnInit {

  Factura: Facturas = new Facturas();
  ClienteInformacion: Cliente = new Cliente();
  productos: Productos[] = [];
  productoSeleccionado: Productos | null = null;
  productosEnTabla: DetalleFactura[] = [];

  clientes: Cliente[] = [];
  IdCliente = 0;
  MetedoPago = 0;


  filtro: string = '';
  p: number = 1;
  selectedPageSize = 3;
  pageSizeOptions: number[] = [3, 6, 9, 12];

  Cantidad = 1;
  ISV = 0;
  Subtotal = 0;
  Total = 0;

  searchDNI_Requerido = false;

  // VALIDACION DEL REGISTRO CLIENTE
  NombresRequerido = false;
  RTNRequerido = false;
  DireccionRequerido = false;
  FormatoValidoRTN = false;

  // VALIDACION DE LA COMPRA
  PagoRequerido = false;

  constructor(
    private service: ParqServicesService,
    private router: Router,
    private elementRef: ElementRef,
    private renderer2: Renderer2,
  ) { }

  ngOnInit(): void {
    this.Token();
    this.getProductos();
    this.getClientes();
  }

  Token(){
    const Token = localStorage.getItem('TOKEN');

    if (Token != 'Logueado') {
      this.router.navigate(['pages-login']);
      return;
    }
  }

  getProductos() {
    this.service.getProductos().subscribe(data => {
      this.productos = data.filter(producto => producto.Existencias > 0);
    });
  }

  getClientes() {
    this.service.getCliente().subscribe(data => {
      this.clientes = data;
    });
  }

  filtrarProductos(): Productos[] {
    const filtroLowerCase = this.filtro.toLowerCase();

    return this.productos.filter(producto => {
      const nombreValido = producto.Nombre.toLowerCase().includes(filtroLowerCase);
      const idValido = producto.Id.toString().includes(this.filtro);
      const precioValido = producto.Precio.toString().includes(this.filtro);

      return nombreValido || idValido || precioValido;
    });
  }

  clientebyselect() {
    const filtroLowerCase = this.filtro.toLowerCase();
    const Info = this.clientes.filter(cliente => {
      const idValido = cliente.Id.toString().includes(filtroLowerCase);
      return idValido;
    });
    this.ClienteInformacion.Id = Info[0]?.Id || '';
    this.ClienteInformacion.Nombre = Info[0]?.Nombre || '';
    this.ClienteInformacion.RTN = Info[0]?.RTN || '';
    this.ClienteInformacion.Direccion = Info[0]?.Direccion || '';
  }

  seleccionarProducto(producto: Productos) {
    if (this.productoSeleccionado && this.productoSeleccionado === producto) {
      this.productoSeleccionado = null;
    } else {
      this.productoSeleccionado = producto;

      this.Cantidad = 1; // Puedes ajustar esto según tus necesidades
      if (this.productoSeleccionado.Existencias > 0) {
        this.Cantidad = Math.min(1, this.productoSeleccionado.Existencias);
      }
    }

    this.actualizarCalculos();
  }


  estaSeleccionado(producto: Productos): boolean {
    return this.productoSeleccionado === producto;
  }

  agregarProductoAFactura() {
    if (!this.ClienteInformacion.Nombre || !this.ClienteInformacion.RTN || !this.ClienteInformacion.Direccion) {
      ToastUtils.showWarningToast('Seleccione o digite un cliente antes de agregar productos.');
      return;
    }

    if (!this.productoSeleccionado) {
      ToastUtils.showWarningToast('Seleccione un producto para agregar a la factura.');
      return;
    }

    if (this.Cantidad > this.productoSeleccionado.Existencias) {
      ToastUtils.showWarningToast('La cantidad excede el stock disponible. No se agregará a la factura.');
      return;
    }

    const nuevoDetalle: DetalleFactura = {
      Existencias: this.productoSeleccionado.Existencias,
      Imagen: this.productoSeleccionado.Imagen,
      Producto: this.productoSeleccionado.Nombre,
      Cantidad: this.Cantidad.toString(),
      Total: this.Cantidad * this.productoSeleccionado.Precio,
      Id: this.productoSeleccionado.Id,
      PrecioUnitario: this.productoSeleccionado.Precio,
      ProductoId: this.productoSeleccionado.Id
    };

    this.productosEnTabla.push(nuevoDetalle);

    const index = this.productos.indexOf(this.productoSeleccionado);
    if (index !== -1) {
      this.productos.splice(index, 1);
    }

    this.productoSeleccionado = null;
    this.Cantidad = 1;

    this.actualizarCalculos();

    ToastUtils.showSuccessToast('Producto agregado a la factura correctamente.');
  }


  eliminarProductoDeTabla(producto: DetalleFactura) {
    const indexEnTabla = this.productosEnTabla.indexOf(producto);

    if (indexEnTabla !== -1) {

      this.productosEnTabla.splice(indexEnTabla, 1);

      const productoOriginal: Productos = {
        Nombre: producto.Producto,
        Existencias: producto.Existencias,
        Precio: producto.PrecioUnitario,
        Total: producto.Total,
        Imagen: producto.Imagen,
        Id: producto.Id
      };

      this.productos.push(productoOriginal);

      this.actualizarCalculos();
    }
  }

  actualizarCalculos() {
    this.Subtotal = this.productosEnTabla.reduce((total, item) => total + item.Total, 0);
    this.ISV = this.Subtotal * 0.15;
    this.Total = this.Subtotal + this.ISV;
  }

  confirmarCompra() {
    var MetododePago = "";
  
    if (!this.MetedoPago) {
      ToastUtils.showWarningToast('Seleccione un tipo de pago.');
      return;
    }
    if (this.MetedoPago == 1) {
      MetododePago = "Crédito";
    }
    if (this.MetedoPago == 2) {
      MetododePago = "Contado";
    }
  
    // Obtener el listado de facturas del localStorage
    const facturas = localStorage.getItem('listadoFacturas');
    let listadoFacturas: Facturas[] = [];
  
    if (facturas) {
      listadoFacturas = JSON.parse(facturas);
    }
  
    // Obtener el último Id o establecerlo en 0 si no hay facturas
    const ultimoId = listadoFacturas.length > 0 ? listadoFacturas[listadoFacturas.length - 1].Id : 0;
  
    // Incrementar el Id para la nueva factura
    const nuevoId = ultimoId + 1;
  
    // Validar formato del RTN
    if (!this.validarFormatoRTN(this.ClienteInformacion.RTN)) {
      ToastUtils.showWarningToast('Formato de RTN no válido. Debe contener 14 dígitos.');
      return;
    }
  
    // Recorrer los detalles de la compra y disminuir las existencias de los productos
    this.productosEnTabla.forEach(detalle => {
      this.disminuirExistenciasProducto(detalle.ProductoId, detalle.Cantidad);
    });
  
    // Crear la factura
    const factura = {
      Id: nuevoId,
      ClienteId: this.ClienteInformacion.Id,
      Cliente: this.ClienteInformacion.Nombre,
      RTN: this.ClienteInformacion.RTN,
      Fecha: new Date().toLocaleDateString(),
      MetodoPago: MetododePago,
      Detalles: this.productosEnTabla.map(detalle => ({
        Id: detalle.Id,
        ProductoId: detalle.ProductoId,
        PrecioUnitario: detalle.PrecioUnitario,
        Producto: detalle.Producto,
        Cantidad: detalle.Cantidad,
        Imagen: detalle.Imagen,
        Existencias: detalle.Existencias,
        Total: detalle.Total
      }))
    };
  
    // Agregar la nueva factura al listado
    listadoFacturas.push(factura);
  
    // Guardar el listado de facturas actualizado en el localStorage
    localStorage.setItem('listadoFacturas', JSON.stringify(listadoFacturas));
  
    ToastUtils.showSuccessToast('Compra confirmada exitosamente.');
  
    this.router.navigate(['/Facturacion/Listado']);
  }
  
  disminuirExistenciasProducto(productoId: number, cantidad: number) {
    const productos = localStorage.getItem('listadoProductos');
    let listadoProductos: Productos[] = [];
  
    if (productos) {
      listadoProductos = JSON.parse(productos);
    }
  
    const producto = listadoProductos.find(p => p.Id === productoId);
  
    if (producto) {
      producto.Existencias -= cantidad;
  
      const index = listadoProductos.findIndex(p => p.Id === productoId);
      if (index !== -1) {
        listadoProductos[index] = producto;
      }
  
      localStorage.setItem('listadoProductos', JSON.stringify(listadoProductos));
    }
  }
  
  validarFormatoRTN(rtn: string): boolean {
    return /^\d{14}$/.test(rtn);
  }

  Volver() {
    this.router.navigate(['/Facturacion/Listado']);
  }
}
