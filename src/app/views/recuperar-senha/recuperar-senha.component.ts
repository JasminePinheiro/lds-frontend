import { Component } from '@angular/core';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [],
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.scss'
})
export class RecuperarSenhaComponent {

  // document.getElementById("recoveryForm")
  // .addEventListener("submit", async function (event) {
  //   event.preventDefault();
  //   const email = (document.getElementById(
  //     "recoveryEmail"
  //   ) as HTMLInputElement).value;
  //   const favoriteActivityInput = (document.getElementById(
  //     "favoriteActivity"
  //   ) as HTMLInputElement).value;
  //   const newPasswordField = document.getElementById(
  //     "newPasswordField"
  //   ) as HTMLDivElement;
  //   const newPassword = (document.getElementById(
  //     "newPassword"
  //   ) as HTMLInputElement).value;
  //   const emailError = document.getElementById("emailError") as HTMLDivElement;
  //   const activityError = document.getElementById(
  //     "activityError"
  //   ) as HTMLDivElement;
  //   const passwordError = document.getElementById(
  //     "passwordError"
  //   ) as HTMLDivElement;

  //   emailError.textContent = "";
  //   activityError.textContent = "";
  //   passwordError.textContent = "";

  //   if (!email) {
  //     emailError.textContent = "Por favor, preencha o e-mail.";
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`http://localhost:3000/users/${email}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (response.ok) {
  //       const userData = await response.json();
  //       console.log("Dados do usuário:", userData);

  //       if (!userData || !userData.favoriteActivity) {
  //         emailError.textContent = "Este e-mail não está cadastrado.";
  //         return;
  //       }

  //       document.getElementById("favoriteActivityField").style.display =
  //         "block";

  //       if (favoriteActivityInput) {
  //         if (userData.favoriteActivity === favoriteActivityInput) {
  //           newPasswordField.style.display = "block";

  //           if (!newPassword) {
  //             passwordError.textContent =
  //               "Por favor, preencha o campo Nova Senha.";
  //             return;
  //           }

  //           if (newPassword.length < 8 || newPassword.length > 16) {
  //             alert("A senha deve ter entre 8 e 16 caracteres.");
  //             return;
  //           }

  //           try {
  //             const putResponse = await fetch(
  //               `http://localhost:3000/users/${email}`,
  //               {
  //                 method: "PUT",
  //                 headers: {
  //                   "Content-Type": "application/json",
  //                 },
  //                 body: JSON.stringify({
  //                   ...userData,
  //                   password: newPassword,
  //                 }),
  //               }
  //             );

  //             if (putResponse.ok) {
  //               console.log("Senha atualizada com sucesso.");
  //               window.location.href = "../login/";
  //             } else {
  //               console.error("Erro ao atualizar a senha.");
  //             }
  //           } catch (error) {
  //             console.error(
  //               "Erro ao enviar a solicitação PUT:",
  //               (error as Error).message
  //             );
  //           }
  //         } else {
  //           activityError.textContent =
  //             "A atividade favorita não corresponde ao usuário.";
  //           newPasswordField.style.display = "none";
  //         }
  //       }
  //     } else {
  //       emailError.textContent =
  //         "Não foi possível encontrar um usuário com esse e-mail.";
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Erro ao enviar dados para a API:",
  //       (error as Error).message
  //     );
  //   }
  // });
}
