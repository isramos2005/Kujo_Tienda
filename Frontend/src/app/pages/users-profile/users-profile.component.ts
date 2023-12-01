import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users-profile',
  templateUrl: './users-profile.component.html',
  styleUrls: ['./users-profile.component.css']
})
export class UsersProfileComponent implements OnInit {
  usua_Usuario = localStorage.getItem("usua_Usuario");
  nombreEmpleado = localStorage.getItem("nombreEmpleado");
  usua_Img = localStorage.getItem("usua_Img");
  
  constructor() { }

  ngOnInit(): void {
    
  }

}
