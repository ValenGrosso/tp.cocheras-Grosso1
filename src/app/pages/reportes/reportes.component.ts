// import { Component, inject, OnInit } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import { HeaderComponent } from "../../components/header/header.component";
// import { AuthService } from '../../services/auth.service';
// import { EstacionamientosService } from '../../services/estacionamientos.service';
// import { CocherasService } from '../../services/cocheras.service';
// import { CommonModule } from '@angular/common';
// import { NgModule } from '@angular/core';
// import { ReportesComponent } from './reportes.component';


// @Component({
//   selector: 'app-reportes',
//   standalone: true,
//   imports: [RouterModule, HeaderComponent],
//   templateUrl: './reportes.component.html',
//   styleUrl: './reportes.component.scss'
// })
// export class ReportesComponent {

//   cocheras = inject(CocherasService);
// 	auth = inject(AuthService);
// 	estacionamientos = inject(EstacionamientosService);
  
//   ngOnInit(): void {
//     this.traerEstacionamientos();
//   }

//   traerEstacionamientos() {
//     return fetch('http://localhost:4000/estacionamientos', {
//       method: 'GET',
//       headers: {
//         authorization: 'Bearer ' + this.auth.getToken() 
//       }
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         this.estacionamientos = data; // Guarda los datos en `estacionamientos`
//         console.log("Lista de estacionamientos traída del servidor:", this.estacionamientos);
//         return data;
//       })
//       .catch((error) => {
//         console.error("Error fetching estacionamientos:", error);
//       });
//   }
// }

import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Estacionamiento } from '../../interfaces/estacionamiento';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent,
    CommonModule // Importamos CommonModule para poder usar *ngFor y el pipe currency
  ],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {

  auth = inject(AuthService);
  estacionamientos: Estacionamiento[] = [];
  reporteEstacionamientos: any[] = [];

  ngOnInit(): void {
    this.traerEstacionamientos();
  }

  traerEstacionamientos() {
    fetch('http://localhost:4000/estacionamientos', {
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + this.auth.getToken()
      }
    })
      .then((response) => response.json())
      .then((data: Estacionamiento[]) => { // Especificamos el tipo de data como Estacionamiento[]
        // Filtramos las cocheras que tienen horaEgreso (es decir, que ya fueron usadas y cerradas)
        const historialEstacionamientos = data.filter(estacionada => estacionada.horaEgreso != null);

        // Inicializamos variables auxiliares
        const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const mesesTrabajo: string[] = [];

        // Procesamos cada estacionamiento cerrado
        for (let estacionada of historialEstacionamientos) {
          const estacionadaConDate = { ...estacionada, horaIngreso: new Date(estacionada.horaIngreso) };
          const periodo = meses[estacionadaConDate.horaIngreso.getMonth()] + " " + estacionadaConDate.horaIngreso.getFullYear();

          // Si el mes no está en la lista de meses de trabajo, lo agregamos y creamos un nuevo registro
          if (!mesesTrabajo.includes(periodo)) {
            mesesTrabajo.push(periodo);
            this.reporteEstacionamientos.push({
              nro: this.reporteEstacionamientos.length + 1,
              mes: periodo,
              usos: 1,
              cobrado: estacionada.costo ?? 0
            });
          } else {
            // Si el mes ya está, encontramos el reporte y actualizamos usos y cobrado
            const reporte = this.reporteEstacionamientos.find(r => r.mes === periodo);
            if (reporte) {
              reporte.usos++;
              reporte.cobrado += estacionada.costo ?? 0;
            }
          }
        }

        console.log("Reporte de estacionamientos agrupado:", this.reporteEstacionamientos);
      })
      .catch((error) => {
        console.error("Error fetching estacionamientos:", error);
      });
  }
}




