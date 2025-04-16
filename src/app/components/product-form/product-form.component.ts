import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { PriceDialogComponent } from '../price-dialog/price-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { CurrencyPipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StoreService } from '../../services/store.service';
import { StoreFormComponent } from '../store-form/store-form.component';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    CurrencyPipe,
    MatCardModule,       
    MatTooltipModule ,
    MatCardModule,
    MatIconModule   
  ],
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  productId: number | null = null;
  prices: any[] = [];
  priceColumns = ['store', 'price', 'actions'];
  imageUrl: string | null = null;
  stores: any[] = [];
  isCompressing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private storeService: StoreService
  ) {
    this.productForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(60)]],
      cost: [null],
      image: [null]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.productId = +params['id'];
        this.loadProduct();
      }
    });
    
    this.loadStores();
  }

  loadStores() {
    this.storeService.getStores().subscribe({
      next: (stores) => {
        this.stores = stores;
      },
      error: (err) => console.error('Erro ao carregar lojas:', err)
    });
  }

  loadProduct() {
    if (this.productId) {
      this.productService.getProduct(this.productId).subscribe({
        next: (product) => {
          this.productForm.patchValue(product);
          this.prices = product.prices;
          if (product.imageUrl) {
            this.imageUrl = product.imageUrl;
          }
        },
        error: (err) => console.error(err)
      });
    }
  }

  openStoreDialog() {
    const dialogRef = this.dialog.open(StoreFormComponent, {
      width: '500px'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStores();
        this.snackBar.open('Loja cadastrada com sucesso!', 'Fechar', { duration: 3000 });
      }
    });
  }

  openPriceDialog(price?: any) {
    const dialogRef = this.dialog.open(PriceDialogComponent, {
      data: { 
        price,
        productId: this.productId,
        existingPrices: this.prices,
        isCreating: !this.productId
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (price) {
          const index = this.prices.findIndex(p => p.storeId === price.storeId);
          if (index !== -1) {
            this.prices[index] = {
              ...this.prices[index],
              salePrice: result.salePrice
            };
            this.prices = [...this.prices];
          }
        } else {
          if (this.productId) {
            this.productService.addProductPrice(this.productId, {
              storeId: result.storeId,
              salePrice: result.salePrice
            }).subscribe({
              next: (newPrice) => {
                this.storeService.getStores().subscribe(stores => {
                  const store = stores.find(s => s.id === result.storeId);
                  this.prices.push({
                    ...newPrice,
                    store: store || { id: result.storeId, description: 'Loja ' + result.storeId }
                  });
                  this.prices = [...this.prices];
                  this.snackBar.open('Preço adicionado com sucesso!', 'Fechar', { duration: 3000 });
                });
              },
              error: (error) => this.handleError(error)
            });
          } else {
            const store = this.stores.find(s => s.id === result.storeId);
            const newPrice = {
              storeId: result.storeId,
              salePrice: result.salePrice,
              store: store || { 
                id: result.storeId, 
                description: 'Loja ' + result.storeId 
              }
            };
            this.prices.push(newPrice);
            this.prices = [...this.prices];
          }
        }
      }
    });
  }

  editPrice(price: any) {
    this.openPriceDialog(price);
  }

  deletePrice(price: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Exclusão',
        message: `Deseja realmente excluir o preço para ${price.store.description}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.prices = this.prices.filter(p => p.id !== price.id);
      }
    });
  }

  // async onFileSelected(event: any) {
  //   const file: File = event.target.files[0];
  //   const maxSize = 2 * 1024 * 1024; // 2MB
  //   const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
  //   if (!file) return;
    
  //   if (file.size > maxSize * 2) {
  //     this.showMessage('A imagem deve ter no máximo 2MB após compressão', true);
  //     event.target.value = '';
  //     return;
  //   }
    
  //   if (!allowedTypes.includes(file.type)) {
  //     this.showMessage('Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.', true);
  //     event.target.value = '';
  //     return;
  //   }
    
  //   this.isCompressing = true;
    
  //   try {
  //     const compressedFile = await this.compressImage(file);
  //     const reader = new FileReader();
      
  //     reader.onload = () => {
  //       this.imageUrl = reader.result as string;
  //       this.productForm.patchValue({ image: compressedFile });
  //       this.isCompressing = false;
  //     };
      
  //     reader.readAsDataURL(compressedFile);
  //   } catch (error) {
  //     console.error('Erro ao comprimir imagem:', error);
  //     this.showMessage('Erro ao processar imagem', true);
  //     this.isCompressing = false;
  //     event.target.value = '';
  //   }
  // }
  
  showMessage(message: string, isError: boolean = false) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: isError ? ['error-snackbar'] : ['success-snackbar']
    });
  }

  saveProduct() {
    if (this.productForm.invalid) {
      this.showMessage('Preencha todos os campos obrigatórios', true);
      return;
    }
  
    if (this.prices.length === 0) {
      this.showMessage('Adicione pelo menos um preço antes de salvar', true);
      return;
    }

    const productData: any = {
      description: this.productForm.value.description,
      prices: this.prices.map(p => ({
        storeId: Number(p.storeId || p.store?.id),
        salePrice: Number(p.salePrice)
      }))
    };
  
    const costValue = this.productForm.value.cost;
    if (costValue !== null && costValue !== undefined && costValue !== '') {
      productData.cost = Number(costValue);
    }
  
    if (this.productForm.value.image) {
      const formData = new FormData();
      formData.append('image', this.productForm.value.image);
      formData.append('data', JSON.stringify(productData));
  
      if (this.productId) {
        this.productService.updateProduct(this.productId, formData).subscribe({
          next: () => this.handleSuccess('Produto atualizado com sucesso!'),
          error: (error) => this.handleError(error)
        });
      } else {
        this.productService.createProduct(formData).subscribe({
          next: (newProduct) => {
            this.productId = newProduct.id;
            this.showMessage('Produto criado com sucesso!');
            this.router.navigate(['/produto/editar', newProduct.id]);
          },
          error: (error) => this.handleError(error)
        });
      }
    } else {
      if (this.productId) {
        this.productService.updateProduct(this.productId, productData).subscribe({
          next: () => this.handleSuccess('Produto atualizado com sucesso!'),
          error: (error) => this.handleError(error)
        });
      } else {
        this.productService.createProduct(productData).subscribe({
          next: (newProduct) => {
            this.productId = newProduct.id;
            this.showMessage('Produto criado com sucesso!');
            this.router.navigate(['/produto/editar', newProduct.id]);
          },
          error: (error) => this.handleError(error)
        });
      }
    }
  }

  
  private handleNewProductSuccess(newProduct: any) {
    this.productId = newProduct.id;
    this.snackBar.open('Produto criado com sucesso!', 'Fechar', { duration: 3000 });
    this.router.navigate(['/produto']); 
  }
  
  private handleSuccess(message: string) {
    this.snackBar.open(message, 'Fechar', { duration: 3000 });
    this.router.navigate(['/produto']);
  }
  private handleError(error: any) {
    let errorMessage = 'Erro ao salvar produto';
    
    if (error.error?.message) {
      errorMessage += ': ' + error.error.message.join(', ');
    } else if (error.message) {
      errorMessage += ': ' + error.message;
    }
  
    this.snackBar.open(errorMessage, 'Fechar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
  
  savePrices(productId: number) {
    this.prices.forEach(price => {
      if (price.id) {
      } else {
        this.productService.addProductPrice(productId, {
          storeId: price.storeId,
          salePrice: price.salePrice
        }).subscribe({
          next: () => console.log('Preço adicionado com sucesso'),
        });
      }
    });
  }

  removeImage() {
    this.imageUrl = null;
    this.productForm.patchValue({ image: null });
  }
  
  deleteProduct() {
    if (this.productId) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Confirmar Exclusão',
          message: 'Deseja realmente excluir este produto?'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.productService.deleteProduct(this.productId!).subscribe({
            next: () => this.router.navigate(['/produto']),
            error: (err) => console.error(err)
          });
        }
      });
    }
  }
}