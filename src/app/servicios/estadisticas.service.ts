import { Injectable } from '@angular/core';
import { ProductoService } from './producto.service';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  constructor(public productoService: ProductoService) { }
  depHogar: boolean = false;
  depElectro: boolean = false;
  depArte: boolean = false;
  gananciasDep = [0,0,0]; //HOGAR/ARTE/ELECTRO
  TotalProductos: number = 0;

  GananciasPorDept(compras): number[] {
    compras.forEach(compra => {
      compra.product.forEach(element => {
        var sub = this.productoService.getProducto(element.id).subscribe(producto =>{
          if(producto.department == 'electrodomesticos'){
            this.depElectro = true;
          }else if(producto.department == 'hogar'){
            this.depHogar = true;
          }else if(producto.department == 'arte'){
            this.depArte = true;
          }
          sub.unsubscribe();
        }).add(() => {
          if(this.depElectro == true){
            this.gananciasDep[2] += parseInt(element['price']) * element['qty']; 
          }
          if(this.depArte == true){
            this.gananciasDep[1] += parseInt(element['price']) * element['qty']; 
          }
          if(this.depHogar == true){
            this.gananciasDep[0] += parseInt(element['price']) * element['qty']; 
          }
          this.reset()
        })
      });
    })
    return this.gananciasDep;
  }

  CantidadProductosVendidos(compras): number{
    compras.forEach(compra => {
      compra.product.forEach(element => {
        this.TotalProductos = this.TotalProductos + element['qty'];
      });
    });
    return this.TotalProductos;
  }

  reset(){
    this.depArte = false;
    this.depElectro = false;
    this.depHogar = false;
  }
}
