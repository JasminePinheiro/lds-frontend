import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './views/calendar/calendar.component';
import { NgModel } from '@angular/forms';
import { SidenavComponent } from './views/sidenav/sidenav.component';
import { EntradaSistemaComponent } from './views/entrada-sistema/entrada-sistema.component';
import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ExitComponent } from './views/exit/exit.component';
import { CadastroComponent } from './views/cadastro/cadastro.component';
import { RecuperarSenhaComponent } from './views/recuperar-senha/recuperar-senha.component';
import { ConfiguracoesPerfilComponent } from './views/configuracoes-perfil/configuracoes-perfil.component';

export const routes: Routes = [
    // { path: '', component: LoginComponent, pathMatch: 'full' },
    { path: '', component: LoginComponent, pathMatch: 'full' },
    { path: 'cadastro', component: CadastroComponent },
    // { path: 'dashboard', component: DashboardComponent, pathMatch: 'full' },
    // { path: 'calendario', component: CalendarComponent, pathMatch: 'full' },
    // { path: 'recuperacao', component: RecuperarSenhaComponent, pathMatch: 'full' },
    // { path: 'editarperfil', component: ConfiguracoesPerfilComponent, pathMatch: 'full' },
    { path: 'recuperar-senha', component: RecuperarSenhaComponent, pathMatch: 'full' },
    { path: 'recuperar-senha', component: RecuperarSenhaComponent, pathMatch: 'full' },
    
    {
        path: 'entrada-sistema', component: EntradaSistemaComponent, children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent, pathMatch: 'full' },
            { path: 'calendario', component: CalendarComponent, pathMatch: 'full' },
            { path: 'configuracoes', component: ConfiguracoesPerfilComponent, pathMatch: 'full' },
            { path: 'sair', component: ExitComponent, pathMatch: 'full' },
            { path: 'login', component: LoginComponent, pathMatch: 'full' },

        ]
    },
];
