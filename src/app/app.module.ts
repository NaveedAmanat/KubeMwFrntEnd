import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {SharedModule} from './shared/shared.module';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import * as jquery from 'jquery';
import {NgSelectModule} from '@ng-select/ng-select';
import {LeftSideBarComponent} from './pages/setup/left-side-bar/left-side-bar.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatInputModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule,
  MatTableModule,
  MatCheckboxModule,
  MatPaginatorModule,
} from '@angular/material';
import { PreviousRouteService } from './shared/services/previous-route.service';
import { CdkTableModule } from '@angular/cdk/table';
import {  Uppercase } from './shared/directives/uppercase.directive';
import {CommonModule, DecimalPipe} from '@angular/common';
import { MWHttpInterceptor } from './shared/interceptor/interceptor';
@NgModule({
  imports: [
    BrowserModule,
    NgSelectModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    NgxSpinnerModule,
    AppRoutingModule,
    MatTableModule,
    CdkTableModule,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule
  ],
  declarations: [
    AppComponent,
    LoginComponent
    
  ],
  exports: [LeftSideBarComponent],
  // Added by Naveed - Dated 8/11/2020 - against Attendance
  providers: [PreviousRouteService, DecimalPipe,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: MWHttpInterceptor,
    multi: true
  }
],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
