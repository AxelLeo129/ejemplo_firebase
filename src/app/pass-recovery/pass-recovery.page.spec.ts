import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PassRecoveryPage } from './pass-recovery.page';

describe('PassRecoveryPage', () => {
  let component: PassRecoveryPage;
  let fixture: ComponentFixture<PassRecoveryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassRecoveryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PassRecoveryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
