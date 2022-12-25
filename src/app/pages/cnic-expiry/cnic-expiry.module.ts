import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpiringCnicComponent } from './expiring-cnic/expiring-cnic.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule, MatDatepickerModule, MatSelectModule, MatButtonModule, MatNativeDateModule, MatRadioModule, MatCheckboxModule } from '@angular/material';
import { NgSelectModule } from '@ng-select/ng-select';
import { OwlNativeDateTimeModule, OwlDateTimeModule } from 'ng-pick-datetime';
import { LeftSideBarComponent } from './left-side-bar/left-side-bar.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'expiring-cnic'
  },
  {
    path: 'expiring-cnic',
    component: ExpiringCnicComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatNativeDateModule,
    OwlNativeDateTimeModule,
    OwlDateTimeModule,
    NgSelectModule,
    MatRadioModule,
    MatCheckboxModule

  ],
  declarations: [ExpiringCnicComponent, LeftSideBarComponent]
})
export class CnicExpiryModule { }
