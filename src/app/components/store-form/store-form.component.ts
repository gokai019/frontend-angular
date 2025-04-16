import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { StoreService } from '../../services/store.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-store-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './store-form.component.html',
  styleUrls: ['./store-form.component.css']
})
export class StoreFormComponent {
  storeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private dialogRef: MatDialogRef<StoreFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.storeForm = this.fb.group({
      description: ['', Validators.required]
    });
  }

  saveStore() {
    if (this.storeForm.valid) {
      this.storeService.createStore(this.storeForm.value).subscribe({
        next: () => {
          this.snackBar.open('Loja cadastrada com sucesso!', 'Fechar', { duration: 3000 });
          this.dialogRef.close(true); 
        },
        error: (error) => {
          console.error('Erro ao criar loja:', error);
          this.snackBar.open('Erro ao cadastrar loja', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }
}