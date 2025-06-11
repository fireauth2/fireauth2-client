import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { FireAuth } from '@fireauth2/angular';
import AdminPage from './admin.page';

describe('AdminPage', () => {
  let component: AdminPage;
  let fixture: ComponentFixture<AdminPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: {} as never },
        { provide: FireAuth, useValue: {} as never },
      ],
      imports: [AdminPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
