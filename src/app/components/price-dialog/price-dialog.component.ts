import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StoreService } from '../../services/store.service';
import { ProductService } from '../../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-price-dialog',
  templateUrl: './price-dialog.component.html',
  styleUrls: ['./price-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
})
export class PriceDialogComponent {
  priceForm: FormGroup;
  stores: any[] = [];
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<PriceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private storeService: StoreService,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {
    this.priceForm = this.fb.group({
      storeId: [null, [  
        Validators.required,
        Validators.min(1) 
      ]],
      salePrice: ['', [
        Validators.required,
        Validators.min(0)
      ]]
    });

    this.loadStores();
  }

  loadStores() {
    this.storeService.getStores().subscribe({
      next: stores => {
        
        this.stores = stores;
        
        if (this.data.existingPrices) {

          const existingStoreIds = this.data.existingPrices.map((p: any) => p.storeId);

          this.stores = this.stores.filter(store => {
            const isIncluded = existingStoreIds.includes(store.id);
            return !isIncluded;
          });
        }
        
      },
      error: err => {
        console.error('Erro ao carregar lojas:', err); 
      }
    });
  }
  savePrice() {
    if (this.priceForm.invalid) return;
  
    const priceData = {
      storeId: Number(this.priceForm.value.storeId),
      salePrice: Number(this.priceForm.value.salePrice)
    };
  
    this.dialogRef.close(priceData);
  }
}