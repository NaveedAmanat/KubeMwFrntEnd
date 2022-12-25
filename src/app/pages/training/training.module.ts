import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ClientNonclientTrainingComponent } from './client-nonclient-training/client-nonclient-training.component';
import { LeftSideBarComponent } from './left-side-bar/left-side-bar.component';
import { MatInputModule, MatDatepickerModule, MatSelectModule, MatButtonModule, MatNativeDateModule, MatRadioButton, MatRadioModule, MatCheckboxModule, MatExpansionModule, MatListModule, MatIconModule, MatSlideToggleModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { TrainingTypesComponent } from './training-types/training-types.component';
import { ParticipantsComponent } from './participants/participants.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TrainingAttendanceComponent } from './training-attendance/training-attendance.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'training-types'
  },
  {
    path: 'training-types',
    component: TrainingTypesComponent
  },
  {
    path: 'client-training',
    component: ClientNonclientTrainingComponent
  },
  {
    path: 'participants',
    component: ParticipantsComponent
  },
  {
    path: 'training-attendance',
    component: TrainingAttendanceComponent
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
    MatCheckboxModule,
    MatExpansionModule,
    MatListModule,
    MatIconModule,
    MatSlideToggleModule

  ],
  declarations: [ClientNonclientTrainingComponent, LeftSideBarComponent, TrainingTypesComponent, ParticipantsComponent, TrainingAttendanceComponent]
})
export class TrainingModule { }
