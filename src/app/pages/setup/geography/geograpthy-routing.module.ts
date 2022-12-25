import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GeographyComponent} from './geography.component';
import {ProvinceComponent} from './province/province.component';
import {DistrictComponent} from './district/district.component';
import {TesilComponent} from './tesil/tesil.component';
import {UnComponent} from './un/un.component';

const routes: Routes = [
  { path: '' ,component: GeographyComponent },
  { path: 'province/:id', component: ProvinceComponent },
  { path: 'district/:id', component: DistrictComponent },
  { path: 'tesil/:id', component: TesilComponent },
  { path: 'un/:id', component: UnComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeograpthyRoutingModule { }
