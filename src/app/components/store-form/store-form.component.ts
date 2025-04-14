import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { StoreService } from '../../services/store.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-store-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './store-form.component.html',
  styleUrls: ['./store-form.component.css']
})
export class StoreFormComponent {
  storeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private router: Router
  ) {
    this.storeForm = this.fb.group({
      description: ['', Validators.required]
    });
  }

  saveStore() {
    if (this.storeForm.valid) {
      this.storeService.createStore(this.storeForm.value).subscribe({
        next: () => {
          this.router.navigate(['/produto']);
        },
        error: (error) => {
          console.error('Erro ao criar loja:', error);
        }
      });
    }
  }
}