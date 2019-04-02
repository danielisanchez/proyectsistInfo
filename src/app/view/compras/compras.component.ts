import { Component, OnInit, TemplateRef } from '@angular/core';
import { CompraService } from 'src/app/servicios/compra.service';
import { AuthService } from 'src/app/auth/auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {
  compras: any;
  modalRef: BsModalRef;

  constructor(private comprasService: CompraService,
    private auth: AuthService, 
    private modalService: BsModalService,
    private afs: AngularFirestore) { }

  ngOnInit() {
    this.getCompras()
  }
  getCompras() {
    this.auth.User.subscribe(user => {
      if(user){
        this.comprasService.obtenerCompras(user.uid).subscribe(compras => this.compras = compras);
      }
    })
  }
  DetalleProductos(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    console.log(this.compras);
  }
}
