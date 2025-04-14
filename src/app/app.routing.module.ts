import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';

const routes: Routes = [
  { path: 'produtos', component: ProductListComponent },
  { path: 'produtos/novo', component: ProductFormComponent },
  { path: 'produtos/editar/:id', component: ProductFormComponent },
  { path: '', redirectTo: 'produtos', pathMatch: 'full' },
  { path: '**', redirectTo: 'produtos' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }