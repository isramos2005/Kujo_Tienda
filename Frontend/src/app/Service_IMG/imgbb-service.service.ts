import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImgbbService {
  private apiKey = '3b346fac515eaa6d6e2de7f6387c7186';

  constructor(private http: HttpClient) {}

  Upload_IMG(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    console.log(formData);
    return this.http.post<any>(`https://api.imgbb.com/1/upload?key=${this.apiKey}`, formData);
  }
}
