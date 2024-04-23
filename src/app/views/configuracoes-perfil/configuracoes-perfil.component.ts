import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MessagesModule } from 'primeng/messages';
import { CadastroService } from '../../controllers/service/cadastro.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-configuracoes-perfil',
  templateUrl: './configuracoes-perfil.component.html',
  styleUrls: ['./configuracoes-perfil.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, HttpClientModule, MessagesModule]

})
export class ConfiguracoesPerfilComponent {
  formEdit: FormGroup;
  usuarioLogado: any;
  message: Message[] = [];

  constructor(public dialog: MatDialog, private cadastroService: CadastroService, private router: Router) {

    this.formEdit = new FormGroup({
      favoriteactivity: new FormControl(""),
      username: new FormControl(""),
    })
  }

  ngOnInit(): void {
    this.carregarDadosFormulario()
  }


  carregarDadosFormulario() {
    if (typeof localStorage !== 'undefined') {
      let email = localStorage.getItem("email");
      this.cadastroService.obterUsuarioLogado(email).subscribe((usuario: any) => {

        this.formEdit.patchValue({
          favoriteactivity: usuario.favoriteactivity,
          username: usuario.username
        })
      })
    }
  }


  editarFormulario() {
    let email = localStorage.getItem("email");
    let favoriteactivity = this.formEdit.get('favoriteactivity')?.value;
    let username = this.formEdit.get('username')?.value;

    this.cadastroService.editarCadastro(email, favoriteactivity, username).subscribe((usuario: any) => {
      console.log('edicão realizado com sucesso', usuario);

      this.message = [
        { severity: 'success', detail: 'Edição realizada com sucesso!' }
      ];
      setTimeout(() => {
        this.message = []
      }, 2200);

    }, error => {
      console.log("Edição falhou", error);
      this.message = [
        { severity: 'error', detail: 'Erro ao realizar a edição!' }
      ];

      setTimeout(() => {
        this.message = [];
      }, 2000)

    })
  }


  excluirConta() {
    let email = localStorage.getItem("email");
    this.cadastroService.deletarCadastro(email).subscribe(() => {
      console.log('Conta excluída com sucesso!');
      this.message = [
        { severity: 'success', detail: 'Conta excluida com sucesso!' }
      ];
      setTimeout(() => {
        this.message = []
        this.redirectToLogin();
      }, 2500);

    }, error => {
      console.log("Erro ao excluir conta!");
      this.message = [
        { severity: 'error', detail: 'Erro ao excluir os dados!' }
      ];

      setTimeout(() => {
        this.message = [];
      }, 2500);
    })
  }

  redirectToLogin() {
    localStorage.clear();
    this.router.navigate(['']);
  }

}
