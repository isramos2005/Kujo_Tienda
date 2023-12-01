import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Productos } from 'src/app/Models/Productos';
import { ParqServicesService } from 'src/app/ParqServices/parq-services.service';
import { ImgbbService } from 'src/app/Service_IMG/imgbb-service.service';
import { ToastUtils } from 'src/app/Utilities/ToastUtils';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-productos-listado',
  templateUrl: './productos-listado.component.html',
  styleUrls: ['./productos-listado.component.css']
})
export class ProductosListadoComponent {
  productos!: Productos[];
  updateProducto: Productos = new Productos(); 
  createProducto: Productos = new Productos();
  deleteProducto: Productos = new Productos();
  Id: any;
  showModal=false;
  showModalU=false;
  showModalD=false;
  imageUrl: string = ''; 
  filtro: string = '';
  p: number = 1;
  selectedPageSize = 3;
  pageSizeOptions: number[] = [3, 6, 9, 12]; // Opciones de tamaño de página
  SoloIcono = false;


  Producto_Create_Requerido = false;
  Precio_Create_Requerido = false;
  Imagen_Create_Requerido = false;
  FormatoValidoPrecio = false;
  Total_Create_Requerido = false;
  Stock_Create_Requerido = false;

  Producto_Update_Requerido = false;
  Precio_Update_Requerido = false;
  Imagen_Update_Requerido = false;
  Total_Update_Requerido = false;
  Stock_Update_Requerido = false;

  constructor(
    private service:ParqServicesService,
    private elementRef: ElementRef,
    private renderer2: Renderer2,
    private imgbbService: ImgbbService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.Token();

    this.getProductos();
    this.createProducto.Precio = 0;
    this.showModal=false;
    this.showModalU=false;
    this.showModalD=false;
    this.breakpointObserver.observe([Breakpoints.XSmall])
    .subscribe(result => {
      this.SoloIcono = result.matches;
    });
  }
  
  Token(){
    const Token = localStorage.getItem('TOKEN');

    if (Token != 'Logueado') {
      this.router.navigate(['pages-login']);
      return;
    }
  }
  
  getProductos(){
    this.service.getProductos().subscribe(data => {
      console.log(data);
      this.productos = data;
    });
  }

