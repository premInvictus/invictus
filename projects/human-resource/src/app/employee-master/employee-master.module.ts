import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeMasterRoutingModule } from './employee-master-routing.module';
import { TabDetailsComponent } from './tab-details/tab-details.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { PersonalContactComponent } from './personal-contact/personal-contact.component';
import { SalaryComponent } from './salary/salary.component';
import { RemarksComponent } from './remarks/remarks.component';
import { ClassSectionComponent } from './class-section/class-section.component';
import { DocumentsComponent } from './documents/documents.component';
import { HrSharedModule } from '../hr-shared/hr-shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    EmployeeMasterRoutingModule,
    HrSharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [TabDetailsComponent, PersonalDetailsComponent, PersonalContactComponent, SalaryComponent, RemarksComponent, ClassSectionComponent, DocumentsComponent]
})
export class EmployeeMasterModule { }
