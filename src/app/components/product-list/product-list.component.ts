import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../../services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { MatPaginatorModule, PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe,
    MatPaginatorModule,
    MatSortModule
  ],
})
export class ProductListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;
  displayedColumns: string[] = ['id', 'description', 'cost', 'actions'];
  
  filters = {
    id: '',
    description: '',
    cost: null,
    price: null
  };

  totalItems = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];
  
  currentSort: Sort = {
    active: 'id',
    direction: 'asc'
  };

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe((event: PageEvent) => {
        this.onPageChange(event);
      });
    }
    
    if (this.sort) {
      this.sort.sortChange.subscribe((sort: Sort) => {
        this.currentSort = sort;
        this.paginator.pageIndex = 0; // Reset to first page when sorting changes
        this.loadProducts();
      });
    }
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    
    const currentPageIndex = this.paginator ? this.paginator.pageIndex : 0;
    const pageToLoad = currentPageIndex + 1;
    
    // Include sorting parameters in the filters
    const filtersWithSort = {
      ...this.filters,
      sortBy: this.currentSort.active,
      sortOrder: this.currentSort.direction.toUpperCase()
    };
    
    this.productService.getProducts(
      filtersWithSort, 
      pageToLoad,
      this.pageSize
    ).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.dataSource.data = response.data;
          this.totalItems = response.count;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.isLoading = false;
      }
    });
  }

  editProduct(id: number) {
    this.router.navigate(['/produto/cadastro', id]);
  }

  deleteProduct(product: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Exclusão',
        message: `Deseja realmente excluir o produto ${product.description}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(product.id).subscribe({
          next: () => this.loadProducts(),
          error: (err) => console.error(err)
        });
      }
    });
  }
}