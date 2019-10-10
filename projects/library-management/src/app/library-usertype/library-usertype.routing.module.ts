import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/_guards";
import { ProjectComponent } from "src/app/invictus-shared/project/project.component";
import { SchoolDashboardComponent } from './school/school-dashboard/school-dashboard.component';
import { ViewAllDueComponent } from './school/view-all-due/view-all-due.component';
const routes: Routes = [
    {
        path: '', canActivate: [AuthGuard], redirectTo: 'school', pathMatch: 'full'
    },
    {
        path: 'school', canActivate: [AuthGuard], component: ProjectComponent, children: [
            { path: '', component: SchoolDashboardComponent },
            { path: 'view-all-due', component: ViewAllDueComponent },
            { path: 'auxillary', loadChildren: 'projects/library-management/src/app/auxillaries/auxillaries.module#AuxillariesModule' },
            {
                path: 'circulation-management',
                loadChildren: 'projects/library-management/src/app/circulation-management/circulation-management.module#CirculationManagementModule'
            },
            {
                path: 'catalogue-management',
                loadChildren: 'projects/library-management/src/app/catalogue-management/catalogue-management.module#CatalogueManagementModule'
            }]
    }];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class LibraryusertypeRoutingModule { }