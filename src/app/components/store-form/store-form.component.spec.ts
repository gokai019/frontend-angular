// store-form.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreFormComponent } from './store-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StoreService } from '../../services/store.service';

describe('StoreFormComponent', () => {
  let component: StoreFormComponent;
  let fixture: ComponentFixture<StoreFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StoreFormComponent,
        HttpClientTestingModule,
        MatSnackBarModule
      ],
      providers: [
        StoreService,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StoreFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});