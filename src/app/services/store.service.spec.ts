import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StoreService } from './store.service';

describe('StoreService', () => {
  let service: StoreService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/stores';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StoreService]
    });
    service = TestBed.inject(StoreService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get stores', () => {
    const mockStores = [{ id: 1, description: 'Store 1' }];

    service.getStores().subscribe(stores => {
      expect(stores).toEqual(mockStores);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockStores);
  });

  it('should create a store', () => {
    const mockStore = { description: 'New Store' };
    const mockResponse = { id: 2, ...mockStore };

    service.createStore(mockStore).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockStore);
    req.flush(mockResponse);
  });
});