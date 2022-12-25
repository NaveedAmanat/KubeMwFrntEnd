import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeograpthyRoutingModule } from './geograpthy-routing.module';
import {GeographyComponent} from './geography.component';
import {UnComponent} from './un/un.component';
import {TesilComponent} from './tesil/tesil.component';
import {ProvinceComponent} from './province/province.component';
import {DistrictComponent} from './district/district.component';
import {SharedModule} from '../../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    GeograpthyRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    GeographyComponent,
    UnComponent,
    TesilComponent,
    ProvinceComponent,
    DistrictComponent
  ]
})
export class GeograpthyModule { }
