
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Cochera } from '../../interfaces/cochera'
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from "../../components/header/header.component";
import { CocherasService } from '../../services/cocheras.service';
import { Estacionamiento } from '../../interfaces/estacionamiento';
import Swal from 'sweetalert2';
import { EstacionamientosService } from '../../services/estacionamientos.service';
import 'boxicons';

@Component({
	selector: 'app-estado-cocheras',
	standalone: true,
	imports: [RouterModule, CommonModule, HeaderComponent],
	templateUrl: './estado-cocheras.component.html',
	styleUrl: './estado-cocheras.component.scss'
})
export class EstadoCocherasComponent implements OnInit {
	esAdmin: boolean = false;
	titulo: string = 'Estado de la cochera';
	header: { nro: string; disponibilidad: string; ingreso: string; acciones: string } = {
		nro: 'Número',
		disponibilidad: 'Disponibilidad',
		ingreso: 'Ingreso',
		acciones: 'Acciones'
	};

	filas:Cochera[]=new  Array();

	siguienteNumero: number = 1;

	cocheras = inject(CocherasService);
	auth = inject(AuthService);
	estacionamientos = inject(EstacionamientosService);

	// agregarFila() {
	// 	// this.filas.push({
	// 	//   nro: this.siguienteNumero,
	// 	//   disponibilidad: true,
	// 	//   ingreso: new Date().toLocaleDateString(),
	// 	//   acciones: '-',
	// 	//   id: 0,
	// 	//   activo: null
	// 	// });
	// 	fetch('http://localhost:4000/cocheras/', {
	// 		method: 'POST',
	// 		headers: {
	// 			Authorization: 'Bearer ' + this.auth.getToken(),
	// 			'Content-Type': 'application/json',
	// 		},
	// 		body: JSON.stringify({
	// 			descripcion: ""

	// 		})

	// 	}).then(() => {
	// 		this.traerCocheras().then((filas) => {
	// 			this.filas = filas;
	// 		});
	// 	}).catch(error => {
	// 		console.error('Error en la solicitud:', error); // Manejamos errores
	// 	});
	// 	this.siguienteNumero += 1;
	// }
	async agregarFila() {
		const { value: nombreCochera } = await Swal.fire({
			title: "Ingrese el nombre de la cochera",
			input: "text",
			inputLabel: "Nombre de cochera",
			inputValue: '',
			showCancelButton: true,
			// inputValidator: (value) => {
			// 	if (!value) {
			// 		return "Debe escribir un nombre para la cochera!";
			// 	}
			// }
		});
	
		if (nombreCochera) {
			// Enviar la solicitud de agregar fila con el nombre de la cochera
			fetch('http://localhost:4000/cocheras/', {
				method: 'POST',
				headers: {
					Authorization: 'Bearer ' + this.auth.getToken(),
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					descripcion: nombreCochera
				})
			}).then(() => {
				this.traerCocheras().then((filas) => {
					this.filas = filas;
				});
			}).catch(error => {
				console.error('Error en la solicitud:', error);
			});
			this.siguienteNumero += 1;
		}
	}





	traerCocheras() {
		return fetch('http://localhost:4000/cocheras/', {
			method: 'GET',
			headers: {
				authorization: 'Bearer ' + this.auth.getToken()
			}
		}).then((response) => response.json())
			.then((filas) => {
				this.filas = filas; // Inicializa `filas` con la lista obtenida
				console.log("Lista de cocheras traída del servidor:", this.filas);
				return filas;
			});
	}



	eliminarFila(cocheraId: number) {
		fetch('http://localhost:4000/cocheras/' + cocheraId, {
			method: 'DELETE',
			headers: {
				Authorization: 'Bearer ' + this.auth.getToken() // Corregido el espacio
			}
		}).then(() => {
			this.traerCocheras().then((filas) => {
				this.filas = filas;
			});
		});
	}



	/** Cambia la disponibilidad de una cochera, si está habilitada se deshabilita y viceversa */
	// cambiarDisponibilidadCochera(numeroFila: number) {
	// 	this.filas[numeroFila].disponibilidad = !this.filas[numeroFila].disponibilidad;
	//}

	// cambiarDisponibilidadCochera(numeroFila: number) {
	// 	// Cambiar la disponibilidad de la cochera
	// 	this.filas[numeroFila].deshabilitada = !this.filas[numeroFila].deshabilitada;
	
	// 	// Preparar el objeto a enviar
	// 	const data = {
	// 		fila: numeroFila,
	// 		deshabilitado: this.filas[numeroFila].deshabilitada
	// 	};
	
	// 	// Realizar la solicitud fetch
	// 	fetch('http://localhost:4000/cocheras/1/enable', {
	// 		method: 'POST',
	// 		headers: {
	// 			authorization: 'Bearer ' + this.auth.getToken(),
	// 			'Content-Type': 'application/json',
	// 		},
	// 		body: JSON.stringify(data)
	// 	}).then(response => {
	// 		if (!response.ok) {
	// 			throw new Error("Error al actualizar la disponibilidad en el servidor");
	// 		}
	// 		return response.json();
	// 	}).catch(error => {
	// 		console.error('Error en la solicitud:', error);
	// 		// Revertir el cambio en la interfaz si hubo error
	// 		this.filas[numeroFila].deshabilitada = !this.filas[numeroFila].deshabilitada;
	// 	});
	// }
	
	// Función para habilitar la cochera
