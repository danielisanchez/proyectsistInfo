import { Component, OnInit, TemplateRef} from '@angular/core';
import { Product } from 'src/app/models/product';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ProductoService } from 'src/app/servicios/producto.service';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Variacion } from 'src/app/models/variacion';
import { PilotoService } from 'src/app/servicios/piloto.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  productoNuevo: Product = new Product()
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  confirmRef: BsModalRef;
  createModalRef: BsModalRef;
  createModalRef2: BsModalRef;
  createModalRef3: BsModalRef;
  uploadProgress: Observable<number>; 
  image: string = null;
  ref: AngularFireStorageReference;
  downloadURL: Observable<string>;
  OpcionDepartamento: string;
  OpcionDep: string;
  OpcionVar: Variacion[] = [];
  SelectedVar: string;
  productos;
  nameValue;
  descriptionValue;
  priceValue;
  productoSelecionado: Product;
  piloto: any;

  constructor(private productService: ProductoService, 
    private modalService: BsModalService, 
    private router: Router,
    private storage: AngularFireStorage,
    public afs: AngularFirestore,
    public pilotoService: PilotoService
    ) { }

  ngOnInit() {
    this.getProducts();
    this.pilotoService.getPiloto().subscribe(element => this.piloto = element);
  }
  deshabilitar(){
    alert("modo piloto desactivado");
    this.pilotoService.deshabilitarPiloto()
  }
  
  habilitar(){
    alert("modo piloto activado");
    this.pilotoService.habilitarPiloto()
  }
  openCreateModal(template: TemplateRef<any>){
    this.productoNuevo.name = "";
    this.productoNuevo.description = "";
    this.productoNuevo.price = 0;
    this.productoNuevo.department = "";
    this.image = null;
    this.productoNuevo.variaciones = [];
    this.productoNuevo
    this.createModalRef = this.modalService.show(template, {class: 'modal-lg'})
  }
  getProducts(){
    this.productService.Productos().subscribe(productos => this.productos = productos);
  }
  openConfirm(template: TemplateRef<any>, product: Product) {
    this.confirmRef = this.modalService.show(template);
    this.confirmRef.hide();
    this.productoSelecionado = product;
  }
  editProduct(template: TemplateRef<any>, editProduct: Product) {
    this.productoSelecionado = editProduct;
    this.nameValue=this.productoSelecionado.name;
    this.descriptionValue = this.productoSelecionado.description;
    this.priceValue = this.productoSelecionado.price;
    this.OpcionDep = this.productoSelecionado.department;
    this.OpcionVar = this.productoSelecionado.variaciones;
    this.modalRef = this.modalService.show(template, { class: 'gray modal-lg'});
  }
  delete(){
      this.confirmRef.hide();
      var productoEliminar ={
        id: this.productoSelecionado.id,
        name: this.productoSelecionado.name,
        price: this.productoSelecionado.price,
        description: this.productoSelecionado.description,
        photoUrl: this.productoSelecionado.photoUrl,
        department: this.productoSelecionado.department,
        variacion: this.productoSelecionado.variaciones
      }
      this.productService.deleteProducto(productoEliminar);
      
  }
  upload(event) 
  {
    // Obtiene la imagen:
    const file = event.target.files[0];
    
    // Genera un ID random para la imagen:
    const randomId = Math.random().toString(36).substring(2);
    const filepath = `Imágenes/products/${randomId}`;
    // Cargar imagen:
    const task = this.storage.upload(filepath, file);
    this.ref = this.storage.ref(filepath);
    // Observa los cambios en el % de la barra de progresos:
    this.uploadProgress = task.percentageChanges();
    // Notifica cuando la URL de descarga está disponible:
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = this.ref.getDownloadURL();  
        this.downloadURL.subscribe(url => {this.image = url} );
      })
    ).subscribe();
  }
  openVariaciones(template: TemplateRef<any>){
    this.createModalRef2 = this.modalService.show(template, { class: 'second' });
    this.createModalRef.hide();
  }
  openVariacionesEdit(template: TemplateRef<any>){
    this.createModalRef3 = this.modalService.show(template, { class: 'second' });
    this.modalRef.hide();
  }
  deleteVariaciones(Variacion){
    this.SelectedVar = Variacion;
    this.productoSelecionado.variaciones.forEach(element => {
      if(this.SelectedVar === element.value){
        var index = this.productoSelecionado.variaciones.indexOf(element);
        this.productoSelecionado.variaciones.splice(index,1);
      }
    })
  }

  createProduct(form: NgForm){
    if(form.value.name === ""){
      alert("Debe insertar un nombre");
      return;
    }else if(form.value.descripcion === ""){
      alert("Debe insertar una descripcion");
      return;
    }else if(form.value.precio === ""){
      alert("Debe insertar un precio");
      return;
    }else if(this.OpcionDepartamento === ""){
      alert("Debe seleccionar un departamento");
      return;
    } else if(this.image == null){
      alert("Debe seleccionar una foto");
      return;
    }else{
      var productoNuevo = {
        name: form.value.name,
        price: form.value.precio,
        description: form.value.descripcion,
        photoUrl: this.image,
        department: this.OpcionDepartamento, 
        variaciones: this.productoNuevo.variaciones,
      }
    }         
    this.image=null;
    this.productService.crearProducto(productoNuevo);
    this.createModalRef.hide();
    this.createModalRef =null;
  }
  updateProduct(form: NgForm){
    if(form.value.name != ""){
      this.productoSelecionado.name = form.value.name;
    }
    if(form.value.descripcion != ""){
      this.productoSelecionado.description = form.value.descripcion;
    }
    if(form.value.precio != undefined){
      this.productoSelecionado.price = form.value.precio;
    }
    if(this.OpcionDep != undefined){
      this.productoSelecionado.department = this.OpcionDep;
    }
    if(this.image!=null)
    {
      this.productoSelecionado.photoUrl=this.image;
      this.image=null;
    }
    this.productService.updateProducto(this.productoSelecionado);
    this.modalRef.hide();
  }

    AgregarVariacionCreate(form: NgForm, template: TemplateRef<any>){
      if(form.value.variacionValue === ""){
        alert("Debe insertar un valor");
        return;
      } else {
        var valorVariacion = form.value.variacionValue
         var variacion = { 
           value: valorVariacion
        }
        this.productoNuevo.variaciones.push(variacion);
        this.closeVariacionModal(template)
      }
    }
    editVariacion(form: NgForm, template: TemplateRef<any>){
      if(form.value.variacionValue === ""){
        alert("Debe insertar un valor");
        return;
      } else {
        var valorVariacion = form.value.variacionValue
         var variacion = { 
           value: valorVariacion
        }
        this.productoSelecionado.variaciones.push(variacion);
        this.closeVariacionEditModal(template)
      }
    }
    closeVariacionModal(template: TemplateRef<any>){
    this.createModalRef2.hide();
    this.modalRef2 = null;
    this.createModalRef = this.modalService.show(template, {class: 'modal-lg'})
  }
  closeVariacionEditModal(template: TemplateRef<any>){
    this.createModalRef3.hide();
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'})
  }
}
