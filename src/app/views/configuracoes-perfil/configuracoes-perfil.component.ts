import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MessagesModule } from 'primeng/messages';
import { CadastroService } from '../../controllers/service/cadastro.service';
import { LoginService } from '../../controllers/service/login.service';

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

  constructor(public dialog: MatDialog, private cadastroService: CadastroService) {

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
        console.log('Dados do usuário', usuario);

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

    }, error => {
      console.log("Edição falhou", error);

    })
  }

 

  confirmarExclusaoConta(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // Aqui você pode escrever a lógica para excluir a conta
        console.log('Conta excluída');
      }
    });
  }
}
