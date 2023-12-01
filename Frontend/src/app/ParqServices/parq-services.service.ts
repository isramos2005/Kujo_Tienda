import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Productos } from '../Models/Productos';
import { Cliente } from '../Models/Cliente';
import { Facturas } from '../Models/Facturas';
import { Departamento } from '../Models/Departamento';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class ParqServicesService {

  constructor(
    private http:HttpClient,
    private apiService: ApiService,
    ) { }



    getProductos(): Observable<any[]> {
      var listado = localStorage.getItem('listadoProductos');
    
      if (listado) {
        const productos: Productos[] = JSON.parse(listado);
        console.log(productos);
        return of(productos);
      } else {

        return of([]);
      }
    }
    
  
    createProducto(createProducto: Productos): Observable<any> {
      // Agregar createProducto al localStorage
      const listadoProductos = JSON.parse(localStorage.getItem('listadoProductos') || '[]');
      listadoProductos.push(createProducto);
      localStorage.setItem('listadoProductos', JSON.stringify(listadoProductos));
      
      return new Observable(observer => {
        const response = { code: 200, message: 'Registro Agregado Exitosamente', data: listadoProductos };
        observer.next(response);
        observer.complete();
      });
    };
  
    updateProducto(UpdateProducto: Productos): Observable<any> {
      const listadoProductos: Productos[] = JSON.parse(localStorage.getItem('listadoProductos') || '[]');
      const index = listadoProductos.findIndex(producto => producto.Id === UpdateProducto.Id);
    
      if (index !== -1) {
        listadoProductos.splice(index, 1);
    
        listadoProductos.push(UpdateProducto);
        localStorage.setItem('listadoProductos', JSON.stringify(listadoProductos));
    
        const response = { code: 200, message: 'Registro Actualizado Exitosamente', data: listadoProductos };
    
        return new Observable(observer => {
          observer.next(response);
          observer.complete();
        });
      } else {
        const response = { code: 404, message: 'No se encontró el producto para actualizar', data: null };
    
        return new Observable(observer => {
          observer.error(response);
        });
      }
    }
    
  
    deleteProducto(DeleteProducto: Productos) : Observable<any> {
      const listadoProductos: Productos[] = JSON.parse(localStorage.getItem('listadoProductos') || '[]');
      const index = listadoProductos.findIndex(producto => producto.Id === DeleteProducto.Id);
    
      if (index !== -1) {
        listadoProductos.splice(index, 1);
    
        localStorage.setItem('listadoProductos', JSON.stringify(listadoProductos));
    
        const response = { code: 200, message: 'Registro Eliminado Exitosamente', data: listadoProductos };
    
        return new Observable(observer => {
          observer.next(response);
          observer.complete();
        });
      } else {
        const response = { code: 404, message: 'No se encontró el producto para Eliminar', data: null };
    
        return new Observable(observer => {
          observer.error(response);
        });
      }
    }
    

    getCliente(): Observable<any[]> {
      var listado = localStorage.getItem('listadoClientes');
    
      if (listado) {
        const cliente: Cliente[] = JSON.parse(listado);
       
        return of(cliente);
      } else {

        return of([]);
      }
    }
    
  
    createCliente(createCliente: Cliente): Observable<any> {

      const listadoClientes = JSON.parse(localStorage.getItem('listadoClientes') || '[]');
      listadoClientes.push(createCliente);
      localStorage.setItem('listadoClientes', JSON.stringify(listadoClientes));
      
      return new Observable(observer => {
        const response = { code: 200, message: 'Registro Agregado Exitosamente', data: listadoClientes };
        observer.next(response);
        observer.complete();
      });
    };
  
    updateCliente(UpdateCliente: Cliente): Observable<any> {
      const listadoClientes: Cliente[] = JSON.parse(localStorage.getItem('listadoClientes') || '[]');
      const index = listadoClientes.findIndex(Cliente => Cliente.Id === UpdateCliente.Id);
    
      if (index !== -1) {
        listadoClientes.splice(index, 1);
    
        listadoClientes.push(UpdateCliente);
        localStorage.setItem('listadoClientes', JSON.stringify(listadoClientes));
    
        const response = { code: 200, message: 'Registro Actualizado Exitosamente', data: listadoClientes };
    
        return new Observable(observer => {
          observer.next(response);
          observer.complete();
        });
      } else {
        const response = { code: 404, message: 'No se encontró el producto para actualizar', data: null };
    
        return new Observable(observer => {
          observer.error(response);
        });
      }
    }
    
  
    deleteCliente(DeleteCliente: Cliente) : Observable<any> {
      const listadoClientes: Cliente[] = JSON.parse(localStorage.getItem('listadoProductos') || '[]');
      const index = listadoClientes.findIndex(Cliente => Cliente.Id === DeleteCliente.Id);
    
      if (index !== -1) {
        listadoClientes.splice(index, 1);
    
        localStorage.setItem('listadoClientes', JSON.stringify(listadoClientes));
    
        const response = { code: 200, message: 'Registro Eliminado Exitosamente', data: listadoClientes };
    
        return new Observable(observer => {
          observer.next(response);
          observer.complete();
        });
      } else {
        const response = { code: 404, message: 'No se encontró el producto para Eliminar', data: null };
    
        return new Observable(observer => {
          observer.error(response);
        });
      }
    }

    
    getFacturas(): Observable<any[]> {
      var listado = localStorage.getItem('listadoFacturas');
    
      if (listado) {
        const facturas: Facturas[] = JSON.parse(listado);
       
        return of(facturas);
      } else {

        return of([]);
      }
    }

    deleteFactura(DeleteFactura: Facturas) : Observable<any> {
      const listadoClientes: Cliente[] = JSON.parse(localStorage.getItem('listadoProductos') || '[]');
      const index = listadoClientes.findIndex(Cliente => Cliente.Id === DeleteFactura.Id);
    
      if (index !== -1) {
        listadoClientes.splice(index, 1);
    
        localStorage.setItem('listadoClientes', JSON.stringify(listadoClientes));
    
        const response = { code: 200, message: 'Registro Eliminado Exitosamente', data: listadoClientes };
    
        return new Observable(observer => {
          observer.next(response);
          observer.complete();
        });
      } else {
        const response = { code: 404, message: 'No se encontró el producto para Eliminar', data: null };
    
        return new Observable(observer => {
          observer.error(response);
        });
      }
    }

    getDepartamentosAPI(): Observable<Departamento[]> {
      return this.http.get<Departamento[]>(`${this.apiService.apiUrl}Departamentos/Index`);
    }
  
    insertDepartamentoAPI(departamentoPost: Departamento): Observable<Departamento[]> {
      console.log(departamentoPost);
      return this.http.post<Departamento[]>(`${this.apiService.apiUrl}Departamentos/Insert`, departamentoPost);
    }
  
    editDepartamentoAPI(departamentoUpdate: Departamento): Observable<Departamento[]> {
      return this.http.put<Departamento[]>(`${this.apiService.apiUrl}Departamentos/Update`, departamentoUpdate);
    }
  
    deleteDepartamentoAPI(departamentoDelete: Departamento): Observable<Departamento[]> {
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        body: departamentoDelete
      };
  
      return this.http.delete<Departamento[]>(`${this.apiService.apiUrl}Departamentos/Delete`, httpOptions);
    }
  
}
