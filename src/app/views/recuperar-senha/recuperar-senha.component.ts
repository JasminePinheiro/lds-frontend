import { Component } from '@angular/core';
import { FormControl, FormControlName, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { CadastroService } from '../../controllers/service/cadastro.service';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, MessagesModule],
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.scss'
})
export class RecuperarSenhaComponent {
  formulario: FormGroup;
  message: Message[] = [];
  messageService: any;

  constructor(private router: Router, private cadastroService: CadastroService) {

    this.formulario = new FormGroup({
      email: new FormControl("")
    })

  }

  ngOnInit() { }

  sendEmail() {
    const email = this.formulario.get('email')?.value

    const novaSenha = this.gerarNovaSenha();

    this.cadastroService.obterUsuarioLogado(email).subscribe((usuario: any) => {
      
      this.cadastroService.atualizarSenha(email, novaSenha).subscribe(() => {

        // this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Um e-mail com instruções para recuperação de senha foi enviado.' });

        const Email: any = (window as any).Email;

        const bodyForm = `
      <body style="font-family: Arial, Helvetica, sans-serif; margin-left: 14rem; font-size: 1rem">
      <div style="width: 500px; height: 750px;">
          <header style="background-color: #C4D6D9; padding: 2px;">
              <h1 style="color: #0C5663; text-align: center;">TaskZen</h1>
          </header>
          <section>
              <h4>Prezado ${usuario.username},</h4>
              <p>Recentemente você solicitou a recuperação de senha para sua conta em TaskZen. Estamos aqui para ajudar
                  você a
                  recuperar o acesso à sua conta.</p>
              <div>
                  <p style="font-weight: bold;">Sua senha foi alterada com <span
                          style="color: rgb(16, 194, 0);">sucesso!</span></p>
                  <p>Por favor, insira sua nova senha <span style="font-weight: bold;">${novaSenha}</span> na
                      Página de Login do Sistema. Após o login, você poderá acessar as
                      configurações para editar sua senha.</p>
              </div>
  
              <div>
                  <p>Atenciosamente, <br> Equipe TaskZen.</p>
              </div>
  
          </section>
          <footer style="background-color: #ededed; padding: 10px; text-align: center;">
              <p>Em caso de dúvidas, fique a vontade para nos contatar. <br><br> (11) 4002-8922 </p>
          </footer>
      </div>
  </body>
      Nova senha: ${novaSenha}
      `

        Email.send({
          SecureToken: "66ccb91f-8c69-409b-8dd0-e74c8cd7bb2e",
          To: email,
          From: "taskzenlds@gmail.com",
          Subject: "Recuperação de senha",
          Body: bodyForm
        }).then(
          (message: any) => alert("A senha foi alterada com sucesso. Uma nova senha foi enviada para o seu e-mail.")
        ).catch(
          (error: any) => console.log("Erro ao enviar email", error)
        );

      }
      )
    })
  }

  private gerarNovaSenha(): string {
    return 'novaSenha123'
  }

  redirectToLogin() {
    this.router.navigate([""]);
  }

}
