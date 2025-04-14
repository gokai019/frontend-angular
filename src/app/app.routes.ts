import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { StoreFormComponent } from './components/store-form/store-form.component';

export const routes: Routes = [
  { path: 'produto', component: ProductListComponent },
  { path: 'produto/cadastro', component: ProductFormComponent },
  { path: 'produto/cadastro/:id', component: ProductFormComponent },
  { path: 'loja/cadastro', component: StoreFormComponent },
  { path: '', redirectTo: '/produto', pathMatch: 'full' },
  { path: '**', redirectTo: '/produto' }
];