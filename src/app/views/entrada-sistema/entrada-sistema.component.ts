import { CommonModule, PlatformLocation } from '@angular/common';
import { Component } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { BodyComponent } from '../body/body.component';
import { RouterModule } from '@angular/router';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-entrada-sistema',
  standalone: true,
  imports: [CommonModule, SidenavComponent, BodyComponent, RouterModule],
  templateUrl: './entrada-sistema.component.html',
  styleUrl: './entrada-sistema.component.scss'
})

export class EntradaSistemaComponent {

  title = 'Dashboard';

  isSideNacCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = this.screenWidth;
    this.isSideNacCollapsed = data.collapsed;
  }
}
