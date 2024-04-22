import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradaSistemaComponent } from './entrada-sistema.component';

describe('EntradaSistemaComponent', () => {
  let component: EntradaSistemaComponent;
  let fixture: ComponentFixture<EntradaSistemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntradaSistemaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntradaSistemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