// habilitarCochera(cocheraId: number) {

//     // Realizar la solicitud fetch para habilitar
//     fetch(`http://localhost:4000/cocheras/${cocheraId}/enable`, {
//         method: 'POST',
//         headers: {
//             authorization: 'Bearer ' + this.auth.getToken(),
//         },
//     }).then(response => {
//         if (!response.ok) {
//             throw new Error("Error al habilitar la cochera en el servidor");
//         }else{
// 			this.traerCocheras();
// 		}
//     }).catch(error => {
//         console.error('Error en la solicitud:', error);
   
//     });
// }

// // Función para deshabilitar la cochera
// deshabilitarCochera(numeroFila: number) {
//     // Asegurarse de que la cochera esté deshabilitada
//     this.filas[numeroFila].deshabilitada = true;

//     // Preparar el objeto a enviar
//     const data = {
//         fila: numeroFila,
//         deshabilitado: true
//     };

//     // Realizar la solicitud fetch para deshabilitar
//     fetch('http://localhost:4000/cocheras/1/disable', {
//         method: 'POST',
//         headers: {
//             authorization: 'Bearer ' + this.auth.getToken(),
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data)
//     }).then(response => {
//         if (!response.ok) {
//             throw new Error("Error al deshabilitar la cochera en el servidor");
//         }
//         return response.json();
//     }).catch(error => {
//         console.error('Error en la solicitud:', error);
//         // Revertir el cambio en la interfaz si hubo error
//         this.filas[numeroFila].deshabilitada = false;
//     });
// }

