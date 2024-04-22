import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CadastroService } from '../../controllers/service/cadastro.service';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
    selector: 'app-cadastro',
    standalone: true,
    templateUrl: './cadastro.component.html',
    styleUrl: './cadastro.component.scss',
    imports: [FormsModule, ReactiveFormsModule, HttpClientModule, MessagesModule]
})
export class CadastroComponent {
    message: Message[] = [];
    formularioCadastro: FormGroup;

    constructor(private cadastroService: CadastroService, private router: Router) {

        this.formularioCadastro = new FormGroup({
            email: new FormControl(""),
            password: new FormControl(""),
            favoriteactivity: new FormControl(""),
            username: new FormControl(""),
        })
    }

    ngOnInit(): void {
    }

    cadastrar() {
        const email = this.formularioCadastro.get('email')?.value;
        const password = this.formularioCadastro.get('password')?.value;
        const favoriteactivity = this.formularioCadastro.get('favoriteactivity')?.value;
        const username = this.formularioCadastro.get('username')?.value;


        this.cadastroService.cadastrar(email, password, favoriteactivity, username).subscribe(response => {
            this.message = [
                { severity: 'success', detail: 'Cadastro realizado com sucesso, faça o Login!' }
            ];
            setTimeout(() => {
                this.message = []
            }, 2200)
        },
            error => {
                console.log("Cadastro falhou", error);
                this.message = [
                    { severity: 'error', detail: 'Erro ao realizar o cadastro!' }
                ];

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

    redirectToLogin() {
        this.router.navigate(['']);
    }

}


