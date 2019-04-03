import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { CarritoService } from 'src/app/servicios/carrito.service';
import { Compra } from 'src/app/models/compra';
import * as moment from 'moment';
import { CompraService } from 'src/app/servicios/compra.service';
import { Router } from '@angular/router';
import { ProductoService } from 'src/app/servicios/producto.service';
import * as jsPDF from 'jspdf';

declare let paypal: any;

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit, AfterViewChecked {

  constructor(public auth: AuthService, public carritoService: CarritoService, public ComprasService: CompraService, private router: Router, 
    public productoService: ProductoService) { }
  uid;
  carrito;
  productos = [];
  total: number;
  paypalLoad;
  addScript: boolean = false;
  prueba: boolean = true;
  mostrar: boolean = false;
  nombre = "";
  apellido = "";
  ciudad ="";
  estado= "";
  direccion ="";
  fechaFactura;
  @ViewChild('content') content: ElementRef

  ngOnInit() {
    this.getCarrito()
    this.fechaFactura = moment(new Date).format('DD/MM/YYYY')
  }

  downloadPDF(){
    var doc = new jsPDF({
      orientation: 'landscape',
    })
    

    let specialElementHandlers = {
      '#editor': function(element,renderer) {
        return true;
      }
    };
    let content = this.content.nativeElement;

    doc.fromHTML(content.innerHTML,20,0,{
      'width':60,
      'elementHandlers': specialElementHandlers
    });

    doc.save('factura.pdf');
  }

  getCarrito(){
    this.auth.User.subscribe(user => {
      this.uid = user.uid;
      if(user){
          this.carritoService.MiCarrito(user.uid).subscribe(Cart => {
            this.carrito = Cart.payload.data();
            this.getTotal(this.carrito)
          })
      }
    })
  }
  LimpiarCarrito(){
    this.carritoService.resetCart(this.uid);
  }

  getTotal(carrito){
    this.total = this.carritoService.totalPrice(carrito.products);
  }

  // Variable paypalConfig
  paypalConfig = {
    env: 'sandbox',

    style: {
      label: 'paypal',
      size:  'medium',   
      shape: 'rect',     
      color: 'silver',     
      tagline: false      
  },
    client: {
        sandbox: 'AZQAWe78bKpRVpd3vzZ7X1Mzuiuj87QvVHPUawuBoV_RSZe0CTH4hXsOAi4aLDhQCySMITMd8MLNU-oj',
        production: '<production-key>'
    },
    commit: true,
    payment: (data, actions) => {
        return actions.payment.create({
            payment: {
                transactions: [
                    {
                        amount: { total: this.total , currency: 'USD' }
                    }
                ]
            }
        })
    },
  
    // onAuthorize() is called when the buyer approves the payment
    onAuthorize:(data, actions) => {
  
        // Make a call to the REST api to execute the payment
        if(this.DataVerified() == true){
          return actions.payment.execute().then((payment) => {
            this.RegistrarCompra();
        })
        }else{
          alert("Por favor rellene todos los datos del formulario");
        }

    }
  };
  
  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    if(!this.addScript) {
      this.addPaypalScript().then(() => {
        paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
        this.paypalLoad = true;
      })
    }
  }

  addPaypalScript(){
      this.addScript = true;
      return new Promise((resolve, reject) => {
        let scriptElement = document.createElement('script');
        scriptElement.src = 'https://www.paypalobjects.com/api/checkout.js'
        scriptElement.onload = resolve;
        document.body.appendChild(scriptElement);
      })
  }

  DataVerified(){
    if(this.nombre == ""){
      return false;

    }else if(this.apellido == ""){
      return false;

    }else if(this.ciudad == ""){
      return false;

    }else if(this.estado == ""){
      return false;

    }else if(this.direccion == ""){
      return false;

    }else{
      return true
    }
  }

   RegistrarCompra(){
    let Compra: Compra = {
      id: null,
      uid: this.uid,
      product: this.carrito.products,
      amount: this.total,
      created_at: moment(new Date).format('DD/MM/YYYY')
    }
    this.productoService.ventaProducto(this.carrito.products, Compra, this.uid);
  }

}