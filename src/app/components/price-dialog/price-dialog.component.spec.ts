// price-dialog.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriceDialogComponent } from './price-dialog.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StoreService } from '../../services/store.service';
import { ProductService } from '../../services/product.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('PriceDialogComponent', () => {
  let component: PriceDialogComponent;
  let fixture: ComponentFixture<PriceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PriceDialogComponent,
        HttpClientTestingModule,
        MatSnackBarModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        StoreService,
        ProductService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PriceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});