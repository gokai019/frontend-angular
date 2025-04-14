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
    MatTooltipModule    
  ],
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  productId: number | null = null;
  prices: any[] = [];
  priceColumns = ['store', 'price', 'actions'];
  imageUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(60)]],
      cost: ['', [Validators.pattern(/^\d+\.\d{3}$/)]],
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

  openPriceDialog(price?: any) {
    const dialogRef = this.dialog.open(PriceDialogComponent, {
      data: { 
        price,
        productId: this.productId,
        existingPrices: this.prices,
        isCreating: !this.productId // Novo flag para indicar criação
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (price) {
          // Edição de preço existente
          const index = this.prices.findIndex(p => p.id === price.id);
          if (index !== -1) this.prices[index] = result;
        } else {
          // Adição de novo preço
          if (this.productId) {
            // Se já tem ID, adiciona via API
            this.productService.addProductPrice(this.productId, {
              storeId: result.storeId,
              salePrice: result.salePrice
            }).subscribe({
              next: (newPrice) => this.prices.push(newPrice),
              error: (err) => this.showMessage('Erro ao adicionar preço: ' + err.message, true)
            });
          } else {
            // Se não tem ID (criação), armazena temporariamente
            this.prices.push({
              ...result,
              store: { id: result.storeId, description: 'Loja ' + result.storeId } // Simula objeto store
            });
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    
    if (file) {
      // Validação de tamanho (2MB máximo)
      if (file.size > 2 * 1024 * 1024) {
        this.showMessage('A imagem deve ter no máximo 2MB', true);
        return;
      }
      
      this.productForm.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = () => this.imageUrl = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

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
  
    const productData = {
      description: this.productForm.value.description,
      cost: this.productForm.value.cost ? parseFloat(this.productForm.value.cost) : null,
      prices: this.prices.map(p => ({
        storeId: p.storeId,
        salePrice: p.salePrice
      }))
    };
  
    if (this.productId) {
      // Edição de produto existente
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: () => this.handleSuccess('Produto atualizado com sucesso!'),
        error: (error) => this.handleError(error)
      });
    } else {
      // Criação de novo produto
      this.productService.createProduct(productData).subscribe({
        next: (newProduct) => {
          this.productId = newProduct.id;
          this.showMessage('Produto criado com sucesso!');
          this.router.navigate(['/produto/editar', newProduct.id]); // Redireciona para edição
        },
        error: (error) => this.handleError(error)
      });
    }
  }
  private handleNewProductSuccess(newProduct: any) {
    this.productId = newProduct.id;
    this.snackBar.open('Produto criado com sucesso!', 'Fechar', { duration: 3000 });
    this.router.navigate(['/produto']); // Ou manter na tela para mais edições
  }
  
  private handleSuccess(message: string) {
    this.snackBar.open(message, 'Fechar', { duration: 3000 });
    this.router.navigate(['/produto']);
  }
  private handleError(error: any) {
    let errorMessage = 'Erro ao salvar produto';
    
    if (error.error?.message) {
      // Formatar mensagens de erro do backend
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
          error: (error) => console.error('Erro ao adicionar preço:', error)
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