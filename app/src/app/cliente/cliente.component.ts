// src/app/cliente/cliente.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- Importar CommonModule
import { FormsModule } from '@angular/forms';   // <--- Importar FormsModule

import { BancoService, Cuenta, ApiResponse } from '../services/banco.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
  imports: [
    CommonModule,   // Necesario para *ngIf, *ngFor, [ngClass], currency pipe
    FormsModule     // Necesario para [(ngModel)]

  ],
  standalone: true,
})
export class ClienteComponent implements OnInit {

  clientDui: string = '12345678-9'; // <--- ¡CAMBIA ESTO POR EL DUI REAL DEL USUARIO LOGEADO!
  cuentas: Cuenta[] = [];
  selectedCuentaNumero: string = '';
  transactionAmount: number | null = null;
  message: string | null = null;
  messageType: 'success' | 'error' | null = null;
  isLoading = false;

  constructor(private bancoService: BancoService) { }

  ngOnInit(): void {
    // Cuando el componente se inicializa, carga las cuentas del cliente
    this.loadCuentas();
  }

  /**
   * Carga las cuentas del cliente actual haciendo una llamada al servicio.
   */
  loadCuentas(): void {
    this.isLoading = true; // Empieza a cargar
    this.message = null; // Limpia mensajes anteriores
    this.messageType = null;

    this.bancoService.getByCliente(this.clientDui).subscribe({
      next: (response: ApiResponse<Cuenta[]>) => {
        this.isLoading = false; // Termina de cargar
        if (response.success) {
          this.cuentas = response.data; // Asigna la lista de cuentas recibida
          // Si hay cuentas, selecciona la primera por defecto para la transacción
          if (this.cuentas.length > 0 && !this.selectedCuentaNumero) {
            this.selectedCuentaNumero = this.cuentas[0].numero;
          }
        } else {
          this.cuentas = []; // Si no hay éxito, vacía la lista por seguridad
          this.showMessage(response.message, 'error'); // Muestra el mensaje de error del backend
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false; // Termina de cargar incluso si hay error
        // Maneja errores HTTP (ej. 404 Not Found, 500 Internal Server Error)
        // El backend devuelve un cuerpo con message en caso de 404 o 400
        const errorMessage = error.error?.message || error.message; // Intenta obtener el mensaje del cuerpo del error, si no usa el mensaje http estándar
        this.showMessage('Error al cargar las cuentas: ' + errorMessage, 'error');
        this.cuentas = []; // Vacía la lista si falla la carga
      }
    });
  }

  /**
   * Realiza una transacción (abono o retiro) en la cuenta seleccionada.
   * @param type 'abonar' o 'retirar'
   */
  performTransaction(type: 'abonar' | 'retirar'): void {
    // Validaciones básicas
    if (!this.selectedCuentaNumero) {
      this.showMessage('Seleccione una cuenta.', 'error');
      return;
    }
    if (this.transactionAmount === null || this.transactionAmount <= 0) {
      this.showMessage('Ingrese un monto válido mayor a 0.', 'error');
      return;
    }

    this.isLoading = true; // Empieza a cargar la transacción
    this.message = null; // Limpia mensajes anteriores
    this.messageType = null;

    // Selecciona el método del servicio a llamar (abonar o retirar)
    const transactionObservable = type === 'abonar'
      ? this.bancoService.abonar(this.clientDui, this.selectedCuentaNumero, this.transactionAmount)
      : this.bancoService.retirar(this.clientDui, this.selectedCuentaNumero, this.transactionAmount);

    // Suscribe al observable para manejar la respuesta
    transactionObservable.subscribe({
      next: (response: ApiResponse<Cuenta>) => { // Las respuestas de transacción devuelven ApiResponse<Cuenta>
        this.isLoading = false; // Termina de cargar
        if (response.success) {
          this.showMessage(response.message, 'success'); // Muestra el mensaje de éxito del backend
          this.transactionAmount = null; // Limpia el campo de monto
          this.loadCuentas();
        } else {
          // Si success es false, muestra el mensaje de error del backend
          this.showMessage(response.message, 'error');
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false; // Termina de cargar incluso con error
        // Maneja errores HTTP en la transacción (ej. 400 Saldo insuficiente, 404 No encontrada)
        const errorMessage = error.error?.message || error.message; // Intenta obtener el mensaje del cuerpo del error
        this.showMessage('Error en la transacción: ' + errorMessage, 'error');
      }
    });
  }

  /**
   * Helper para mostrar mensajes en la interfaz de usuario.
   * @param msg El mensaje a mostrar.
   * @param type 'success' o 'error' para estilizar el mensaje.
   */
  showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
  }

}
