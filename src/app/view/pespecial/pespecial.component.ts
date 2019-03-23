import { Component, OnInit, TemplateRef } from '@angular/core';
import { Product } from 'src/app/models/product';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { RecomendadoService } from 'src/app/servicios/recomendado.service';
import { PromocionService } from 'src/app/servicios/promocion.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-pespecial',
  templateUrl: './pespecial.component.html',
  styleUrls: ['./pespecial.component.css']
})
export class PespecialComponent implements OnInit {
  productosRecomendados;
  productosPromocionales;
  productoPrecio;
  productoRecomendado;
  productoPromocional;
  confirmRecoRef: BsModalRef;
  confirmPromoRef: BsModalRef;
  PrecioRef: BsModalRef;
  priceValue;
  constructor(private modalService: BsModalService, public recomendadoService: RecomendadoService, public promocionService: PromocionService) { }

  ngOnInit() {
    this.getProducts();
  }
  getProducts(){
    this.recomendadoService.Productos().subscribe(productos => this.productosRecomendados = productos);
    this.promocionService.Productos().subscribe(productos => this.productosPromocionales = productos);
  }
  deleteRecomendado(){
    this.confirmRecoRef.hide();
    console.log(this.productoRecomendado);
    this.recomendadoService.deleteProducto(this.productoRecomendado);
    
  }
  deletePromo(){
    this.confirmPromoRef.hide();
    console.log(this.productoPromocional);
    this.promocionService.deleteProducto(this.productoPromocional);
}
  openEditPrecio(template: TemplateRef<any>, product){
    this.PrecioRef = this.modalService.show(template);
    this.PrecioRef.hide();
    this.productoPrecio = product;
    this.priceValue = product.price;
  }
  openConfirmRecomendado(template: TemplateRef<any>, product) {
    this.confirmRecoRef = this.modalService.show(template);
    this.confirmRecoRef.hide();
    this.productoRecomendado = product;
  }
  openConfirmPromo(template: TemplateRef<any>, product){
    this.confirmPromoRef = this.modalService.show(template);
    this.confirmPromoRef.hide();
    this.productoPromocional = product;
  }
  ActualizarPrecio(form: NgForm){
    if(form.value.precio != undefined){
      this.promocionService.modificarPrecio(this.productoPrecio, form.value.precio);
      alert("se actualizo el precio del producto");
      this.PrecioRef.hide()
    }else{
      alert("Inserte un precio");
    }
  }
}
