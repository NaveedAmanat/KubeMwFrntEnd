import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RecoveryComponent} from './recovery.component';
import { AuthGuard } from './AuthGuard.service';

const routes: Routes = [
  {path: '', component: RecoveryComponent,canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecoveryRoutingModule { }
