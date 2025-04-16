import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/products';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get products with filters', () => {
    const mockFilters = { description: 'test' };
    const mockPage = 1;
    const mockLimit = 10;
    const mockResponse = { data: [{ id: 1, description: 'Product 1' }], count: 1 };
  
    service.getProducts(mockFilters, mockPage, mockLimit).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
  
    const req = httpMock.expectOne(req => 
      req.url === `${apiUrl}` &&
      req.params.has('description') &&
      req.params.get('description') === 'test' &&
      req.params.has('page') &&
      req.params.get('page') === '1' &&
      req.params.has('limit') &&
      req.params.get('limit') === '10'
    );
    
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get a single product', () => {
    const productId = 1;
    const mockProduct = { id: 1, description: 'Product 1' };

    service.getProduct(productId).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should create a product', () => {
    const mockProduct = { description: 'New Product', prices: [] };
    const mockResponse = { id: 2, ...mockProduct };

    service.createProduct(mockProduct).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(mockResponse);
  });

  it('should update a product with JSON data', () => {
    const productId = 1;
    const mockUpdate = { description: 'Updated Product' };

    service.updateProduct(productId, mockUpdate).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(mockUpdate);
    req.flush({});
  });

  it('should delete a product', () => {
    const productId = 1;

    service.deleteProduct(productId).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should add product price', () => {
    const productId = 1;
    const priceData = { storeId: 1, salePrice: 10 };
    
    service.addProductPrice(productId, priceData).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1/prices`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(priceData);
    req.flush({});
  });

  it('should remove product price', () => {
    const productId = 1;
    const priceId = 1;
    
    service.removeProductPrice(productId, priceId).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1/prices/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});