  filtrarProductos(): Productos[] {
    const filtroLowerCase = this.filtro.toLowerCase();
  
    return this.productos.filter(productos => {
      const nombreValido = productos.Nombre.toLowerCase().includes(filtroLowerCase);
      const idValido = productos.Id.toString().includes(this.filtro);
      const precioValido = productos.Precio.toString().includes(this.filtro);
  
      return nombreValido || idValido || precioValido;
    });
  };


//#region MODAL CREATE
openCreateModal() {
  this.clearCreateModal();
  this.imageUrl="";

  const modalCreate = this.elementRef.nativeElement.querySelector('#modalCreate');
  this.renderer2.setStyle(modalCreate, 'display', 'block');
  setTimeout(() => {
    this.renderer2.addClass(modalCreate, 'show');
    this.showModal = true;
  }, 0);
}

closeCreateModal(): void {
  const modalCreate = this.elementRef.nativeElement.querySelector('#modalCreate');
  this.renderer2.removeClass(modalCreate, 'show');
  setTimeout(() => {
    this.renderer2.setStyle(modalCreate, 'display', 'none');
    this.showModal = false;
  }, 300); // Ajusta el tiempo para que coincida con la duración de la transición en CSS

  this.clearCreateModal();

  const Nombre = this.elementRef.nativeElement.querySelector('#Nombre');
  this.renderer2.setProperty(Nombre, 'value', '');

  const Precio = this.elementRef.nativeElement.querySelector('#Precio');
  this.renderer2.setProperty(Precio, 'value', '');
}


clearCreateModal(){
  this.Producto_Create_Requerido = false;
  this.Precio_Create_Requerido = false;
  this.Imagen_Create_Requerido = false;
  this.FormatoValidoPrecio = false;
  this.Total_Create_Requerido = false;
  this.Stock_Create_Requerido = false;


  this.createProducto.Nombre = '';
  this.createProducto.Precio = 0;
  this.createProducto.Total = 0;
  this.createProducto.Imagen = '';
  this.createProducto.Existencias = 0;

}

confirmarCreate() {
  const errorsArray: boolean[] = [
    this.validateProductoCreate(),
    this.validatePrecioCreate(),
    this.validateStockCreate(),
    this.validateTotalCreate(),
  ];

  const errors = errorsArray.filter(error => error).length;

  if (errors === 0) {
    const usua_ID = localStorage.getItem('usua_ID');

    if (usua_ID == null) {
      this.router.navigate(['pages-login']);
      return;
    }

    const listadoProductos: Productos[] = JSON.parse(localStorage.getItem('listadoProductos') || '[]');

    const maxId = Math.max(...listadoProductos.map(producto => producto.Id));

    const nuevoId = maxId + 1;

    this.createProducto.Id = nuevoId;

    this.service.createProducto(this.createProducto).subscribe((response: any) => {
      if (response.code === 200) {
        ToastUtils.showSuccessToast(response.message);
        this.closeCreateModal();
        this.getProductos();
      } else if (response.code === 409) {
        ToastUtils.showWarningToast(response.message);
      } else {
        ToastUtils.showErrorToast(response.message);
      }
    });
  } else {
    ToastUtils.showWarningToast('¡Hay campos vacíos!');
  }
}

//#endregion MODAL CREATE


//#region MODAL UPDATE
  clearUpdateModal(){
    this.Producto_Update_Requerido = false;
    this.Precio_Update_Requerido = false;
    this.Imagen_Update_Requerido = false;
    this.Stock_Update_Requerido = false;
    this.Total_Update_Requerido = false;
  }

  onUpdate(productos: Productos){
    
    this.updateProducto.Id = productos.Id;
    this.updateProducto.Nombre = productos.Nombre;
    this.updateProducto.Precio = productos.Precio;
    this.updateProducto.Existencias = productos.Existencias;
    this.updateProducto.Total = productos.Total;
    this.updateProducto.Imagen = productos.Imagen
    this.openUpdateModal();
  }

  confirmUpdate(){
    var errors = 0;
    const errorsArray: boolean[] = [];

    errorsArray[0] = this.validateProductoUpdate();
    errorsArray[1] = this.validatePrecioUpdate();
    errorsArray[2] = this.validateStockUpdate();
    errorsArray[3] = this.validateTotalUpdate();

    for (let i = 0; i < errorsArray.length; i++) {
      if (errorsArray[i] == true) {
        errors++;
      }else{
        errors;
      }
    }

    if (errors == 0) {
      const usua_ID = localStorage.getItem('usua_ID');
      if (usua_ID == null) {
        this.router.navigate(['pages-login']);
      }      
        this.service.updateProducto(this.updateProducto).subscribe((response : any) =>{
          if(response.code == 200){
            ToastUtils.showSuccessToast(response.message);
            this.getProductos();
            this.closeUpdateModal();

          }else if (response.code == 409){
            ToastUtils.showWarningToast(response.message);
          }else{
            ToastUtils.showErrorToast(response.message);
          }
        })
    }else{
      ToastUtils.showWarningToast('Hay campos vacios!');
    }
  }

  openUpdateModal() {
    const modalUpdate = this.elementRef.nativeElement.querySelector('#modalUpdate');
    this.renderer2.setStyle(modalUpdate, 'display', 'block');
    setTimeout(() => {
      this.renderer2.addClass(modalUpdate, 'show');
      this.showModalU = true;
    }, 0);
    this.clearUpdateModal();
  }
  
