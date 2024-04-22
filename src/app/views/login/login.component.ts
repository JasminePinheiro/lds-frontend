import { Component, Input } from '@angular/core';
import { LoginService } from '../../controllers/service/login.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, MessagesModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  message: Message[] = [];
  formulario: FormGroup;

  constructor(private authService: LoginService, private router: Router) {

    this.formulario = new FormGroup({
      email: new FormControl(""),
      password: new FormControl(""),
    })

  }

  login() {

    const email = this.formulario.get('email')?.value;
    const password = this.formulario.get('password')?.value;

    this.authService.login(email, password).subscribe(response => {
      this.message = [
        { severity: 'success', detail: 'Login realizado com sucesso!' }
      ];

      setTimeout(() => {
        this.redirectToDashboard()
      }, 2100);

    },
      error => {

        this.message = [
          { severity: 'error', detail: 'Erro ao realizar o login!' }
        ];
        console.log(error);

        setTimeout(() => {
          this.message = [];
        }, 2000)

      }
    );
  }


  togglePasswordVisibility() {
    const passwordField = document.getElementById("password") as HTMLInputElement;
    const toggleIcon = document.getElementById("togglePassword");

    if (passwordField.type === "password") {
      passwordField.type = "text";
      if (toggleIcon) {
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
      }
    } else {
      passwordField.type = "password";
      if (toggleIcon) {
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
      }
    }
  }

  redirectToDashboard() {
    this.router.navigate(["/entrada-sistema/dashboard"]);
  }

  redirectToCadastro(){
    this.router.navigate(["/cadastro"])
  }
}


