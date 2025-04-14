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
    MatButtonModule
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
      storeId: ['', Validators.required],
      salePrice: ['', [
        Validators.required,
        Validators.pattern(/^\d+\.\d{3}$/)
      ]]
    });

    this.loadStores();
  }

  loadStores() {
    this.storeService.getStores().subscribe(stores => {
      this.stores = stores;
      
      if (this.data.existingPrices) {
        const existingStoreIds = this.data.existingPrices.map((p: any) => p.storeId);
        this.stores = this.stores.filter(store => 
          !existingStoreIds.includes(store.id)
        );
      }
    });
  }

  savePrice() {
    if (this.priceForm.invalid) {
      this.snackBar.open('Preencha todos os campos', 'Fechar', { duration: 5000 });
      return;
    }
  
    const priceData = {
      storeId: Number(this.priceForm.value.storeId),
      salePrice: Number(this.priceForm.value.salePrice)
    };
  
    // Se estiver criando (sem productId), retorna os dados para o form principal
    if (this.data.isCreating) {
      this.dialogRef.close(priceData);
      return;
    }
  
    // Se tiver productId, faz a chamada API normal
    this.productService.addProductPrice(this.data.productId, priceData).subscribe({
      next: (response) => this.dialogRef.close(response),
      error: (error) => {
        this.snackBar.open('Erro ao salvar preço: ' + error.message, 'Fechar', { duration: 5000 });
      }
    });
  }
}