  closeUpdateModal(): void {
    const modalUpdate = this.elementRef.nativeElement.querySelector('#modalUpdate');
    this.renderer2.removeClass(modalUpdate, 'show');
    setTimeout(() => {
      this.renderer2.setStyle(modalUpdate, 'display', 'none');
      this.showModalU = false;
    }, 300); // Ajusta el tiempo para que coincida con la duración de la transición en CSS
    this.clearUpdateModal();
  }
  
//#endregion MODAL UPDATE


//#region MODAL DELETE 
  onDelete(id: number){
    this.deleteProducto.Id = id;
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
  

  confirmDelete(){
    this.service.deleteProducto(this.deleteProducto).subscribe((response : any) =>{
      if (response.code == 200) {
        ToastUtils.showSuccessToast(response.message);
        this.getProductos();
        this.closeDeleteModal();
      }else if(response.code == 409){
        ToastUtils.showWarningToast(response.message);
      }else{
        ToastUtils.showErrorToast(response.message);
      }
    })
  }

//#endregion MODAL DELETE


//#region  VALIDACIONES CREAR 
    validateProductoCreate(){
      if(!this.createProducto.Nombre){
        this.Producto_Create_Requerido = true;
        return true;
      }else{
        this.Producto_Create_Requerido = false;
        return false;
      }
    };

    validatePrecioCreate() {
      const regex = /^[0-9]+(\.[0-9]{1,2})?$/;

      if (!this.createProducto.Precio) {
        this.Precio_Create_Requerido = true;
        return true;
      } else if (!regex.test(this.createProducto.Precio.toString())) {
        this.Precio_Create_Requerido = true;
        ToastUtils.showWarningToast('Solo se aceptan valores numéricos')
        return true ;
      }else if(this.createProducto.Precio <= 0){
        this.Precio_Create_Requerido = true;
        ToastUtils.showWarningToast('Precio no puede ser menor a uno')
        return true ;        
      } 
      else {
        this.Precio_Create_Requerido = false;
        return false;
      }
    }
    
    validateStockCreate() {
      const regex = /^[0-9]+(\.[0-9]{1,2})?$/;

      if (!this.createProducto.Precio) {
        this.Stock_Create_Requerido = true;
        return true;
      } else if (!regex.test(this.createProducto.Precio.toString())) {
        this.Stock_Create_Requerido = true;
        ToastUtils.showWarningToast('Solo se aceptan valores numéricos')
        return true ;
      }else if(this.createProducto.Precio <= 0){
        this.Stock_Create_Requerido = true;
        ToastUtils.showWarningToast('Precio no puede ser menor a uno')
        return true ;        
      } 
      else {
        this.Stock_Create_Requerido = false;
        return false;
      }
    }

    validateTotalCreate() {
      const regex = /^[0-9]+(\.[0-9]{1,2})?$/;

      if (!this.createProducto.Total) {
        this.Total_Create_Requerido = true;
        return true;
      } else if (!regex.test(this.createProducto.Precio.toString())) {
        this.Total_Create_Requerido = true;
        ToastUtils.showWarningToast('Solo se aceptan valores numéricos')
        return true ;
      }else if(this.createProducto.Precio <= 0){
        this.Total_Create_Requerido = true;
        ToastUtils.showWarningToast('Precio no puede ser menor a uno')
        return true ;        
      } 
      else {
        this.Total_Create_Requerido = false;
        return false;
      }
    }

    validateImagenCreate(){
      if(!this.createProducto.Imagen){
        this.Imagen_Create_Requerido = true;
        return true;        
      }else{
        this.Imagen_Create_Requerido = false;
        return false;
      }
    }

    clearProductoCreateError(){
      if(this.createProducto.Nombre){
        this.Producto_Create_Requerido = false;
      }
    };

    clearPrecioCreateError(){
      if(this.createProducto.Precio){
        this.Precio_Create_Requerido = false;
      }
    }

    clearImagenError(){
      if(this.createProducto.Imagen){
        this.Imagen_Create_Requerido = false;
      }
    }

    clearStockCreateError(){
      if(this.createProducto.Existencias){
        this.Stock_Create_Requerido = false;
      }
    };

    clearTotalCreateError(){
      if(this.createProducto.Total){
        this.Total_Create_Requerido = false;
      }
    };
    //#endregion


  //#region VALIDACIONES ACTUALIZAR
    validateProductoUpdate(){
      if (!this.updateProducto.Nombre) {
        this.Producto_Update_Requerido = true;
        return true;
      }else{
        this.Producto_Update_Requerido = false;
        return false;
      }
    }

    validatePrecioUpdate(){
      const regex = /^[0-9]+(\.[0-9]{1,2})?$/;

      if (!this.updateProducto.Precio) {
        this.Precio_Update_Requerido = true;
        return true;      
      }else if (!regex.test(this.updateProducto.Precio.toString())) {
        this.Precio_Update_Requerido = true;
        ToastUtils.showWarningToast('Solo se aceptan valores numéricos')
        return true;
      } else if (this.updateProducto.Precio <= 0) {
        this.Precio_Update_Requerido = true;
        ToastUtils.showWarningToast('Precio no puede ser menor a uno')
        return true;
      } else{
        this.Precio_Update_Requerido = false;
        return false;
      }
    }

    validateStockUpdate(){
      const regex = /^[0-9]+(\.[0-9]{1,2})?$/;

      if (!this.updateProducto.Existencias) {
        this.Stock_Update_Requerido = true;
        return true;      
      }else if (!regex.test(this.updateProducto.Precio.toString())) {
        this.Stock_Update_Requerido = true;
        ToastUtils.showWarningToast('Solo se aceptan valores numéricos')
        return true;
      } else if (this.updateProducto.Precio <= 0) {
        this.Stock_Update_Requerido = true;
        ToastUtils.showWarningToast('Precio no puede ser menor a uno')
        return true;
      } else{
        this.Stock_Update_Requerido = false;
        return false;
      }
    }

    validateTotalUpdate(){
      const regex = /^[0-9]+(\.[0-9]{1,2})?$/;

      if (!this.updateProducto.Total) {
        this.Total_Update_Requerido = true;
        return true;      
      }else if (!regex.test(this.updateProducto.Precio.toString())) {
        this.Total_Update_Requerido = true;
        ToastUtils.showWarningToast('Solo se aceptan valores numéricos')
        return true;
      } else if (this.updateProducto.Precio <= 0) {
        this.Total_Update_Requerido = true;
        ToastUtils.showWarningToast('Precio no puede ser menor a uno')
        return true;
      } else{
        this.Total_Update_Requerido = false;
        return false;
      }
    }

    clearProductoUpdateError(){
      if(this.updateProducto.Nombre){
        this.Producto_Update_Requerido = false;
      }
    }

    clearPrecioUpdateError(){
      if (this.updateProducto.Precio) {
        this.Precio_Update_Requerido = false;
      }
    }

    clearStockUpdateError(){
      if(this.updateProducto.Nombre){
        this.Stock_Update_Requerido = false;
      }
    }

    clearTotalUpdateError(){
      if(this.updateProducto.Nombre){
        this.Total_Update_Requerido = false;
      }
    }
  //#endregion VALIDACIONES ACTUALIZAR 



  handleImageUpload(event: any) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {

        this.uploadImageToServer(file);
      };
      reader.readAsDataURL(file);
    }
  }

  uploadImageToServer(file: File) {
    this.imgbbService.Upload_IMG(file)
      .subscribe(
        response => {

          this.imageUrl = response.data.url;
          this.createProducto.Imagen = (this.imageUrl)
          this.updateProducto.Imagen = (this.imageUrl)
        },
        error => {
          // Manejar errores en la carga de la imagen
          console.error(error);
        }
      );
  }
  deleteImage() {
    this.imageUrl = "";
    this.createProducto.Imagen="";
    this.updateProducto.Imagen="";
  }
}
