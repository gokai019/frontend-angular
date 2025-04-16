import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getProducts(filters: any, page: number, limit: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }
    
    if (filters.sortOrder) {
      params = params.set('sortOrder', filters.sortOrder);
    }

    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '' && 
          key !== 'sortBy' && key !== 'sortOrder') {
        params = params.set(key, filters[key]);
      }
    });

    return this.http.get<any>(this.apiUrl, { params });
  }
  getProduct(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  createProduct(productData: any): Observable<any> {
    return this.http.post(this.apiUrl, {
      ...productData,
      prices: productData.prices || []
    });
  }

  updateProduct(id: number, productData: any): Observable<any> {
    if (productData instanceof FormData) {
      return this.http.patch(`${this.apiUrl}/${id}`, productData);
    } 
    else {
      return this.http.patch(`${this.apiUrl}/${id}`, productData, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  
  addProductPrice(productId: number, priceData: any): Observable<any> {
    if (!priceData.storeId || priceData.storeId <= 0) {
      return throwError(() => new Error('Store ID inválido'));
    }

    const payload = {
      storeId: Number(priceData.storeId),
      salePrice: Number(priceData.salePrice)
    };
    return this.http.post(`${this.apiUrl}/${productId}/prices`, payload);
  }

  removeProductPrice(productId: number, priceId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${productId}/prices/${priceId}`);
  }

}