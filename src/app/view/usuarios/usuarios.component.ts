import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  constructor(public usuarioService: UsuarioService) { }
  usuarios;

  ngOnInit() {
    this.getUsuarios()
  }
  getUsuarios(){
    this.usuarioService.ObtenerUsuarios().subscribe(usuarios => this.usuarios = usuarios);
  }
  ActivarUsuario(usuario){
    usuario.isActive = true;
    this.usuarioService.ActualizarUsuario(usuario)
  }
  DesactivarUsuario(usuario){
    usuario.isActive = false;
    this.usuarioService.ActualizarUsuario(usuario)
  }
}
