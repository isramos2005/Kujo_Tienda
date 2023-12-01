import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  usua_Usuario = localStorage.getItem("usua_Usuario");
  nombreEmpleado = localStorage.getItem("nombreEmpleado");
  usua_Img = localStorage.getItem("usua_Img");

  constructor(@Inject(DOCUMENT) private document: Document, private router: Router) { }

  ngOnInit(): void {
  }
  sidebarToggle() {
    this.document.body.classList.toggle('toggle-sidebar');
  }

  DashBoard() {
    this.router.navigate(['dashboard'])
  }

  Log_Out() {
    localStorage.setItem('TOKEN', 'NoLogueado');
  
    // Reemplazar la entrada actual en el historial con la página de inicio después de cerrar sesión
    this.router.navigate(['pages-login']).then(() => {
      history.replaceState({}, '', this.router.createUrlTree(['pages-login']).toString());
    });
  }
  
  
}
