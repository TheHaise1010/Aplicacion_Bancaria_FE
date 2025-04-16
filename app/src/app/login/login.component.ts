import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  formSubmitted = false; // Variable para rastrear si el formulario fue enviado

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, this.customEmailValidator, Validators.maxLength(25)]],
      password: ['', [Validators.required, Validators.maxLength(10)]]
    });
  }

  login(): void {
    this.formSubmitted = true; // Marca el formulario como enviado
    if (this.loginForm.invalid) {
      return; // No realiza la lógica de login si el formulario es inválido
    }

    const { email, password } = this.loginForm.value;

    if (email === 'ejemplo@ejemplo.com' && password === '123456') {
      alert('Login exitoso');
      this.loginForm.reset();
      this.formSubmitted = false; // Reinicia la variable después de un login exitoso
    } else {
      alert('Login fallido');
    }
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
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