habilitarCochera(cocheraId: number) {
    // Realizar la solicitud fetch para habilitar
    fetch(`http://localhost:4000/cocheras/${cocheraId}/enable`, {
        method: 'POST',
        headers: {
            authorization: 'Bearer ' + this.auth.getToken(),
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al habilitar la cochera en el servidor");
        } else {
            this.traerCocheras(); // Refresca la lista de cocheras
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });
}

// Función para deshabilitar la cochera
deshabilitarCochera(cocheraId: number) {
    // Preparar el objeto a enviar
    const data = { deshabilitado: true };

    // Realizar la solicitud fetch para deshabilitar
    fetch(`http://localhost:4000/cocheras/${cocheraId}/disable`, {
        method: 'POST',
        headers: {
            authorization: 'Bearer ' + this.auth.getToken(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al deshabilitar la cochera en el servidor");
        }
        this.traerCocheras(); // Refresca la lista de cocheras
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });
}



	// Implementación del ciclo de vida ngOnInit
	ngOnInit() {
		this.traerCocheras().then((filas) => {
			this.filas = filas;
		});
	}


// 	async abrirModalNuevoEstacionamiento(idCochera: number) {
// 		await Swal.fire({
// 			title: "Ingrese la patente del vehículo",
// 			input: "text",
// 			showCancelButton: true,
// 			inputValidator: (value) => {
// 				if (!value) {
// 					return "Ingrese una patente válida";
// 				}
// 				return
// 			}
// 		}).then(res => {
// 			if (res.isConfirmed) {
// 				this.estacionamientos.estacionarAuto(res.value, idCochera).then(() => {
// 					console.log(res.value)
// 					this.traerCocheras
					
// 				});
// 			}
// 		})
// 	}
// }


async abrirModalNuevoEstacionamiento(idCochera: number) {
	const result = await Swal.fire({
	  title: "Ingrese la patente del vehículo",
	  input: "text",
	  showCancelButton: true,
	  inputValidator: (value) => {
		if (!value) {
		  return "Ingrese una patente válida";
		}
		return null;
	  }
	});
  
	if (result.isConfirmed) {
	  const patente = result.value;
  
	  // Encuentra el índice de la cochera por ID
	  const cocheraIndex = this.filas.findIndex(fila => fila.id === idCochera);
	  const horaIngreso = new Date().toLocaleTimeString();
  
	  if (cocheraIndex !== -1) {
		// Actualiza la patente y disponibilidad en la fila correspondiente
		this.filas[cocheraIndex].patente = patente;
		this.filas[cocheraIndex].deshabilitada = false; 
		this.filas[cocheraIndex].horaIngreso = horaIngreso;

		// Preparar el objeto a enviar
		const data = {
		  idCochera: idCochera,
		  patente: patente,
		  horaIngreso: horaIngreso
		};
		console.log(data)
  
		// Realizar la solicitud fetch
		try {
			const response = await fetch('http://localhost:4000/estacionamientos/abrir', {
			  method: 'POST',
			  headers: {
				authorization: 'Bearer ' + this.auth.getToken(),
				'Content-Type': 'application/json',
			  },
			  body: JSON.stringify(data)
			});
			
			if (!response.ok) {
			  const errorData = await response.json();
			  console.error("Error del servidor:", errorData);
			}
		  } catch (error) {
			console.error("Error en la solicitud:", error);
		  }
	  }}
	}
		  

// 	async cerrarEstacionamiento(patente: string) {
// 		const result = await Swal.fire({
// 			title: "¿Desea cerrar el estacionamiento?",
// 			text: "Esta acción liberará la cochera y la marcará como disponible.",
// 			icon: "warning",
// 			showCancelButton: true,
// 			confirmButtonText: "Sí, cerrar",
// 			cancelButtonText: "Cancelar"
// 		});
	
// 		if (result.isConfirmed) {
				
// 			// Realizar una solicitud para actualizar el estado en el servidor
// 			await fetch(`http://localhost:4000/estacionamientos/cerrar`, {
// 				method: 'PATCH',
// 				headers: {
// 					Authorization: 'Bearer ' + this.auth.getToken(),
// 					'Content-Type': 'application/json',
// 				},
// 				body: JSON.stringify(
// 					{
// 						patente:patente
// 					}
// 				),
// 			})
// 			.then(response => {
// 				if (!response.ok) {
// 					throw new Error("Error al cerrar la cochera en el servidor");
// 				} else {
// 					this.traerCocheras();
// 				}
// 				return response.json();
// 			}).catch(error => {
// 				console.error('Error en la solicitud:', error);
// 			});

			
// 		}
// 	}
// }	

async cerrarEstacionamiento(patente: string) {
	const result = await Swal.fire({
		title: "¿Desea cerrar el estacionamiento?",
		text: "Esta acción liberará la cochera y la marcará como disponible.",
		icon: "warning",
		showCancelButton: true,
		confirmButtonText: "Sí, cerrar",
		cancelButtonText: "Cancelar"
	});

	if (result.isConfirmed) {
		try {
			// Realizar una solicitud para actualizar el estado en el servidor
			const response = await fetch(`http://localhost:4000/estacionamientos/cerrar`, {
				method: 'PATCH',
				headers: {
					Authorization: 'Bearer ' + this.auth.getToken(),
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ patente: patente }),
			});

			if (!response.ok) {
				throw new Error("Error al cerrar la cochera en el servidor");
			}

			const data = await response.json();
			// Mostrar el monto cobrado en un modal de Swal
			await Swal.fire({
				title: "Cierre de estacionamiento exitoso",
				text: `Se cobró un total de $${data.costo}.`,
				icon: "success",
				confirmButtonText: "Aceptar"
			});

			// Refrescar las cocheras después de un cierre exitoso
			this.traerCocheras();

		} catch (error) {
			console.error('Error en la solicitud:', error);
			await Swal.fire({
				title: "Error",
				text: "Ocurrió un error al cerrar la cochera.",
				icon: "error",
				confirmButtonText: "Aceptar"
			});
		}
	}
}
}