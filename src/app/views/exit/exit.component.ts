import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { DataService } from '../../controllers/service/data.service';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-exit',
  standalone: true,
  imports: [],
  templateUrl: './exit.component.html',
  styleUrl: './exit.component.scss'
})

export class ExitComponent {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.redirectToLogin()
  }

  redirectToLogin() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.clear();
    }
    this.router.navigate(['']);
  }
  
}


