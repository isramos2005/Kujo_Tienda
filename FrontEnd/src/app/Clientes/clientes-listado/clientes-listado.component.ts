import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/Models/Cliente';
import { ParqServicesService } from 'src/app/ParqServices/parq-services.service';
import { ToastUtils } from 'src/app/Utilities/ToastUtils';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-clientes-listado',
  templateUrl: './clientes-listado.component.html',
  styleUrls: ['./clientes-listado.component.css']
})
export class ClientesListadoComponent {
  Cliente!: Cliente[];
  updateCliente: Cliente = new Cliente(); 
  createCliente: Cliente = new Cliente();
  deleteCliente: Cliente = new Cliente();
  Id: any;
  showModal=false;
  showModalU=false;
  showModalD=false;
  filtro: string = '';
  p: number = 1;
  selectedPageSize = 10;
  pageSizeOptions: number[] = [10, 20, 50];

  SoloIcono = false;

  Cliente_Create_Requerido = false;
  RTN_Create_Requerido = false;
  Direccion_Create_Requerido = false;

  Cliente_Update_Requerido = false;
  RTN_Update_Requerido = false;
  Direccion_Update_Requerido = false;

  constructor(
    private service:ParqServicesService,
    private elementRef: ElementRef,
    private renderer2: Renderer2,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.Token();
    this.getCliente();
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
  getCliente(){
    this.service.getCliente().subscribe(data => {
      console.log(data);
      this.Cliente = data;
    });
  }

  filtrarCliente(): Cliente[] {
    const filtroLowerCase = this.filtro.toLowerCase();
  
    return this.Cliente.filter(Cliente => {
      const nombreValido = Cliente.Nombre.toLowerCase().includes(filtroLowerCase);
      const idValido = Cliente.Id.toString().includes(this.filtro);
      const rtnvalido = Cliente.RTN.toString().includes(this.filtro);
      const DireccionValido = Cliente.Direccion.toString().includes(this.filtro);
  
      return nombreValido || idValido || rtnvalido || DireccionValido;
    });
  };


//#region MODAL CREATE
openCreateModal() {
  this.clearCreateModal();

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
  this.Cliente_Create_Requerido = false;
  this.RTN_Create_Requerido = false;
  this.Direccion_Create_Requerido = false;


  this.createCliente.Nombre = '';
  this.createCliente.RTN = '';
  this.createCliente.Direccion = '';

}

confirmarCreate() {
  const errorsArray: boolean[] = [
    this.validateClienteCreate(),
    this.validateDireccionCreate(),
    this.validateRTNCreate(),
  ];

  const errors = errorsArray.filter(error => error).length;

  if (errors === 0) {
    const usua_ID = localStorage.getItem('usua_ID');

    if (usua_ID == null) {
      this.router.navigate(['pages-login']);
      return;
    }

    const listadoCliente: Cliente[] = JSON.parse(localStorage.getItem('listadoClientes') || '[]');

    const maxId = Math.max(...listadoCliente.map(cliente => cliente.Id));

    const nuevoId = maxId + 1;
    this.createCliente.Id = nuevoId;

    this.service.createCliente(this.createCliente).subscribe((response: any) => {
      if (response.code === 200) {
        ToastUtils.showSuccessToast(response.message);
        this.closeCreateModal();
        this.getCliente();
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
    this.Cliente_Update_Requerido = false;
    this.RTN_Update_Requerido = false;
    this.Direccion_Update_Requerido = false;
  }

  onUpdate(Cliente: Cliente){
    
    this.updateCliente.Id = Cliente.Id;
    this.updateCliente.Nombre = Cliente.Nombre;
    this.updateCliente.RTN = Cliente.RTN;
    this.updateCliente.Direccion = Cliente.Direccion;

    this.openUpdateModal();
  }

  confirmUpdate(){
    var errors = 0;
    const errorsArray: boolean[] = [];

    errorsArray[0] = this.validateClienteUpdate();
    errorsArray[1] = this.validateDireccionUpdate();
    errorsArray[2] = this.validateRTNUpdate();

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
        this.service.updateCliente(this.updateCliente).subscribe((response : any) =>{
          if(response.code == 200){
            ToastUtils.showSuccessToast(response.message);
            this.getCliente();
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
    this.deleteCliente.Id = id;
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
    this.service.deleteCliente(this.deleteCliente).subscribe((response : any) =>{
      if (response.code == 200) {
        ToastUtils.showSuccessToast(response.message);
        this.getCliente();
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
   
    validateClienteCreate(){
      if (!this.createCliente.Nombre) {
        this.Cliente_Create_Requerido = true;
        return true;
      }else{
        this.Cliente_Create_Requerido = false;
        return false;
      }
    }

    validateRTNCreate(){
      if (!this.createCliente.Nombre) {
        this.RTN_Create_Requerido = true;
        return true;
      }else{
        this.RTN_Create_Requerido = false;
        return false;
      }
    }

    validateDireccionCreate(){
      if (!this.createCliente.Nombre) {
        this.Direccion_Create_Requerido = true;
        return true;
      }else{
        this.Direccion_Create_Requerido = false;
        return false;
      }
    }
   
    clearClienteCreateError(){
      if(this.createCliente.Nombre){
        this.Cliente_Create_Requerido = false;
      }
    };

    clearRTNCreateError(){
      if (this.createCliente.RTN) {
        this.RTN_Create_Requerido = false;
      }
    }

    clearDireccionCreateError(){
      if(this.createCliente.Direccion){
        this.Direccion_Create_Requerido = false;
      }
    }
    //#endregion


  //#region VALIDACIONES ACTUALIZAR
    validateClienteUpdate(){
      if (!this.updateCliente.Nombre) {
        this.Cliente_Update_Requerido = true;
        return true;
      }else{
        this.Cliente_Update_Requerido = false;
        return false;
      }
    }

    validateRTNUpdate(){
      if (!this.updateCliente.Nombre) {
        this.RTN_Update_Requerido = true;
        return true;
      }else{
        this.RTN_Update_Requerido = false;
        return false;
      }
    }

    validateDireccionUpdate(){
      if (!this.updateCliente.Nombre) {
        this.Direccion_Update_Requerido = true;
        return true;
      }else{
        this.Direccion_Update_Requerido = false;
        return false;
      }
    }
   
    clearClienteUpdateError(){
      if(this.updateCliente.Nombre){
        this.Cliente_Update_Requerido = false;
      }
    }

    clearRTNUpdateError(){
      if (this.updateCliente.RTN) {
        this.RTN_Update_Requerido = false;
      }
    }

    clearDireccionUpdateError(){
      if(this.updateCliente.Direccion){
        this.Direccion_Update_Requerido = false;
      }
    }

  //#endregion VALIDACIONES ACTUALIZAR 



  

}
