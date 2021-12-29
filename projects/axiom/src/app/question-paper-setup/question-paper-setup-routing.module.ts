import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QpapersetupComponent } from './qpapersetup/qpapersetup.component';
import { QpsfullyComponent } from './qpsfully/qpsfully.component';
import { QpspartialComponent } from './qpspartial/qpspartial.component';
import { ExpressPaperSetupComponent } from './express-paper-setup/express-paper-setup.component';
const routes: Routes = [
	{ path: '', component: QpapersetupComponent },
	{ path: 'qpsfully', component: QpsfullyComponent },
	{ path: 'qpspartial', component: QpspartialComponent },
	{ path: 'express_paper_setup', component: ExpressPaperSetupComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class QuestionPaperSetupRoutingModule { }
