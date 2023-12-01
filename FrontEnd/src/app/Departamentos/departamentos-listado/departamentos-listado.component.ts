import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Departamento } from 'src/app/Models/Departamento';
import { ParqServicesService } from 'src/app/ParqServices/parq-services.service';
import { ToastUtils } from 'src/app/Utilities/ToastUtils';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-departamentos-listado',
  templateUrl: './departamentos-listado.component.html',
  styleUrls: ['./departamentos-listado.component.css']
})
export class DepartamentosListadoComponent {
  Departamento!: Departamento[];
  updateDepartamento: Departamento = new Departamento(); 
  createDepartamento: Departamento = new Departamento();
  deleteDepartamento: Departamento = new Departamento();
  Id: any;
  showModal=false;
  showModalU=false;
  showModalD=false;
  filtro: string = '';
  p: number = 1;
  selectedPageSize = 10;
  pageSizeOptions: number[] = [10, 20, 50];

  SoloIcono = false;

  Departamento_Create_Requerido = false;
  Id_Create_Requerido = false;
  Direccion_Create_Requerido = false;

  Departamento_Update_Requerido = false;
  Id_Update_Requerido = false;
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
    this.getDepartamento();
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

  getDepartamento(){
    this.service.getDepartamentosAPI().subscribe(data => {
      console.log(data);
      this.Departamento = data;
    });
  }

  filtrarDepartamento(): Departamento[] {
    const filtroLowerCase = this.filtro.toLowerCase();
  
    return this.Departamento.filter(Departamento => {
      const nombreValido = Departamento.dept_Id.toLowerCase().includes(filtroLowerCase);
      const idValido = Departamento.dept_Descripcion.toString().includes(this.filtro);

      return nombreValido || idValido;
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
  this.Departamento_Create_Requerido = false;
  this.Id_Create_Requerido = false;
  this.Direccion_Create_Requerido = false;


  this.createDepartamento.dept_Descripcion = '';
  this.createDepartamento.dept_Id = '';

}

confirmarCreate() {
  const errorsArray: boolean[] = [
    this.validateDepartamentoCreate(),
    this.validateDireccionCreate(),
    this.validateIdCreate(),
  ];

  const errors = errorsArray.filter(error => error).length;

  if (errors === 0) {
    const usua_ID = localStorage.getItem('usua_ID');

    if (usua_ID == null) {
      this.router.navigate(['pages-login']);
      return;
    }
    this.service.insertDepartamentoAPI(this.createDepartamento).subscribe((response: any) => {
      console.log(response)
      if (response.code === 200) {
        ToastUtils.showSuccessToast(response.message);
        this.closeCreateModal();
        this.getDepartamento();
      } else if (response.code === 409) {
        ToastUtils.showWarningToast(response.message);
      } else {
        ToastUtils.showErrorToast("Ha ocurrido un error inesperado");
      }
    });
  } else {
    ToastUtils.showWarningToast('¡Hay campos vacíos!');
  }
}

//#endregion MODAL CREATE


//#region MODAL UPDATE
  clearUpdateModal(){
    this.Departamento_Update_Requerido = false;
    this.Id_Update_Requerido = false;
    this.Direccion_Update_Requerido = false;
  }

  onUpdate(Departamento: Departamento){
    
    this.updateDepartamento.dept_Id = Departamento.dept_Id;
    this.updateDepartamento.dept_Descripcion = Departamento.dept_Descripcion;
 
    this.openUpdateModal();
  }

  confirmUpdate(){
    var errors = 0;
    const errorsArray: boolean[] = [];

    errorsArray[0] = this.validateDepartamentoUpdate();
    errorsArray[1] = this.validateIdUpdate();

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
        this.service.editDepartamentoAPI(this.updateDepartamento).subscribe((response : any) =>{
          if(response.code == 200){
            ToastUtils.showSuccessToast(response.message);
            this.getDepartamento();
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
  onDelete(id: string){
    this.deleteDepartamento.dept_Id = id;
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
    this.service.deleteDepartamentoAPI(this.deleteDepartamento).subscribe((response : any) =>{
      if (response.code == 200) {
        ToastUtils.showSuccessToast(response.message);
        this.getDepartamento();
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
   
    validateDepartamentoCreate(){
      if (!this.createDepartamento.dept_Descripcion) {
        this.Departamento_Create_Requerido = true;
        return true;
      }else{
        this.Departamento_Create_Requerido = false;
        return false;
      }
    }

    validateIdCreate(){
      if (!this.createDepartamento.dept_Descripcion) {
        this.Id_Create_Requerido = true;
        return true;
      }else{
        this.Id_Create_Requerido = false;
        return false;
      }
    }

    validateDireccionCreate(){
      if (!this.createDepartamento.dept_Descripcion) {
        this.Direccion_Create_Requerido = true;
        return true;
      }else{
        this.Direccion_Create_Requerido = false;
        return false;
      }
    }
   
    clearDepartamentoCreateError(){
      if(this.createDepartamento.dept_Descripcion){
        this.Departamento_Create_Requerido = false;
      }
    };

    clearIdCreateError(){
      if (this.createDepartamento.dept_Id) {
        this.Id_Create_Requerido = false;
      }
    }

    //#endregion


  //#region VALIDACIONES ACTUALIZAR
    validateDepartamentoUpdate(){
      if (!this.updateDepartamento.dept_Descripcion) {
        this.Departamento_Update_Requerido = true;
        return true;
      }else{
        this.Departamento_Update_Requerido = false;
        return false;
      }
    }

    validateIdUpdate(){
      if (!this.updateDepartamento.dept_Descripcion) {
        this.Id_Update_Requerido = true;
        return true;
      }else{
        this.Id_Update_Requerido = false;
        return false;
      }
    }

   
    clearDepartamentoUpdateError(){
      if(this.updateDepartamento.dept_Descripcion){
        this.Departamento_Update_Requerido = false;
      }
    }

    clearIdUpdateError(){
      if (this.updateDepartamento.dept_Id) {
        this.Id_Update_Requerido = false;
      }
    }


  //#endregion VALIDACIONES ACTUALIZAR 



  

}
