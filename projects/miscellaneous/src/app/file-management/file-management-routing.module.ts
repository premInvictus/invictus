import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SchoolRecordsComponent } from './school-records/school-records.component';
import { StudentRecordsComponent } from './student-records/student-records.component';
import { TeacherRecordsComponent } from './teacher-records/teacher-records.component';
const routes: Routes = [
	{ path: 'school-records', component: SchoolRecordsComponent },
	{ path: 'student-records', component: StudentRecordsComponent },
	{ path: 'teacher-records', component: TeacherRecordsComponent }	
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class FileManagementRoutingModule { }
