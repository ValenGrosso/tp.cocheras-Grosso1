import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Login } from '../../interfaces/login';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
datosLogin:Login = {
    username:'',
    password:''

  };
router = inject(Router);
auth = inject(AuthService)

// Login() {
//   fetch("http://localhost:4000/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" }, 
//     body: JSON.stringify(this.datosLogin)
//   }).then(res => {
//     res.json().then(resJson => {
//       if (resJson.status === 'ok') {
//         this.router.navigate(['/estado-cocheras']);
//         localStorage.setItem('token', resJson.token); 
//       }
//     });
//   });
// }}

Login() {
this.auth.Login(this.datosLogin)
.then(ok => {
  if (ok)
    this.router.navigate(['/estado-cocheras']);
  else
  Swal.fire({
    icon: "error",
    title: "Error de Incio de Sesión",
    text: "¡Contraseña o usuario incorrectos!",
  });
}

)

};
}

