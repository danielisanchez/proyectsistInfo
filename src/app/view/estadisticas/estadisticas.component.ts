import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/servicios/producto.service';
import { CompraService } from 'src/app/servicios/compra.service';
import { EstadisticasService } from 'src/app/servicios/estadisticas.service';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { ChartType, ChartOptions } from 'chart.js';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ["Hogar", "Electro", "Arte"];
  public pieChartData: SingleDataSet = [100, 100, 100];
  public pieChartType:ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(public productoService:ProductoService, public compraService: CompraService, public estadisticaService: EstadisticasService, public afs: AngularFirestore
    ) {
      monkeyPatchChartJsTooltip();
      monkeyPatchChartJsLegend();
     }
  limite: number = 6;
  limit: number = 6;
  checkLimit = false;
  TotalGanancia;
  GananciaDept;
  productosMasVendidos;
  compras;
  totalProductos;

  ngOnInit() {
    var sub = this.compraService.obtenerCompras().subscribe(compras => {
      this.compras = compras
      sub.unsubscribe();
    }).add(() => {
      this.TotalGanancia = this.compraService.GananciasTotales(this.compras);
      this.GananciaDept = this.estadisticaService.GananciasPorDept(this.compras);
      this.totalProductos = this.estadisticaService.CantidadProductosVendidos(this.compras);
      this.pieChartData = this.GananciaDept;
    });
    this.productoService.ProductosMasVendidos().subscribe(productos => this.productosMasVendidos = productos);
  }
  prueba(){
    console.log(this.GananciaDept);
  }
  public chartClicked(e:any):void {
    console.log(e);
  }
 
 // event on pie chart slice hover
  public chartHovered(e:any):void {
    console.log(e);
  }
  CheckedLimit(){
    this.checkLimit = true;
  }
  filtro(){
    this.limiteFunction();
    this.checkLimit = false;
  }

  limiteFunction(){
    if(this.limite == null){
      alert("Ingrese un valor");
    }else{
      this.productoService.ProductosMasVendidosLimite(this.limite).subscribe(productos => this.productosMasVendidos = productos);
      this.limit = this.limite;
    }
  }
}
