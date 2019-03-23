import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { CarritoService } from 'src/app/servicios/carrito.service';

declare let paypal: any;
@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit, AfterViewChecked {

  constructor(public auth: AuthService, public carritoService: CarritoService) { }
  uid;
  carrito;
  total: number;
  paypalLoad;
  addScript: boolean = false;
  ngOnInit() {
    this.getCarrito()
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
      size:  'medium',    // small | medium | large | responsive
      shape: 'rect',     // pill | rect
      color: 'gold',     // gold | blue | silver | black
      tagline: false      
  },
    client: {
        sandbox: 'AZC2Qq_ii09SCT7iRUTjEBrF4a8vx2nUi1ByXmLNT_A-iSsqOTQoyeX8AItdNDaDWiGhrsbwwlbx6nL1',
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
        return actions.payment.execute().then((payment) => {
            window.alert('Payment Complete!');
            // this.PruebaToOrder();
        })
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

  // PruebaToOrder(){
  //   let order: Order = {
  //     id: null,
  //     uid: this.User_id,
  //     product: this.cart.products,
  //     amount: this.totalIva,
  //     created_at: moment(new Date).format('DD/MM/YYYY')
  //   };

  //   this.orderService.save(order);
  //   this.CartService.resetCart(this.User_id).then(() => {
  //     this.router.navigate(['dashboard/compras']);
  //     alert("compraExitosa");
  //   })
  // }
}
