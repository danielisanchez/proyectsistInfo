import { Component, OnInit, TemplateRef} from '@angular/core';
import { Product } from 'src/app/models/product';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ProductoService } from 'src/app/servicios/producto.service';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  searchterm
  productoNuevo: Product = new Product()
  createModalRef: BsModalRef;
  uploadProgress: Observable<number>; 
  constructor(private productService: ProductoService, 
    private modalService: BsModalService, 
    private router: Router,
    private storage: AngularFireStorage,
    public afs: AngularFirestore
    ) { }

  ngOnInit() {
  }
  openCreateModal(template: TemplateRef<any>){
    this.productoNuevo.name = "";
    this.productoNuevo.description = "";
    this.productoNuevo.price = 0;
    this.productoNuevo.department = "";
    this.productoNuevo.variacion = [];
    this.productoNuevo
    this.createModalRef = this.modalService.show(template, {class: 'modal-lg'})
  }
  search(){

  }
  openModal3(){

  }
  openModal(){

  }
  upload(){

  }
}
