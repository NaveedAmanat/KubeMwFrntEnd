import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbProvider } from './providers/breadcrumb';
import { AdminComponent } from '../layouts/admin/admin.component';
import { LeftSideBarComponent } from '../pages/setup/left-side-bar/left-side-bar.component';
import { BreadCrumbComponent } from './bread-crumb/bread-crumb.component';
import { MatButtonModule, MatCardModule, MatIconModule, MatListModule, MatSidenavModule, MatToolbarModule, MatAutocompleteModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { NgSelectModule } from '@ng-select/ng-select';
import { Uppercase } from './directives/uppercase.directive';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NoDblClickDirective } from './directives/double-click-preventing.directive';
import { InputFieldDirective } from './directives/input-field.directive';
//import { MatSelectSearchModule } from './mat-select-search/mat-select-search.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatInputModule,
    NgSelectModule, MatAutocompleteModule, FormsModule, ReactiveFormsModule
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    AdminComponent,
    LeftSideBarComponent,
    BreadCrumbComponent,
    Uppercase,
    NoDblClickDirective,
    InputFieldDirective
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    LeftSideBarComponent,
    BreadCrumbComponent,
    MatButtonModule,
    MatInputModule,
    NgSelectModule,
    NoDblClickDirective,
    InputFieldDirective
  ],
  providers: [BreadcrumbProvider],
})
export class SharedModule { }
