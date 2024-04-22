import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-configuracoes-perfil',
  templateUrl: './configuracoes-perfil.component.html',
  styleUrls: ['./configuracoes-perfil.component.scss']
})
export class ConfiguracoesPerfilComponent {
  constructor(public dialog: MatDialog) {}

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
