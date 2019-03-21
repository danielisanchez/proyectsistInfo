import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subject, combineLatest} from 'rxjs';
import { ProductoService } from 'src/app/servicios/producto.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-electrodomestico',
  templateUrl: './electrodomestico.component.html',
  styleUrls: ['./electrodomestico.component.css']
})
export class ElectrodomesticoComponent implements OnInit {
  searchterm;
  startAt = new Subject();
  endAt = new Subject();
  startObs = this.startAt.asObservable();
  endObs = this.endAt.asObservable();
  productos;
  constructor(public auth: AuthService, public productoService: ProductoService, public afs: AngularFirestore){ }

  ngOnInit() {
    this.getProducts()
    combineLatest(this.startObs, this.endObs).subscribe((value) => {
      this.firequery(value[0], value[1]).subscribe((electrodomesticos) => {
        this.productos = electrodomesticos;
      })
    })
  }
  getProducts() {
    this.productoService.ProductosElectro().subscribe(productos => this.productos = productos);
  }
  search(event){
    const q = event;
    if(q!==null){
      this.startAt.next(q);
      this.endAt.next(q + '\uf8ff');
    }else{
      this.getProducts();
    }
  }
  firequery(start,end){
    return this.afs.collection('products', ref => ref.orderBy('name').where("department", "==", "electrodomesticos")
    .startAt(start).endAt(end)).valueChanges();  
  }
  //Filtro nombre ascendiente
  NameAsc(){
    return this.afs.collection('products', ref => ref.orderBy("name", "asc")).valueChanges();
  }
  // Filtro nombre descendiente
  NameDes(){
    return this.afs.collection('products', ref => ref.orderBy("name", "desc")).valueChanges();
  }
  // Filtro Precio ascendiente
  PrecioAsc(){
    return this.afs.collection('products', ref => ref.orderBy("price", "asc")).valueChanges();
  }
  // Filtro precio descendiente
  PrecioDesc(){
    return this.afs.collection('products', ref => ref.orderBy("price", "desc")).valueChanges();
  }
  // Precio entre valores
  PrecioEntre(menor:number, mayor:number){
    if(menor<= mayor){
      return this.afs.collection('products', ref => ref.where("price", ">=",menor).where("price","<=",mayor)).valueChanges();
    }else{
      alert("Error en los valores suminstrados")
    }
  }
}
