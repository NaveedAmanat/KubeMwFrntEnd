import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { RecoveryRoutingModule } from './recovery-routing.module';
import { RecoveryComponent } from './recovery.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AppRoutingModule } from '../../app-routing.module';

import {
  MatButtonModule, MatCardModule,
  MatDatepickerModule, MatExpansionModule,
  MatInputModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule,
  MatTableModule,
  MatCheckboxModule,
  MatSortModule,
  MatPaginatorModule
} from '@angular/material';
import { SplitPipe } from './split.pipe';
import { MergePipe } from './mere.pipe';
import { AuthGuard } from './AuthGuard.service';

@NgModule({
  imports: [
    CommonModule,
    RecoveryRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatExpansionModule, MatTableModule, MatCheckboxModule, MatSortModule,
    MatPaginatorModule, MatSortModule, SharedModule
  ],
  declarations: [RecoveryComponent, SplitPipe, MergePipe],
  providers: [DatePipe, AuthGuard]
})
export class RecoveryModule { }
