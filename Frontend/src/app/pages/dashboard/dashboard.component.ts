import { Component, OnInit, ElementRef } from '@angular/core';
import { ParqServicesService } from 'src/app/ParqServices/parq-services.service';
import { Router } from '@angular/router';
import { ToastUtils } from 'src/app/Utilities/ToastUtils';
import { Facturas } from 'src/app/Models/Facturas';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  data: any[] = [];
  porcentajeContado = 0;
  porcentajeCredito = 0;
  constructor(
    private service: ParqServicesService,
    private router: Router,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.Token();
    this.Grafico();
    window.addEventListener('resize', this.checkZoomLevel.bind(this));
  }

  Token(){
    const Token = localStorage.getItem('TOKEN');

    if (Token == 'NoLogueado') {
      this.router.navigate(['pages-login']);
      return;
    }
  }
  checkZoomLevel() {
    var zoomLevel = Math.round(window.devicePixelRatio * 100);
    if (zoomLevel < 90) {
      ToastUtils.showInfoToast('Para un uso óptimo de los recursos de la aplicación, mantenga el zoom en 90%.');
    }
  }

  Grafico() {
    const facturas = localStorage.getItem('listadoFacturas');
    let listadoFacturas: Facturas[] = [];
    if (facturas) {
      listadoFacturas = JSON.parse(facturas);
    }
    let contado = 0;
    let credito = 0;

    console.log(listadoFacturas)
    listadoFacturas.forEach((factura) => {
      if (factura.MetodoPago === 'Contado') {
        contado = +contado + 1;
      }
      if (factura.MetodoPago === 'Crédito') {
        credito = +credito + 1;
      }
    });

    const totalFacturas = listadoFacturas.length;
     this.porcentajeContado = (contado / totalFacturas) * 100;
     this.porcentajeCredito = (credito / totalFacturas) * 100;

    this.data = [
      {
        name: 'Contado',
        value: contado,

      },
      {
        name: 'Crédito',
        value: credito,
      },
    ];
  }
}
