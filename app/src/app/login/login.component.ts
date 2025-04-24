import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CredencialesService, LoginResponse } from '../services/credenciales.service';

@Component({
  standalone: true,
  selector: 'app-login',  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  formSubmitted = false; // Variable para rastrear si el formulario fue enviado

  constructor(private fb: FormBuilder, private credService: CredencialesService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, this.customEmailValidator, Validators.maxLength(25)]],
      contrasena: ['', [Validators.required, Validators.maxLength(10)]]
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { correo, contrasena } = this.loginForm.value;
    console.log('Valor del formulario antes de enviar:', { correo, contrasena }); // Agrega esta línea
    this.credService.login(correo, contrasena).subscribe({
      next: (res: LoginResponse) => {
        if (res.success) {
          alert('Login exitoso');
          this.loginForm.reset();
          // aquí se podria guardar el token: localStorage.setItem('token', res.token!)
        } else {
          alert('Login fallido');
        }
      },
      error: err => {
        console.error('Error en petición de login', err);
        alert('Ocurrió un error al contactar al servidor.');
      }
    });
  }

  get emailControl() {
    return this.loginForm.get('correo');
  }

  get passwordControl() {
    return this.loginForm.get('contrasena');
  }

  //Utilizando una expresión regular para validar el formato del email
  customEmailValidator(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (control.value && !emailRegex.test(control.value)) {
      return { invalidEmail: true };
    }
    return null;
  }
}
