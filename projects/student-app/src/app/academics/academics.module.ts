import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcademicsRoutingModule } from './academics-routing.module';
import { ViewClassworkComponent } from './view-classwork/view-classwork.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { TimetableComponent } from './timetable/timetable.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import {MatStepperModule} from '@angular/material/stepper';

@NgModule({
  imports: [
    CommonModule,
    AcademicsRoutingModule,
    SharedModuleModule,
    MatStepperModule
  ],
  declarations: [ViewClassworkComponent, AssignmentComponent, TimetableComponent]
})
export class AcademicsModule { }
