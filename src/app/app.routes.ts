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
import { ProjetosComponent } from './views/projetos/projetos.component';
import { TodoComponent } from './views/todo/todo.component';
import { NotesComponent } from './views/notes/notes.component';

export const routes: Routes = [
    { path: '', component: LoginComponent, pathMatch: 'full' },
    { path: 'cadastro', component: CadastroComponent },
    { path: 'recuperar-senha', component: RecuperarSenhaComponent, pathMatch: 'full' },
    
    {
        path: 'entrada-sistema', component: EntradaSistemaComponent, children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent, pathMatch: 'full' },
            { path: 'calendario', component: CalendarComponent, pathMatch: 'full' },
            { path: 'projetos', component: ProjetosComponent, pathMatch: 'full' },
            { path: 'configuracoes', component: ConfiguracoesPerfilComponent, pathMatch: 'full' },
            { path: 'sair', component: ExitComponent, pathMatch: 'full' },
            { path: 'login', component: LoginComponent, pathMatch: 'full' },
            { path: 'lista-de-tarefas', component: TodoComponent, pathMatch: 'full'},
            { path: 'anotacao-diario', component: NotesComponent, pathMatch: 'full'}
        ]
    },
];
