import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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

    // Add sorting parameters if they exist
    if (filters.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }
    
    if (filters.sortOrder) {
      params = params.set('sortOrder', filters.sortOrder);
    }

    // Add other filters
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
    return this.http.patch(`${this.apiUrl}/${id}`, productData);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  addProductPrice(productId: number, priceData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${productId}/prices`, priceData);
  }

  removeProductPrice(productId: number, priceId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${productId}/prices/${priceId}`);
  }

}