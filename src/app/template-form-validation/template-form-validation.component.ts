import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-template-form-validation',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './template-form-validation.component.html',
  styleUrl: './template-form-validation.component.scss'
})
export class TemplateFormValidationComponent {

  isFormSubmited: boolean = false;

  userObj: any = {
    nome: '',
    email: '',
    senha: '',
    atividadeFavorita: ''
  }
}
