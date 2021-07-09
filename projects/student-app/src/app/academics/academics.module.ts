import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcademicsRoutingModule } from './academics-routing.module';
import { ViewClassworkComponent } from './view-classwork/view-classwork.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { TimetableComponent } from './timetable/timetable.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import {MatStepperModule} from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';
import { LiveLocationComponent } from './live-location/live-location.component'

@NgModule({
  imports: [
    CommonModule,
    AcademicsRoutingModule,
    SharedModuleModule,
    MatStepperModule,
    ReactiveFormsModule
  ],
  declarations: [ViewClassworkComponent, AssignmentComponent, TimetableComponent,LiveLocationComponent]
})
export class AcademicsModule { }
