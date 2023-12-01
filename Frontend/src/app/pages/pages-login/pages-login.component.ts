import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { AcceService } from 'src/app/Service/acce.service';
import { Router } from '@angular/router';
import { ToastUtils } from 'src/app/Utilities/ToastUtils';
import { Productos } from 'src/app/Models/Productos';
import { Cliente } from 'src/app/Models/Cliente';
import { Facturas } from 'src/app/Models/Facturas';


@Component({
  selector: 'app-pages-login',
  templateUrl: './pages-login.component.html',
  styleUrls: ['./pages-login.component.css']
})
export class PagesLoginComponent implements OnInit {

  username = "";
  password = "";
  validacion = "";

  constructor(private service: AcceService, private router: Router, private elementRef: ElementRef,) { }

  ngOnInit(): void {
    this.Contador();
  }


  Contador() {
    var inicio;
    inicio = parseInt(localStorage.getItem('contadorSesiones') || '0');
    console.log(inicio);
    if (inicio === 1) {
      const productos: Productos[] = [
        {
          Nombre: 'RTX 4090',
          Existencias: 10,
          Precio: 2.5,
          Total: 25,
          Imagen: 'https://i.ibb.co/6nmGDTq/image.png',
          Id: 1
        },
        {
          Nombre: 'HeadSet KDA Logitech',
          Existencias: 5,
          Precio: 1.8,
          Total: 9,
          Imagen: 'https://i.ibb.co/tzGyMxf/image.png',
          Id: 2
        },
        {
          Nombre: 'Dell Alienware 14" (Intel® Core? i7)',
          Existencias: 5,
          Precio: 1.8,
          Total: 9,
          Imagen: 'https://i.ibb.co/vBtYmmb/image.png',
          Id: 3
        },
      ];
      const clientes: Cliente[] = [
        {
          Id: 1,
          Nombre: 'Isaac Ramos',
          Direccion: 'Barrio Cabañas',
          RTN: '0501200601755'
        },
      ];
      const facturas: Facturas[] = [
        {
          Id: 1,
          ClienteId: 1,
          Cliente: 'Isaac Ramos',
          RTN: '05012006017551',
          Fecha: '11/30/2023',
          MetodoPago: 'Contado',
          Detalles: [{
            Id: 1,
            ProductoId: 3,
            PrecioUnitario: 0,
            Producto: 'HeadSet KDA Logitech',
            Cantidad: '2',
            Imagen: 'https://i.ibb.co/tzGyMxf/image.png',
            Existencias: 5,
            Total: 100
          }]
          
        },

        {
          Id: 1,
          ClienteId: 1,
          Cliente: 'Alessia Medina',
          RTN: '05012006017551',
          Fecha: '11/30/2023',
          MetodoPago: 'Crédito',
          Detalles: [{
            Id: 1,
            ProductoId: 3,
            PrecioUnitario: 0,
            Producto: 'HeadSet KDA Logitech',
            Cantidad: '6',
            Imagen: 'https://i.ibb.co/tzGyMxf/image.png',
            Existencias: 5,
            Total: 100
          }]
          
        },
      ];
      localStorage.setItem('listadoClientes', JSON.stringify(clientes));
      localStorage.setItem('listadoProductos', JSON.stringify(productos));
      localStorage.setItem('listadoFacturas', JSON.stringify(facturas));
      localStorage.setItem('TOKEN', "Logueado");

    }
  }

  Login() {
    if (this.username == "" || this.password == "") {
      ToastUtils.showWarningToast("Complete los campos para Iniciar Sesión");
      return;
    }

    if (this.username == "Admin" && this.password == "Admin123") {
      ToastUtils.showInfoToast(`Bienvenido Jafet Gomez`);

      localStorage.setItem("usua_ID", "1");
      localStorage.setItem("usua_Usuario", this.username);
      localStorage.setItem("nombreEmpleado", "Jafet Gomez");
      localStorage.setItem("usua_Img", "https://cdn-icons-png.flaticon.com/512/6073/6073873.png");

      this.service.incrementarContadorSesiones();
      const contadorSesiones = this.service.getContadorSesiones();
      localStorage.setItem('contadorSesiones', contadorSesiones.toString());




      this.router.navigate(['/dashboard']);
      this.username = "";
      this.password = "";
    }
    else {
      ToastUtils.showWarningToast("Usuario o Contraseña Incorrecta");
    }


  }
}

