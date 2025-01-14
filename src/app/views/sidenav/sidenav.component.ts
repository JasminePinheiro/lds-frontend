import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { navbarData } from './nav-data';
import { CommonModule, PlatformLocation } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CadastroService } from '../../controllers/service/cadastro.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnInit {
  constructor(private platformLocation: PlatformLocation, private cadastroService: CadastroService) { }
  usuarioLogado!: string

  ngOnInit(): void {
    if (this.platformLocation instanceof PlatformLocation) {
      this.screenWidth = window.innerWidth;
    };
    this.obterUsuario();
  }

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter()

  collapsed = true;
  screenWidth = 0;
  navData = navbarData;

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  obterUsuario() {
    if (typeof localStorage !== 'undefined') {
      let email = localStorage.getItem("email");
      this.cadastroService.obterUsuarioLogado(email).subscribe((usuario: any) => {
        this.usuarioLogado = usuario.username
      })
    }
  }
}
