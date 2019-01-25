import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRents.Component.TsComponent } from './my-rents.component.ts.component';

describe('MyRents.Component.TsComponent', () => {
  let component: MyRents.Component.TsComponent;
  let fixture: ComponentFixture<MyRents.Component.TsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyRents.Component.TsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRents.Component.TsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
