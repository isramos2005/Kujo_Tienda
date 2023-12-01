import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class AcceService {

  private contadorSesiones = 0;
  constructor(
      private http: HttpClient,
      private apiService: ApiService,

    ) { }

    getContadorSesiones(): number {
      return this.contadorSesiones;
    };

    incrementarContadorSesiones(): void {
      this.contadorSesiones++;
    };
   
}
